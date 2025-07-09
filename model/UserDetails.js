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
  goal: String,
  food_allergies: [String]
});

const UserProfileModel = mongoose.model('UserProfile', UserProfileSchema);

export default UserProfileModel;
