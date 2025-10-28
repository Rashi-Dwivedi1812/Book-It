// src/routes/experienceRoutes.ts
import { Router } from 'express';
import Experience from '../models/Experience'; // Import Mongoose model

const router = Router();

// GET /api/experiences - Return list of experiences (without slots)
router.get('/', async (req, res) => {
  try {
    // We select '-slots' to avoid sending the (potentially large) slots array
    const experiences = await Experience.find().select('-slots');
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/experiences/:id - Return details and all slots
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(experience); // This will include the full slots array
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;