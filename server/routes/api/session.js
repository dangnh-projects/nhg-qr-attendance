const { Router } = require("express");
const Session = require("../../models/session");
const Attendee = require("../../models/attendee");
const School = require("../../models/school");
const User = require("../../models/user");
const { verifyRecaptcha } = require("../../utils/captcha");
const router = Router();

const { randomString, generateToken } = require("../../utils/crypto");

const Queue = require("../../queue");

router.get("/", async (req, res) => {
  const sessions = await Session.find({}).sort({ name: 1 });

  let sessionResponse = await Promise.all(
    sessions.map(async sess => {
      const sessData = sess.toJSON();
      const attendees = await Attendee.find({ session: sess._id });
      sessData.attendees = attendees;

      return sessData;
    })
  );

  res.json({
    message: "Success",
    data: sessionResponse
  });
});

router.get("/:_id", async (req, res) => {
  const session = await Session.findById(req.params._id);

  res.json({ session });
});

router.post("/", async (req, res) => {
  const { name, date, startTime, endTime, code } = req.body;
  try {
    const newSession = new Session({ name, date, startTime, endTime, code });

    await newSession.save();

    res.send({
      message: "Success",
      data: newSession
    });
  } catch (error) {
    if (error && error.code === 11000) {
      const { keyValue } = error;
      const message = Object.keys(keyValue)
        .map(key => `${key}: ${keyValue[key]}`)
        .join(", ");
      res.status(500).json({ message: "Duplicated " + message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

router.put("/:_id", async (req, res) => {
  try {
    await Session.findOneAndUpdate({ _id: req.params._id }, { $set: req.body });

    res.json({ message: "Update success" });
  } catch (error) {
    if (error && error.code === 11000) {
      const { keyValue } = error;
      const message = Object.keys(keyValue)
        .map(key => `${key}: ${keyValue[key]}`)
        .join(", ");
      res.status(500).json({ message: "Duplicated " + message });
      return;
    }
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:_id", async (req, res) => {
  await Session.findByIdAndDelete(req.params._id);
  await Attendee.remove({ session: req.params._id });

  res.json({ message: "update success" });
});

router.get("/:_id/attendees", async (req, res) => {
  const { _id } = req.params;
  let attendees = await Attendee.find({ session: _id })
    .populate({
      path: "user",
      populate: ["department", "school"]
    })
    .populate("session");

  attendees = attendees.map(att => {
    att = att.toJSON();
    if (att.user && att.session)
      att.qr_code = generateToken(`${att.user._id}:${att.session._id}`);

    return att;
  });

  res.json({
    data: attendees
  });
});

const getCode = async (session, schoolCode) => {
  const num = Math.floor(Math.random() * 8999 + 1000);
  const code = `${session.code}${schoolCode}${num}`;
  const ext = await Attendee.findOne({
    session: session._id,
    code
  });
  if (ext) {
    return getCode(session, schoolCode);
  }

  return code;
};

router.post("/:_id/attendee", async (req, res) => {
  const { _id } = req.params;
  const { email, name, department, school } = req.body;

  const session = await Session.findById(_id);
  if (!session) {
    return res.status(404).json({
      message: "Session not exists"
    });
  }

  const schoolObj = await School.findById(school);
  if (!schoolObj) {
    return res.status(404).json({
      message: "School not exists"
    });
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name,
      email,
      department,
      school
    });

    await user.save();
  }

  const attend = await Attendee.findOne({ user: user._id, session: _id });
  if (attend) {
    return res.json({
      data: attend
    });
  }

  const newCode = await getCode(session, schoolObj.code);

  const newAttend = new Attendee({
    user: user._id,
    session: _id,
    created: new Date(),
    code: newCode
  });

  await newAttend.save();
  return res.json({
    data: newAttend
  });
});

router.post("/:_id/email", async (req, res) => {
  const { _id } = req.params;
  const sess = await Session.findById(_id);
  const { attendees } = req.body;
  await Promise.all(
    attendees.map(async att => {
      const attendee = await Attendee.findById(att).populate("user");
      await Queue.enQueue("generateQRandSendEmail", {
        session: sess,
        attendee,
        user: attendee.user
      });
    })
  );

  res.send("ik");
});

router.post("/:id/register", async (req, res) => {
  try {
    const { captchaVal } = req.body;
    process.env.NODE_ENV !== "development" &&
      (await verifyRecaptcha(captchaVal));

    const sess = await Session.findById(req.params.id);
    if (!sess) {
      return res.status(500).json({
        message: "Session not exists"
      });
    }
    const { email, name, department, school } = req.body;
    const schoolObj = await School.findById(school);
    if (!schoolObj) {
      return res.status(404).json({
        message: "School not exists"
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, department, school });
      await user.save();
    }

    let attend = await Attendee.findOne({ user: user._id, session: sess._id });
    if (attend) {
      return res.json({
        data: attend
      });
    }

    const newCode = await getCode(sess, schoolObj.code);

    attend = new Attendee({
      user: user._id,
      session: sess._id,
      created: new Date(),
      code: newCode
    });

    await Queue.enQueue("generateQRandSendRegistrationEmail", {
      session: sess,
      attendee: attend,
      user
    });

    await attend.save();
    return res.json({
      data: attend
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
