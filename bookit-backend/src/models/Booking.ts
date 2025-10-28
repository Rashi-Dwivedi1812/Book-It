// src/models/Booking.ts
import { Schema, model, Document } from 'mongoose';

export interface IBooking extends Document {
  user_name: string;
  user_email: string;
  experience_id: Schema.Types.ObjectId; // Reference to the Experience
  slot_id: Schema.Types.ObjectId; // Reference to the sub-document Slot
  promo_code?: string;
  final_price: number;
  booking_status: string;
  created_at: Date;
}

const BookingSchema = new Schema<IBooking>({
  user_name: { type: String, required: true },
  user_email: { type: String, required: true },
  experience_id: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  slot_id: { type: Schema.Types.ObjectId, required: true },
  promo_code: { type: String },
  final_price: { type: Number, required: true },
  booking_status: { type: String, default: 'confirmed' },
  created_at: { type: Date, default: Date.now },
});

const Booking = model<IBooking>('Booking', BookingSchema);
export default Booking;