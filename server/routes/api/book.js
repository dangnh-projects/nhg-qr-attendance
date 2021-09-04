const { Router } = require("express");
const Book = require("../../models/book");
const imageUtil = require("../../utils/image");
const router = Router();

router.get("/", async (req, res) => {
  const books = await Book.find({});

  res.json({
    message: "Success",
    data: books
  });
});

router.post("/", async (req, res) => {
  const {
    name,
    name_en,
    author,
    quote,
    quote_en,
    quote_name,
    quote_name_en,
    publisher,
    publisher_en,
    size,
    description
  } = req.body;
  const newBook = new Book({
    name,
    name_en,
    author,
    quote,
    quote_en,
    quote_name,
    quote_name_en,
    publisher,
    publisher_en,
    size,
    description
  });

  if (req.body.image) {
    const imgFile = await imageUtil.base64ToFile(req.body.image);
    newBook.set({ image: imgFile });
  }

  await newBook.save();

  res.send({
    message: "Success",
    data: newBook
  });
});

router.put("/:_id", async (req, res) => {
  if (req.body.image) {
    const imgFile = await imageUtil.base64ToFile(req.body.image);
    req.body.image = imgFile;
  }
  await Book.findOneAndUpdate({ _id: req.params._id }, { $set: req.body });

  res.json({ message: "Update success" });
});

router.delete("/:_id", async (req, res) => {
  await Book.findByIdAndDelete(req.params._id);

  res.json({ message: "update success" });
});

module.exports = router;
