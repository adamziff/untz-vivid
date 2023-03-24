import mongoose from "mongoose";

// import { v4 as uuidv4 } from 'uuid';
const { v4: uuidv4 } = require('uuid');


export interface PartyType {
    name: string, 
    duration: number, // minutes
    energy_curve: number[], // range = [0,1]
    chaos: number, // range: [0,100], low == focus on attendee picks, high == more recommendations from spotify included (hence more chaos)
    invite_link: string,
    attendees: number,
    access_code: string,
    guest_code: string,
    requests: string[][],
    mustPlays: string[],
    doNotPlays: string[],
}

const partySchema = new mongoose.Schema<PartyType>({
    name: String,
    duration: Number,
    energy_curve: [Number],
    chaos: Number,
    invite_link: String,
    attendees: Number,
    access_code: { type: String, default: uuidv4, unique: true },
    guest_code: { type: String, default: uuidv4, unique: true },
    requests: [[String]],
    mustPlays: [String],
    doNotPlays: [String]
});

// Middleware to set the invite_link field when a new Party is created
partySchema.pre('save', function(this: PartyType, next) {
    this.invite_link = process.env.BASE_URL + `/guest/request-songs?guestCode=${this.guest_code}`;
    next();
});

export default mongoose.models.Party || mongoose.model<PartyType>('Party', partySchema, 'parties');
