import mongoose from 'mongoose';

const WeeklyMealPlanSchema = new mongoose.Schema({
  email: String,
  mealsByDay: [
    {
      day: Number,
      meals: {
        breakfast: String,
        lunch: String,
        snacks: String,
        dinner: String
      }
    }
  ]
});

const WeeklyMealPlanModel = mongoose.model('WeeklyMealPlan', WeeklyMealPlanSchema);

export default WeeklyMealPlanModel;
