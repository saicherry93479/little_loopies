import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "../utils/env";

interface UploadResult {
  key: string;
  url: string;
}

export async function uploadProductFiles(
  productName: string,
  files: File[]
): Promise<UploadResult[]> {
  try {
    const ACCESS_KEY_ID = env("ACCESS_KEY_ID");
    const SECRET_ACCESS_KEY = env("SECRET_ACCESS_KEY");
    const BUCKET_NAME = env("BUCKET_NAME");

    console.log("ACCESS_KEY_ID", ACCESS_KEY_ID);
    console.log("SECRET_ACCESS_KEY", SECRET_ACCESS_KEY);
    console.log("BUCKET_NAME", BUCKET_NAME);

    const client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });

    const results: UploadResult[] = [];
    console.log("uploading files", files);

    for (const file of files) {
      const random = Math.random().toString(36).substring(2, 8);
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const key = `products/${productName}-${random}.${fileExtension}`;

      const contentType = file.type || {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'pdf': 'application/pdf'
      }[fileExtension] || 'application/octet-stream';

      try {
        const upload = new Upload({
          client,
          params: {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: contentType,
            ACL: 'public-read',
            Metadata: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            }
          },
        });

        await upload.done();
        console.log(`File uploaded successfully: ${key}`);

        const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
        results.push({ key, url });
      } catch (uploadError) {
        console.error(`Error uploading file ${file.name}:`, uploadError);
        throw uploadError;
      }
    }

    return results;
  } catch (error) {
    console.error('Error in uploadProductFiles:', error);
    throw error;
  }
}