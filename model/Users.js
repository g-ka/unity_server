const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const updated_professional = new Schema({
  id: Number,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  avatar: String,
  domain: String,
  available: Boolean
});

const users = new Schema({
  id: String,
  team_name: String,
  team_members: [Number],
  updated_professionals: [updated_professional]
});

module.exports = model('user', users)