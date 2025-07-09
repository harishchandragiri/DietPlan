import express from 'express';

import WeeklyMealPlanModel from '../model/Diet.js';
import UserProfileModel from '../model/UserDetails.js';

import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

// Create user details collection                        
router.post('/create', verifyUser, async (req, res) => {
  try {
    const result = await UserProfileModel.create({
      email: req.body.email,
      age: req.body.age,
      gender: req.body.gender,
      height: req.body.height,
      weight: req.body.weight,
      activity_level: req.body.activity_level,
      goal: req.body.goal,
      food_allergies: req.body.food_allergies // should be an array
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all meals
router.get('/getmeals', verifyUser, async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required in query parameters' });
    }

    const mealPlans = await WeeklyMealPlanModel.find({ email });

    if (!mealPlans.length) {
      return res.status(404).json({ message: 'No meal plans found for this email' });
    }

    res.json(mealPlans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST route to save the weekly meal plan
router.post('/mealplan', verifyUser, async (req, res) => {
  try {
    const { email, mealsByDay } = req.body;

    // Validation
    if (!email || !Array.isArray(mealsByDay) || mealsByDay.length !== 7) {
      return res.status(400).json({ error: 'Invalid data. Email and 7 meals are required.' });
    }

    const mealPlan = await WeeklyMealPlanModel.create({ email, mealsByDay });

    res.status(201).json({ message: 'Meal plan saved successfully', mealPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Update new meal plan
router.put('/newmealplan', verifyUser, async (req, res) => {
  try {
    const email = req.email; // set by verifyUser middleware
    const { mealsByDay } = req.body;

    if (!Array.isArray(mealsByDay) || mealsByDay.length === 0) {
      return res.status(400).json({ error: 'Invalid data. mealsByDay must be a non-empty array.' });
    }

    // Find & update meal plan by email, replace mealsByDay completely
    const updatedMealPlan = await WeeklyMealPlanModel.findOneAndUpdate(
      { email },                  // filter by decoded email
      { mealsByDay },             // replace mealsByDay
      { new: true, upsert: true } // return updated doc; create if doesn't exist
    );

    res.json({ message: 'Meal plan updated successfully', updatedMealPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// To fetch user details 
router.get('/userdetails', verifyUser, async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required as a query parameter' });
    }

    const profiles = await UserProfileModel.find({ email });

    if (!profiles.length) {
      return res.status(404).json({ message: 'No profiles found for this email' });
    }

    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Weight update route
router.put('/updateweight', verifyUser, async (req, res) => {
  try {
    const email = req.email; // from middleware
    const { weight } = req.body;

    if (typeof weight !== 'number' || weight <= 0) {
      return res.status(400).json({ error: 'Invalid weight. Must be a positive number.' });
    }

    const updatedProfile = await UserProfileModel.findOneAndUpdate(
      { email },               // find by email
      { weight },              // set weight
      { new: true }            // return updated document
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    res.json({ message: 'Weight updated successfully', updatedProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
