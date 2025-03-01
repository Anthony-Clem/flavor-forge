import { S3Client } from "@aws-sdk/client-s3";
import {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  BUCKET_REGION,
} from "./env.config";

export const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});
