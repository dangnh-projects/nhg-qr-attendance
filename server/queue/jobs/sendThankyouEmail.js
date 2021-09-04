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
  name: "SEND_THANK_YOU_EMAIL",
  concurrency: 10,
  handler: async job => {
    const { data } = job;
    const { user, session } = data;

    const templateStr = (
      await fs.readFile(path.join(templateDir, "checkinEmail.html"))
    ).toString();

    const content = buildHTML(templateStr, {
      name: user.name,
      session: session.name,
      start: moment(session.startTime).format("HH:mm"),
      end: moment(session.endTime).format("HH:mm"),
      date: moment(session.date).format("DD/MM/YYYY")
    });

    mailUtil.sendEmail(user.email, "Thư cảm ơn tham gia khóa học", content);
  }
};
