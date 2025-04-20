import User from "../models/user.js";
import Song from "../models/song.js";
import { sanitizeSongs } from "../services/songSanitizer.js";

// 좋아요 등록
export const likeSong = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;

    const user = await User.findOne({ where: { id: userId } });
    const song = await Song.findOne({ where: { id: songId } });

    if (!user || !song) {
      throw new Error("User or Song not found");
    }

    const alreadyLiked = await user.hasLikedSong(song);
    if (alreadyLiked) {
      throw new Error("Song already liked");
    }

    await user.addLikedSong(song);
    return res.status(201).json({ message: "Song liked successfully", liked: true });
  } catch (error) {
    next(error);
  }
};

// 좋아요 취소
export const unlikeSong = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;

    const user = await User.findOne({ where: { id: userId } });
    const song = await Song.findOne({ where: { id: songId } });

    if (!user || !song) {
      throw new Error("User or Song not found");
    }

    const liked = await user.hasLikedSong(song);
    if (!liked) {
      throw new Error("You haven't liked this song");
    }

    await user.removeLikedSong(song);
    return res.status(200).json({ message: "Song unliked successfully", liked: false });
  } catch (error) {
    next(error);
  }
};

// 내가 좋아요한 곡 목록
export const getMyLikedSongs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const songs = await Song.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: User,
          as: "Likers",
          where: { id: userId },
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const safeSongs = sanitizeSongs(songs); 
    res.status(200).json(safeSongs);
  } catch (error) {
    next(error);
  }
};