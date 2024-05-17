import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.js";
import { user } from "../mongoose/schema/user.js";

//stored user iD IN SESSION
passport.serializeUser((user, done) => {
  console.log(" inside the serialise user");
  done(null, user.id);
});

//take user id and unpack who its is
passport.deserializeUser(async (id, done) => {
  console.log(" in the deserialize user");
  console.log(`deserialized user id ${id}`);
  try {
    const finduser = await user.findById(id);
    if (!finduser) throw new Error(`User ${id} not found`);
    done(null, finduser);
  } catch (err) {
    done(err, null);
  }
});
//for validating user
export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const finduser = await user.findOne({ username: username });
      if (!finduser) throw new Error("User not found");
      if (finduser.password !== password) throw new Error("invalid password");
      done(null, finduser);
    } catch (err) {
      done(err, null);
    }
  })
);
