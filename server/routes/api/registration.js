const { Router } = require("express");
const Registration = require("../../models/registration");
const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  const [registrations, count] = await Promise.all([
    Registration.find({})
      .sort({ created: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .populate("location")
      .populate("province")
      .populate("book"),
    Registration.estimatedDocumentCount()
  ]);

  res.json({
    message: "Success",
    data: { registrations, count }
  });
});

router.post("/", async (req, res) => {
  const { name, address } = req.body;
  const newLocation = new Registration({ name, address });

  await newLocation.save();

  res.send({
    message: "Success",
    data: newLocation
  });
});

router.put("/:_id", async (req, res) => {
  await Registration.findOneAndUpdate(
    { _id: req.params._id },
    { $set: req.body }
  );

  res.json({ message: "Update success" });
});

router.delete("/:_id", async (req, res) => {
  await Registration.findByIdAndDelete(req.params._id);

  res.json({ message: "update success" });
});

module.exports = router;
