import {
	DeleteObjectCommand,
	DeleteObjectCommandInput,
	DeleteObjectsCommand,
	GetObjectCommand,
	ListObjectsCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import {
	BadRequestException,
	ForbiddenException,
	HttpException,
	Injectable,
	Logger,
} from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class FilesService {
	private readonly logger = new Logger(FilesService.name);
	constructor(
		private readonly appConfigService: AppConfigService,
		private readonly s3Client: S3Client,
	) {}

	async saveFile(
		path: string,
		buffer: Buffer<ArrayBufferLike>,
	): Promise<string> {
		const params = {
			Bucket: this.appConfigService.AWSBucketName,
			Key: path,
			Body: buffer,
		};
		this.logger.log(`Saving file to S3: ${params.Key}`);

		try {
			await this.s3Client.send(new PutObjectCommand(params));
			return params.Key;
		} catch (error) {
			this.logger.error('Error saving file to S3', error);
			throw new BadRequestException('File upload error');
		}
	}

	async deleteFile(key: string) {
		const params: DeleteObjectCommandInput = {
			Bucket: this.appConfigService.AWSBucketName,
			Key: key,
		};
		this.logger.log(`Deleting file from S3: ${params.Key}`);

		try {
			await this.s3Client.send(new DeleteObjectCommand(params));
			this.logger.log(`File deleted successfully: ${params.Key}`);
		} catch (error) {
			this.logger.error('Error deleting file from S3', error);
			throw new BadRequestException('File delete error');
		}
	}

	async deleteFolder(folderPath: string) {
		try {
			const files = await this.s3Client.send(
				new ListObjectsCommand({
					Bucket: this.appConfigService.AWSBucketName,
					Prefix: folderPath,
				}),
			);
			if (!files.Contents || files.Contents.length === 0) {
				this.logger.warn(`No files found in folder: ${folderPath}`);
				return;
			}

			this.logger.log(`Deleting folder: ${folderPath}`);
			await this.s3Client.send(
				new DeleteObjectsCommand({
					Bucket: this.appConfigService.AWSBucketName,
					Delete: {
						Objects: files.Contents.map((file) => ({
							Key: file.Key,
						})),
					},
				}),
			);
			this.logger.log(`Folder deleted successfully: ${folderPath}`);
			if (files.IsTruncated) await this.deleteFolder(folderPath);
		} catch (error) {
			this.logger.error('Error deleting folder from S3', error);
			throw new BadRequestException('Folder delete error');
		}
	}

	async readFile(key: string): Promise<Uint8Array> {
		const params = {
			Bucket: this.appConfigService.AWSBucketName,
			Key: key,
		};
		this.logger.log(`Reading file from S3: ${params.Key}`);

		try {
			const data = await this.s3Client.send(new GetObjectCommand(params));
			if (!data.Body) {
				throw new ForbiddenException('File not found');
			}
			return data.Body.transformToByteArray();
		} catch (error) {
			this.logger.error('Error reading file from S3', error);
			if (error instanceof HttpException) throw error;

			throw new BadRequestException('File read error');
		}
	}
}
