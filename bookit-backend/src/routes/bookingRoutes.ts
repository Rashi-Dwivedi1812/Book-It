// src/routes/bookingRoutes.ts
import { Router } from 'express';
import Experience from '../models/Experience';
import Booking from '../models/Booking';

const router = Router();

// (Promo code logic is unchanged)
const PROMO_CODES: Record<string, number> = {
  'SAVE10': 0.10, 
  'FLAT100': 100,
};

router.post('/promo/validate', (req, res) => {
  const { promoCode } : { promoCode: string } = req.body;
  if (PROMO_CODES.hasOwnProperty(promoCode)) {
    res.json({ valid: true, code: promoCode, discount: PROMO_CODES[promoCode] });
  } else {
    res.status(404).json({ valid: false, error: 'Invalid promo code' });
  }
});

// POST /api/bookings
router.post('/bookings', async (req, res) => {
  const { 
    experience_id, 
    slot_id, 
    user_name, 
    user_email, 
    promo_code, 
    final_price 
  } = req.body;

  // Simple validation
  if (!experience_id || !slot_id || !user_name || !user_email || !final_price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // --- This is the key logic ---
    // We atomically find the experience AND the specific, unbooked slot.
    // Then, we update that slot's 'is_booked' status in one operation.
    const updatedExperience = await Experience.findOneAndUpdate(
      { 
        _id: experience_id, 
        'slots._id': slot_id, 
        'slots.is_booked': false 
      },
      { 
        // The $ operator updates the specific array element that was matched
        $set: { 'slots.$.is_booked': true } 
      },
      { new: false } // Return the original doc (or null if not found)
    );

    // If updatedExperience is null, it means our query found no match.
    // This means the slot was either not found OR already booked.
    if (!updatedExperience) {
      return res.status(409).json({ error: 'This slot is no longer available or does not exist.' });
    }

    // 2. If the slot was successfully "locked" (updated), we can create the booking.
    const newBooking = await Booking.create({
      experience_id,
      slot_id,
      user_name,
      user_email,
      promo_code,
      final_price,
      booking_status: 'confirmed'
    });

    // 3. Return success
    res.status(201).json({
      success: true,
      booking: newBooking,
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

export default router;