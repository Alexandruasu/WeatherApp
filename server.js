const express = require("express");
const session = require("express-session");
const app = express();

const { fetchCurrentWeatherData } = require("./api");
const { db, checkCredentials, createUser } = require("./db");

const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", isAuthenticated, (req, res) => {
  res.render("index");
});

app.get("/weather", isAuthenticated, async (req, res) => {
  const city = req.query.city || "Bucharest";
  const weatherData = await fetchCurrentWeatherData(city);
  res.render("weather", {
    weather: weatherData.current,
    location: weatherData.location,
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/register",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }
    if (username.length < 4 || password.length < 6) {
      return res
        .status(400)
        .send(
          "Username must be at least 4 characters and password must be at least 6 characters",
        );
    }

    try {
      createUser(username, password);
    } catch (error) {
      if (error.message === "User already exists") {
        return res.status(400).send("User already exists");
      }
      console.error("Error creating user:", error);
      return res.status(500).send("An error occurred while creating the user");
    }
    res.redirect("/login");
  },
);

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await checkCredentials(username, password);
      req.session.userId = user.id;
      res.redirect("/");
    } catch (error) {
      if (
        error.message === "User not found" ||
        error.message === "Invalid password"
      ) {
        return res.status(400).send("Invalid username or password");
      }
      console.error("Error checking credentials:", error);
      return res
        .status(500)
        .send("An error occurred while checking the credentials");
    }
  },
);

app.post("/logout", isAuthenticated, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
}

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
