import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  activity_level: String,
  weight_goal: String,       // renamed from `goal`
  dietary_pref: String, 
  target_calories: Number,     // new field
  allergies: [String]        // renamed from `food_allergies`
});

const UserProfileModel = mongoose.model('UserProfile', UserProfileSchema);

export default UserProfileModel;
