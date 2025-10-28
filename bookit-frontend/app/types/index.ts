// app/types/index.ts

// This is the embedded slot document
export interface ISlot {
  _id: string;
  start_time: string; // Will be a string from JSON
  end_time: string;
  is_booked: boolean;
}

// This is the full experience, including slots
export interface IExperienceDetails {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  slots: ISlot[]; // The slots are now included
}
