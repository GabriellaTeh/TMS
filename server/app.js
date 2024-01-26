const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(cors());

const routes = require("./routes/routes");

app.use("/", routes);

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Server started on port ${process.env.PORT}`);
});
