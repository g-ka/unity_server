const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const users = new Schema({
  id: String,
  team_name: String,
  team_members: [Number]
});

module.exports = model('user', users)