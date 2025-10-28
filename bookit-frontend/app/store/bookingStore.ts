// app/store/bookingStore.ts
import { create } from 'zustand';
import { IExperienceDetails, ISlot } from '../types';

// 1. Define the state's shape
interface BookingState {
  experience: IExperienceDetails | null;
  slot: ISlot | null;
  setBooking: (experience: IExperienceDetails, slot: ISlot) => void;
  clearBooking: () => void;
}

// 2. Create the store
export const useBookingStore = create<BookingState>((set) => ({
  experience: null,
  slot: null,
  // This function receives the experience and slot and saves them in the state
  setBooking: (experience, slot) => set({ experience, slot }),
  // This function resets the state back to null
  clearBooking: () => set({ experience: null, slot: null }),
}));
