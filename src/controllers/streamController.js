import fs from "fs";
import path from "path";
import Song from "../models/song.js";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const cfAccessKeyId = process.env.CF_ACCESS_KEY_ID;
const privateKeyPath = process.env.CF_PRIVATE_KEY_PATH;
const cfPrivateKey = fs.readFileSync(privateKeyPath, "utf-8");
const distUrl = process.env.DIST_URL;

export const getSignedAudioUrl = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const song = await Song.findOne({ where: { id: songId } });
    if (!song) {
      const error = new Error("Song not found.");
      error.status = 404;
      throw error;
    }

    const bucketUrlPrefix = process.env.AWS_AUDIO_BUCKET_URL;
    const key = song.audioUrl.replace(bucketUrlPrefix, "");
    const cfUrl = `${distUrl}/${key}`;

    const signedUrl = getSignedUrl({
      url: cfUrl,
      keyPairId: cfAccessKeyId,
      privateKey: cfPrivateKey,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 2).toISOString(), // 2분 유효
    });

    return res.status(200).json({ signedUrl });
  } catch (error) {
    next(error);
  }
};
