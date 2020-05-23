const express = require("express");
const app = express();
const connectDB = require("./config/db.js");
const path = require("path");

// connect database
connectDB();

// init middleware (built-in bodyparser to parse request)
app.use(express.json({ extended: false }));

// app.get("/", (req, res) => {
//   res.send("API RUNNING");
// });

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
