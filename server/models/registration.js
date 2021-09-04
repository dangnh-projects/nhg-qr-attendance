const mongoose = require("./base");

const Registration = mongoose.model("registration", {
  name: String,
  email: String,
  phoneNumber: String,
  school: String,
  token: String,
  created: Date,
  image: String,
  verified: { type: Boolean, default: false },
  received: { type: Boolean, default: false },
  receivedDate: Date,
  location: {
    type: mongoose.Types.ObjectId,
    ref: "location"
  },
  province: {
    type: mongoose.Types.ObjectId,
    ref: "province"
  },
  book: {
    type: mongoose.Types.ObjectId,
    ref: "book"
  }
});

module.exports = Registration;
