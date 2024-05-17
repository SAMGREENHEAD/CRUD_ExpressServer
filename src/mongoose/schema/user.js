//creating a schema
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  surname: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

//creating a model

export const user = mongoose.model("User", userSchema);
