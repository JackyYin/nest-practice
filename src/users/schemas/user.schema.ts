import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  google: String,
  facebook: String,
  github: String,
  profile: {
    name: String,
    gender: String,
    picture: String,
    location: String,
  }
});
