const mongoose = require("./base");

const Attendee = mongoose.model("attendee", {
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user"
  },
  session: {
    type: mongoose.Types.ObjectId,
    ref: "session"
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  registrationDate: Date,
  attendDate: Date,
  isAttend: Boolean,
  created: Date
});

module.exports = Attendee;
