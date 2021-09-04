const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const routes = require("./routes");
const queue = require("./queue");
const BullDashboard = require("bull-board");
dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("ol");
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(routes);

app.use("/admin/queues", BullDashboard.UI);

queue.start();

app.listen(4000, () => {
  console.log("app is running");
});
