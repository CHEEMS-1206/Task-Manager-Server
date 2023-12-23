import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 8 && v.length <= 12;
      },
      message: (props) =>
        `${props.value} is not a valid password. Password must be 8 to 12 characters.`,
    },
  },
  username: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]{5,}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid username. Username must be alphanumeric and at least 5 characters long.`,
    },
  },
});

const user = mongoose.model("user", userSchema);
export default user;