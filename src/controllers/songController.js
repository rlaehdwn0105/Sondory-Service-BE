import User from "../models/user.js";
import Song from "../models/song.js";
import RecentPlay from "../models/recentplay.js";
import { sanitizeSongs } from "../services/songSanitizer.js";

// 모든 곡 조회
export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.findAll({
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
      order: [["createdAt", "DESC"]],
    });

    const safeSongs = sanitizeSongs(songs);
    res.status(200).json(safeSongs);
  } catch (error) {
    next(error);
  }
};

// 특정 유저의 전체 곡 조회
export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || id !== req.user.id) {
      const error = new Error("Song ID required or invalid.");
      error.status = 400;
      throw error;
    }

    const songs = await Song.findAll({
      where: { UploaderId: id },
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
      order: [["createdAt", "DESC"]],
    });

    const safeSongs = sanitizeSongs(songs);
    res.status(200).json(safeSongs);
  } catch (error) {
    next(error);
  }
};

// 최근 곡 조회
export const getrRecentSongs = async (req, res, next) => {
  try {
    const recentSongs = await RecentPlay.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Song,
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
        },
      ],
      order: [["playedAt", "DESC"]],
    });

    const onlySongs = recentSongs.map((i) => i.Song);
    const safeSongs = sanitizeSongs(onlySongs);
    res.status(200).json(safeSongs);
  } catch (error) {
    next(error);
  }
};

// 최근 재생 노래 Create OR Update
export const updateRecentSongs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;

    if (!userId || !songId) {
      const error = new Error("User ID or Song ID is missing.");
      error.status = 400;
      throw error;
    }

    const existing = await RecentPlay.findOne({
      where: {
        UserId: userId,
        SongId: songId,
      },
    });

    if (existing) {
      await existing.update({ playedAt: new Date() });
    } else {
      await RecentPlay.create({
        UserId: userId,
        SongId: songId,
        playedAt: new Date(),
      });
    }

    return res.status(200).json({ message: "Recent play updated" });
  } catch (error) {
    next(error);
  }
};
