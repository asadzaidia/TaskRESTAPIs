const express = require("express");
require("./db/mongoose");
const app = express();
const userRoutes  = require("./routers/userRoute");
const taskRoutes = require("./routers/taskRoute");

app.use(express.json()); //automatically parse json body req

const port = process.env.PORT ;

app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
