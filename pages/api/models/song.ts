import mongoose from "mongoose";

export interface Song {
    name: string,
    artist: string,
    duration: number, // minutes (rounded)
    request_count: number,
    play: number,
    spotify_id: string,
    party_ac: string,
}

export const spotifyToSongs = (spotifyData: Array<object>, play: number, party_ac: string): Array<Song> => {
  return spotifyData.map((obj: any) => {
    if (isSong(obj)) {
      obj.play = play;
      obj.party_ac = party_ac;
      return obj;
    }
    const durationInMinutes = Math.round(obj.duration_ms / 60000); // convert duration from ms to minutes and round to nearest minute
    const song: Song = {
      name: obj.name,
      artist: obj.artists[0].name,
      duration: durationInMinutes,
      request_count: 1,
      play: play,
      spotify_id: obj.uri,
      party_ac: party_ac,
    };
    return song;
  });
};

const isSong = (obj: any): obj is Song => {
  return (
    obj &&
    obj.name &&
    obj.artist &&
    obj.duration &&
    obj.request_count &&
    obj.spotify_id &&
    obj.party_ac
  );
};

export const getSpotifyIds = (spotifyData: Array<object>): Array<string> => {
  return spotifyData.map((obj: any) => {
    return obj.uri;
  });
};

export const songSchema = new mongoose.Schema<Song>({
    name: String,
    artist: String,
    duration: Number,
    request_count: Number,
    play: Number,
    spotify_id: String,
    party_ac: String,
  });

export default mongoose.models.Song || mongoose.model<Song>('Song', songSchema, 'songs');
