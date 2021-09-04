const mongoose = require("./base");

const Session = mongoose.model("session", {
  name: String,
  date: Date,
  startTime: String,
  endTime: String,
  code: {
    type: String,
    unique: true,
    required: true
  },
  created: Date
});

module.exports = Session;
