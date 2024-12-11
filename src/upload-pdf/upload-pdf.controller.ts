import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as multer from 'multer';
import { Express } from 'express';
import { FileVersion } from './upload-pdf.entity'; 
import { UploadPdfService } from './upload-pdf.service';

@Controller('upload-pdf')
export class UploadPdfController {
  private s3 = new AWS.S3();

  constructor(private readonly fileVersionService: UploadPdfService) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const versionId = uuidv4(); // Unique version ID
      const fileName = `${file.originalname.split('.')[0]}_${versionId}.pdf`; // Append version ID to file name

      const s3Params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ContentType: 'application/pdf',
      };

      // Upload to S3
      const uploadResult = await this.s3.upload(s3Params).promise();

      // Save metadata to database
      const savedVersion = await this.fileVersionService.createFileVersion({
        crn: file.originalname.split('.')[0],
        version: versionId,
        s3Path: uploadResult.Location,
      });

      return {
        message: 'File uploaded successfully',
        version: savedVersion,
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  @Get(':crn/versions')
  async getFileVersions(@Param('crn') crn: string) {
    return this.fileVersionService.getFileVersions(crn);
  }
}
