const mailUtil = require("../../utils/mail");
const moment = require("moment");

const { generateToken } = require("../../utils/crypto");
const { generateImage, createFullQr } = require("../../utils/image");
require("dotenv").config();

const utils = require("util");
const fs = require("fs");
const path = require("path");

fs.readFile = utils.promisify(fs.readFile);

const templateDir = path.join(__dirname, "..", "..", "templates");

const buildHTML = (template = "", obj) => {
  let output = template;
  const keys = Object.keys(obj);
  keys.forEach(key => {
    const regex = new RegExp(`{${key}}`, "g");
    output = output.replace(regex, obj[key]);
  });

  return output;
};

module.exports = {
  name: "GENERATE_QR_AND_SEND_REGISTRATION_EMAIL",
  concurrency: 10,
  handler: async job => {
    const { data } = job;
    const { user, session, attendee } = data;

    const token = generateToken(`${user._id}:${session._id}`);

    // const filename = await generateImage(token);

    // await createFullQr(filename);

    const templateStr = (
      await fs.readFile(path.join(templateDir, "sessionRegistration.html"))
    ).toString();

    const content = buildHTML(templateStr, {
      name: user.name,
      session: session.name,
      // BACKEND_URL: process.env.BACKEND_URL,
      session: session.name,
      // filename,
      start: moment(session.startTime).format("HH:mm"),
      end: moment(session.endTime).format("HH:mm"),
      date: moment(session.date).format("DD/MM/YYYY"),
      code: attendee.code
    });

    mailUtil.sendEmail(
      user.email,
      "Đăng ký thành công khóa học " + session.name,
      content
      // [
      //   {
      //     // stream as an attachment
      //     filename,
      //     content: fs.createReadStream(
      //       path.join(__dirname, "..", "..", "images", filename)
      //     ),
      //     cid: filename
      //   }
      // ] // attatchments
    );
  }
};
