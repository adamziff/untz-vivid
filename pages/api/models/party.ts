import mongoose from "mongoose";

export interface Party {
    name: string, 
    duration: number, // minutes
    energy_curve: number[], // range = [0,1]
    chaos: number, // range: [0,100], low == focus on attendee picks, high == more recommendations from spotify included (hence more chaos)
    date: Date,
    invite_link: string,
    attendees: number,
    host_id: string,
    access_code: string,
}

const partySchema = new mongoose.Schema<Party>({
    name: String,
    duration: Number,
    energy_curve: [Number],
    chaos: Number,
    date: Date,
    invite_link: String,
    attendees: Number,
    host_id: String,
    access_code: String,
});

export default mongoose.models.Party || mongoose.model<Party>('Party', partySchema, 'parties');
