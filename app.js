const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userroutes");
require("./config/db");
const app = express();

//for middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/users", userRouter);

//api/users : GET
// api/users/:id : GET
//api/users/ :POST
//api/users/:id : PATCH
// api/users/:id : DELETE

//for get method
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./views/index.html");
});

//route not found error
app.use((req, res, next) => {
  res.status(404).json({
    message: "route not found",
  });
});

//handling server error
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "something broke",
  });
});
module.exports = app;
