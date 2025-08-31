import {
    GetObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    HeadObjectCommand,
    GetObjectCommandOutput,
    DeleteObjectCommandOutput,
    ListObjectsV2CommandOutput,
    HeadObjectCommandOutput,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import r2 from "./r2";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getFileInfo(key: string): Promise<HeadObjectCommandOutput> {
    const command = new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
    });

    return await r2.send(command);
}

export async function downloadFile(key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
    });

    return await r2.send(command);
}

export async function deleteFile(key: string): Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
    });

    return await r2.send(command);
}

export async function listFiles(prefix: string = ''): Promise<ListObjectsV2CommandOutput> {
    const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        Prefix: prefix,
    });

    return await r2.send(command);
}

export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
    });

    return await getSignedUrl(r2, command, { expiresIn });
}

export async function getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        ContentType: contentType,
    });

    return await getSignedUrl(r2, command, { expiresIn });
}