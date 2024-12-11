
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileVersion } from './upload-pdf.entity';
@Injectable()
export class UploadPdfService {
  constructor(
    @InjectRepository(FileVersion)
    private fileVersionRepository: Repository<FileVersion>,
  ) {}

  async createFileVersion(data: { crn: string; version: string; s3Path: string }) {
    const fileVersion = this.fileVersionRepository.create(data);
    return this.fileVersionRepository.save(fileVersion);
  }

  async getFileVersions(crn: string) {
    return this.fileVersionRepository.find({
      where: { crn },
      order: { createdAt: 'DESC' },
    });
  }
}
