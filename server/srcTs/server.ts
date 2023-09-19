import { config } from "dotenv";
import express, { Application } from "express";
import appDataSource from "./Database/DataSource";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserEntity } from "./Database/Entities/user.entity";
import session from "express-session";
import { masterRoutes } from "./Routes/master.routes";
import path from "path";

config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET as string;

const startServer = async () => {
  try {
    console.log("Connecting to database....");
    await appDataSource.initialize();
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Unable to connect to database", error);
  }
};

app.use(express.static(__dirname + "/../build"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user: UserEntity, done) {
  if (user?.id) {
    return done(null, user);
  }
  return done("No User Found", false);
});

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      const userRepo = appDataSource.getRepository(UserEntity);

      const user = await userRepo.findOne({
        where: {
          username,
        },
      });

      if (!user || !user.validatePassword(password)) {
        return done("Invalid username or password", false);
      }

      return done(null, {
        ...user,
        hash: undefined,
      } as Partial<UserEntity>);
    }
  )
);

startServer();

app.use(masterRoutes);

app.get("/*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});
