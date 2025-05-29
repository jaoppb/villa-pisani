import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { AppConfigService } from 'src/app-config/app-config.service';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { FilesService } from './files.service';

@Module({
	providers: [
		{
			provide: S3Client,
			useFactory: (appConfigService: AppConfigService) => {
				return new S3Client({
					region: appConfigService.AWSRegion,
					credentials: {
						accessKeyId: appConfigService.AWSAccessKeyId,
						secretAccessKey: appConfigService.AWSSecretAccessKey,
					},
					endpoint: appConfigService.AWSEndpoint,
					forcePathStyle: appConfigService.AWSEndpoint !== undefined,
				});
			},
			inject: [AppConfigService],
		},
		FilesService,
	],
	imports: [AppConfigModule],
	exports: [S3Client, FilesService],
})
export class FilesModule {}
