import mongoose from 'mongoose';
// https://mongoosejs.com/docs/guide.html

// mongoose schema is defining MongoDB indexes
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

export const users = mongoose.model('user', userSchema);
