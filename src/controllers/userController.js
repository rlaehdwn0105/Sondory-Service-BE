import Song  from "../models/song.js";
import RecentPlay from "../models/recentplay.js";
import User from "../models/user.js";
import { deleteS3Files } from "../services/s3Delete.js";
import { sanitizeSongs } from "../services/songSanitizer.js";


// 내가 업로드한 곡 목록
export const getMySongs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) throw new Error("User not found");

    const songs = await Song.findAll({
      where: { UploaderId: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
      ],
    });
    const safeSongs = sanitizeSongs(songs);

    res.status(200).json(safeSongs);
  } catch (error) {
    next(error);
  }
};

// 곡 업로드
export const uploadSong = async (req, res, next) => {
  try {
    const { title, coverUrl, songUrl, duration } = req.body;
    if (!title || !coverUrl || !duration || !songUrl) {
      throw new Error("All fields are required");
    }
    console.log("req.body", req.body);
    const user = req.user;
    if (!user) throw new Error("User not found");

    const fullCoverUrl = `${process.env.AWS_IMAGE_RESIZED_BUCKET_URL}${coverUrl}`;
    const fullAudioUrl = `${process.env.AWS_AUDIO_BUCKET_URL}${songUrl}`;

    const newSong = await Song.create({
      title,
      coverUrl: fullCoverUrl,
      audioUrl: fullAudioUrl,
      duration,
      UploaderId: user.id,
    });

    res.status(201).json(newSong);
  } catch (error) {
    next(error);
  }
};

// 업로드한 곡 삭제
export const deleteSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const user = req.user;

    const song = await Song.findOne({ where: { id: songId } });
    if (!song) throw new Error("Song not found");

    if (song.UploaderId !== user.id) {
      throw new Error("You are not the uploader of this song");
    }

    const extractKey = (url, baseUrl) => url.replace(baseUrl, "");
    const audioKey = extractKey(song.audioUrl, process.env.AWS_AUDIO_BUCKET_URL);
    const imageKey = extractKey(song.coverUrl, process.env.AWS_IMAGE_RESIZED_BUCKET_URL);

    await deleteS3Files({ audioKey, imageKey });
    const playRecord = await RecentPlay.findOne({
      where: {
        SongId: songId,
        UserId: user.id,
      },
    });

    if (playRecord) {
      await playRecord.destroy();
      console.log("RecentPlay record deleted");
    }
    await song.destroy();
    return res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    next(error);
  }
};