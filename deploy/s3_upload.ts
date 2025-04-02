import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { createReadStream } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, relative } from 'path';

dotenv.config();

interface UploadResult {
  success: boolean;
  uploadedFiles: number;
  totalFiles: number;
  errors: Array<{ file: string; error: string }>;
}

class S3Uploader {
  private s3Client: S3Client;
  private errors: Array<{ file: string; error: string }> = [];

  constructor(region: string = 'ap-southeast-1') {
    this.s3Client = new S3Client({
      region,
      credentials:
        process.env.aws_access_key_id && process.env.aws_secret_access_key
          ? {
              accessKeyId: process.env.aws_access_key_id,
              secretAccessKey: process.env.aws_secret_access_key,
            }
          : undefined,
    });
  }

  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this.getAllFiles(fullPath)));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  private async uploadFile(localPath: string, bucket: string, s3Key: string): Promise<boolean> {
    try {
      const fileStream = createReadStream(localPath);
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: fileStream,
        ContentType: (() => {
          const extension = s3Key.split('.').pop()?.toLowerCase() || '';

          switch (extension) {
            case 'html':
              return 'text/html';
            case 'css':
              return 'text/css';
            case 'js':
              return 'application/javascript';
            case 'json':
              return 'application/json';
            case 'png':
              return 'image/png';
            case 'jpg':
            case 'jpeg':
              return 'image/jpeg';
            case 'svg':
              return 'image/svg+xml';
            default:
              return 'application/octet-stream';
          }
        })(),
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      this.errors.push({
        file: localPath,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  public async uploadFolder(
    localFolderPath: string,
    bucketName: string,
    s3Prefix: string = ''
  ): Promise<UploadResult> {
    try {
      // Check if folder exists
      const folderStats = await stat(localFolderPath);
      if (!folderStats.isDirectory()) {
        throw new Error(`${localFolderPath} is not a directory`);
      }

      // Get all files
      const files = await this.getAllFiles(localFolderPath);
      if (files.length === 0) {
        console.warn(`No files found in ${localFolderPath}`);
        return {
          success: false,
          uploadedFiles: 0,
          totalFiles: 0,
          errors: [],
        };
      }

      // Upload files with progress
      let successCount = 0;
      const totalFiles = files.length;
      let currentFile = 0;

      for (const file of files) {
        const relativePath = relative(localFolderPath, file);
        const s3Key = join(s3Prefix, relativePath).replace(/\\/g, '/');

        const success = await this.uploadFile(file, bucketName, s3Key);
        if (success) successCount++;

        currentFile++;
        const progress = ((currentFile / totalFiles) * 100).toFixed(2);
        process.stdout.write(`\rUploading: ${progress}% (${currentFile}/${totalFiles})`);
      }

      console.log('\n'); // New line after progress bar

      return {
        success: successCount === totalFiles,
        uploadedFiles: successCount,
        totalFiles,
        errors: this.errors,
      };
    } catch (error) {
      console.error(
        'Error during upload:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return {
        success: false,
        uploadedFiles: 0,
        totalFiles: 0,
        errors: [{ file: localFolderPath, error: 'Failed to process folder' }],
      };
    }
  }
}

// Example usage
async function main() {
  const uploader = new S3Uploader();

  const localFolder = process.argv[2] || '../out';
  const bucketName = process.argv[3] || process.env.bucket_name || 'abstract';
  const s3Prefix = process.argv[4] || '';

  console.log(`Starting upload from ${localFolder} to ${bucketName}`);

  const result = await uploader.uploadFolder(localFolder, bucketName, s3Prefix);

  if (result.success) {
    console.log('All files uploaded successfully!');
  } else {
    console.log(`Upload completed with some errors:`);
    console.log(`Successfully uploaded: ${result.uploadedFiles}/${result.totalFiles} files`);
    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(({ file, error }) => {
        console.log(`- ${file}: ${error}`);
      });
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}
