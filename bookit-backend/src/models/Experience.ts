// src/models/Experience.ts
import { Schema, model, Document } from 'mongoose';

// Interface for a Slot (sub-document)
export interface ISlot extends Document {
  start_time: Date;
  end_time: Date;
  is_booked: boolean;
}

// Interface for an Experience (main document)
export interface IExperience extends Document {
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  slots: ISlot[]; // Array of embedded slot sub-documents
}

// Schema for the embedded slots
const SlotSchema = new Schema<ISlot>({
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  is_booked: { type: Boolean, default: false },
});

// Schema for the main experience document
const ExperienceSchema = new Schema<IExperience>({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String },
  slots: [SlotSchema], // Embed the SlotSchema
});

const Experience = model<IExperience>('Experience', ExperienceSchema);
export default Experience;