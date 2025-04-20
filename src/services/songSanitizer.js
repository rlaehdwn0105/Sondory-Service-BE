export const sanitizeSongs = (songs) => {
    return songs.map((song) => {
      const s = song.toJSON();
      s.audioUrl = ""; 
      return s;
    });
  };