import mongoose from "mongoose";

export interface Party {
    name: string, 
    duration: number, // minutes
    energy_curve: number[], // range = [0,1]
    chaos: number, // range: [0,100], low == focus on attendee picks, high == more recommendations from spotify included (hence more chaos)
    invite_link: string,
    attendees: number,
    access_code: string,
    requests: string[][],
    mustPlays: string[],
    doNotPlays: string[],
}

const partySchema = new mongoose.Schema<Party>({
    name: String,
    duration: Number,
    energy_curve: [Number],
    chaos: Number,
    invite_link: String,
    attendees: Number,
    access_code: String,
    requests: [[String]],
    mustPlays: [String],
    doNotPlays: [String]
});

export default mongoose.models.Party || mongoose.model<Party>('Party', partySchema, 'parties');
