// src/seed.ts
import 'dotenv/config';
import connectDB from './db';
import Experience from './models/Experience';
import Booking from './models/Booking';
import mongoose from 'mongoose';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Database connected for seeding...');

    // Clear existing data
    await Booking.deleteMany({});
    await Experience.deleteMany({});
    console.log('Cleared old data...');

    // Seed Experiences
    await Experience.create([
      {
        title: 'Scuba Diving in Bali',
        description: 'Explore the vibrant coral reefs of Tulamben.',
        location: 'Bali, Indonesia',
        price: 1200.00,
        image_url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2070', 
        slots: [
          { start_time: '2025-12-01T09:00:00Z', end_time: '2025-12-01T11:00:00Z' },
          { start_time: '2025-12-01T12:00:00Z', end_time: '2025-12-01T14:00:00Z' },
        ],
      },
      {
        title: 'Kyoto Temple Walk',
        description: 'A guided historical walk through Kyoto.',
        location: 'Kyoto, Japan',
        price: 800.00,
        image_url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989',
        slots: [
          { start_time: '2025-11-22T10:00:00Z', end_time: '2025-11-22T13:00:00Z' },
          { start_time: '2025-11-22T14:00:00Z', end_time: '2025-11-22T17:00:00Z' },
          { start_time: '2025-11-22T18:00:00Z', end_time: '2025-11-22T21:00:00Z', is_booked: true }, // A pre-booked one
        ],
      },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect(); // Close the connection
    console.log('Database connection closed.');
  }
};

seedDatabase();