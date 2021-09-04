const { Router } = require("express");
const user = require("./user");
const location = require("./location");
const registration = require("./registration");
const province = require("./province");
const book = require("./book");
const session = require("./session");
const department = require("./department");
const attendee = require("./attendee");
const school = require("./school");

const Registration = require("../../models/registration");
const Location = require("../../models/location");
const Province = require("../../models/province");
const User = require("../../models/user");
const Session = require("../../models/session");
const Attendee = require("../../models/attendee");

const { verifyToken } = require("../../utils/crypto");
const Queue = require("../../queue");
const { authenticated } = require("./middleware");
require("dotenv").config();

const router = Router();

router.use("/user", user);
// router.use("/location", [authenticated], location);
router.use("/location", location);
router.use("/registration", registration);
router.use("/province", province);
router.use("/book", book);
router.use("/session", session);
router.use("/department", department);
router.use("/attendee", attendee);
router.use("/school", school);

router.post("/scan", async (req, res) => {
  try {
    const { token } = req.body;
    const email = verifyToken(token);
    const user = await Registration.findOne({ email });
    if (!user) {
      throw new Error("Người dùng không tồn tại trong hệ thống");
    }
    // if (user.verified) {
    //   throw new Error("This user need to verify first");
    // }

    if (user.checked) {
      throw new Error("This QR Code have been used");
    }

    // user.checked = true;
    // user.checkDate = new Date();

    // await user.save();

    res.json({
      message: "Success",
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;
    const [userId, sessionId] = verifyToken(token).split(":");

    const [user, session, attendee] = await Promise.all([
      User.findById(userId),
      Session.findById(sessionId),
      Attendee.findOne({ session: sessionId, user: userId })
    ]);
    res.json({
      message: "Success",
      user,
      session,
      attendee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/check-code", async (req, res) => {
  try {
    const { code } = req.body;
    const attendee = await Attendee.findOne({ code })
      .populate("user")
      .populate("session");

    if (!attendee) {
      throw new Error("Mã đăng ký không tồn tại trong hệ thống");
    }

    res.json({
      message: "Success",

      attendee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/attend", async (req, res) => {
  try {
    const { _id } = req.body;
    const attendee = await Attendee.findById(_id)
      .populate("user")
      .populate("session");

    if (!attendee) {
      throw "Đăng ký không tồn tại";
    }

    attendee.set({
      isAttend: true,
      attendDate: new Date()
    });

    // registration.received = true;
    // registration.receivedDate = new Date();
    // registration.location = location;
    // registration.province = province;

    await attendee.save();

    await Queue.enQueue("sendThankyouEmail", {
      user: attendee.user,
      session: attendee.session
    });

    res.send({ message: "Success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/count", async (req, res) => {
  const [
    countLocation,
    countRegistration,
    countReceived,
    countUser
  ] = await Promise.all([
    Location.estimatedDocumentCount(),
    Registration.estimatedDocumentCount(),
    Registration.countDocuments({ received: true }),
    User.estimatedDocumentCount()
  ]);

  res.json({
    count: {
      location: countLocation,
      registration: countRegistration,
      received: countReceived,
      user: countUser
    }
  });
});

const getRegistrationStat = (condition = {}, dateField = "$created") => {
  return Registration.aggregate([
    { $match: condition },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: dateField },
          month: { $month: dateField },
          year: { $year: dateField }
        },
        count: { $sum: 1 },
        date: { $first: dateField }
      }
    },
    {
      $project: {
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" }
        },
        count: 1,
        _id: 0
      }
    }
  ]);
};

router.get("/dashboard/by-date", async (req, res) => {
  const registrationByDate = await getRegistrationStat();
  const receivedByDate = await getRegistrationStat(
    { received: true },
    "$receivedDate"
  );

  res.json({
    registrationByDate,
    receivedByDate
  });
});

router.get("/dashboard/by-location", async (req, res) => {
  const locations = await Registration.aggregate([
    { $match: { received: true } },
    {
      $group: {
        _id: "$location",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        location: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);

  const registrationByLocation = await Promise.all(
    locations.map(async location => {
      const item = await Location.findById(location.location);
      return {
        name: item.name,
        count: location.count
      };
    })
  );

  res.json(registrationByLocation);
});

router.get("/dashboard/by-province", async (req, res) => {
  const provinces = await Registration.aggregate([
    {
      $group: {
        _id: "$province",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        province: "$_id",
        count: 1,
        _id: 0
      }
    }
  ]);

  const registrationByProvince = await Promise.all(
    provinces.map(async province => {
      const item = await Province.findById(province.province);

      return {
        name: item.name,
        count: province.count
      };
    })
  );

  res.json(registrationByProvince);
});

router.get("/dashboard/by-type", async (req, res) => {
  const [countStudent, countTeacher, countParent] = await Promise.all([
    Registration.countDocuments({ isStudent: true }),
    Registration.countDocuments({ isTeacher: true }),
    Registration.countDocuments({ isParent: true })
  ]);
  res.json({
    countStudent,
    countTeacher,
    countParent
  });
});

router.get("/dashboard/stat", async (req, res) => {
  const sessions = await Session.find().sort({ created: -1 });
  const responseSession = await Promise.all(
    sessions.map(async sess => {
      const [attends, notAttends] = await Promise.all([
        Attendee.find({ session: sess._id, isAttend: true }).populate({
          path: "user",
          populate: ["department", "school"]
        }),
        Attendee.find({
          session: sess._id,
          $or: [
            {
              isAttend: false
            },
            {
              isAttend: {
                $exists: false
              }
            }
          ]
        }).populate({
          path: "user",
          populate: ["department", "school"]
        })
      ]);

      sess = sess.toJSON();
      sess.attends = attends;
      sess.notAttends = notAttends;

      return sess;
    })
  );

  res.json({
    sessions: responseSession
  });
});

module.exports = router;
