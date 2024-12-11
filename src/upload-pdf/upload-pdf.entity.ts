import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class FileVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  crn: string; // File name identifier (CRN)

  @Column()
  version: string; // Unique version ID

  @Column()
  s3Path: string; // S3 URL for the PDF

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
