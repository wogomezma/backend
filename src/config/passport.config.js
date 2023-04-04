const passport = require("passport");
const GithubStrategy = require("passport-github2");
const userModel = require("../dao/models/user.model");
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = require("./config");


const initializePassport = () => {
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/v1/session/github/callback",
        proxy: true,
      scope: ['user:email'] //This is all it takes to get emails
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("PROFILE INFO:", profile);
          console.log("🚀 ~ file: passport.config.js:21 ~ profile.emails:", profile.emails[0].value)
          let user = await userModel.findOne({ email: profile.emails[0].value });
          if (!user) {
            let addNewUser = {
              name: profile._json.name,
              lastname: "github",
              email: profile.emails[0].value,
              password: "",
              rol: "user",
            };
            let newUser = await userModel.create(addNewUser);
            done(null, newUser);
          } else {
            // ya existia el usuario
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById({ _id: id });
    done(null, user);
  });
};

module.exports = initializePassport;