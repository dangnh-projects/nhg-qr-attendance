const mongoose = require("./base");

const Book = mongoose.model("book", {
  name: String,
  name_en: String,
  author: String,
  image: String,
  quote: String,
  quote_en: String,
  quote_name: String,
  quote_name_en: String,
  publisher: String,
  publisher_en: String,
  size: String,
  description: String,
  description_en: String,
  created: Date
});

module.exports = Book;
