const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected...");
  } catch (err) {
    console.log(err.message);
    // exit process with failure
    process.exit(1);
  }
};

console.log(connectDB);

module.exports = connectDB;
