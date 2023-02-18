import mongoose from "mongoose";

export interface Song {
    name: string,
    artist: string,
    duration: number, // minutes (rounded)
    request_count: number,
    play: number,
    spotify_id: string,
    party_id: string,
}

export const songSchema = new mongoose.Schema<Song>({
    name: String,
    artist: String,
    duration: Number,
    request_count: Number,
    play: Number,
    spotify_id: String,
    party_id: String,
  });

export default mongoose.models.Song || mongoose.model<Song>('Song', songSchema, 'songs');
