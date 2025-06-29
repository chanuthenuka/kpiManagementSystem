const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const db = require('../db/db');
const secret = process.env.JWT_SECRET || 'secret';

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    // Extract token from cookie
    (req) => req?.cookies?.jwt_token,
  ]),
  secretOrKey: secret,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      const sql = "SELECT * FROM employee WHERE employeeId = ? AND deleted_at IS NULL";
      db.query(sql, [jwt_payload.employeeId], (err, results) => {
        if (err) return done(err, false);
        if (results.length === 0) return done(null, false);
        return done(null, results[0]);
      });
    })
  );
};
