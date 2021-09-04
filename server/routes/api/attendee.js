const { Router } = require("express");
const Attendee = require("../../models/attendee");
const router = Router();

router.delete("/:_id", async (req, res) => {
  await Attendee.findByIdAndDelete(req.params._id);

  res.json({ message: "Delete success" });
});

module.exports = router;
