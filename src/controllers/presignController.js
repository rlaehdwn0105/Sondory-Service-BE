import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generatePresignedUrl = async (req, res, next) => {
  try {
    const { filename, contentType, type } = req.body;

    if (!filename || !contentType || !type) {
      throw new Error("Missing filename, contentType, or type");
    }

    const ext = filename.split(".").pop();

    const audioBucket = process.env.AWS_AUDIO_BUCKET;
    const imageBucket = process.env.AWS_IMAGE_ORIGIN_BUCKET;

    let folder = "";
    let bucket = "";

    if (type === "audio") {
      folder = "audio";
      bucket = audioBucket;
    } else if (type === "image") {
      folder = "coverimage";
      bucket = imageBucket;
    } else {
      throw new Error("Invalid file type");
    }

    const key = `${folder}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    res.status(200).json({ presignedUrl, key });
  } catch (error) {
    next(error);
  }
};