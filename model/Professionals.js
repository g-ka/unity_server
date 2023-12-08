const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const professionals = new Schema({
  id: Number,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  avatar: String,
  domain: String,
  available: Boolean
});

module.exports = model('professional', professionals)