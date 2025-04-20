import { S3Client, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const checkObjectExists = async (Bucket, Key) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket, Key }));
    return true;
  } catch (error) {
    if (error.name === "NotFound") return false;
    throw error; 
  }
};

export const deleteS3Files = async ({ audioKey, imageKey }) => {
  try {
    const deleteOps = [];

    if (await checkObjectExists(process.env.AWS_AUDIO_BUCKET, audioKey)) {
      deleteOps.push(
        s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_AUDIO_BUCKET, Key: audioKey }))
      );
    }

    if (await checkObjectExists(process.env.AWS_IMAGE_ORIGIN_BUCKET, imageKey)) {
      deleteOps.push(
        s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_IMAGE_ORIGIN_BUCKET, Key: imageKey }))
      );
    }

    if (await checkObjectExists(process.env.AWS_IMAGE_RESIZED_BUCKET, imageKey)) {
      deleteOps.push(
        s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_IMAGE_RESIZED_BUCKET, Key: imageKey }))
      );
    }
    if (deleteOps.length > 0) {
      await Promise.all(deleteOps);
    }

  } catch (err) {
    throw new Error("S3 deletion failed");
  }
};
