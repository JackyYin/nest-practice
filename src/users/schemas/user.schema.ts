import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
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

UserSchema.methods.comparePassword = async function(candidatePassword) {
  console.log(this.password);
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};
