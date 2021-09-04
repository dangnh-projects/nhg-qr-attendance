const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB || "mongodb://localhost:27017/qr-survey", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.Promise = Promise;

module.exports = mongoose;
