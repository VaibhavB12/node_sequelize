const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const config = require("./config/config");
const models = require("./models");

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(config.COOKIE_SECRET));

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/products", require("./routes/product.routes"));

// Database sync
models.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
  });
