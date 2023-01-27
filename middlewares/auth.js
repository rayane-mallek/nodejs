const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const secret = "klahfaik?FLMKAHZGOPIAZHGpfklkdmgùzgjnùm942";
require('dotenv').config();

const passportJWT = new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    jsonWebTokenOptions: {
        ignoreExpiration: false,
    },
    secretOrKey: secret,
    algorithms: ['HS256'],
}, async (jwtPayload, next) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://'+process.env.DB_NAME+'.restdb.io/rest/utilisateurs',
            headers: { 'x-apikey': process.env.API_KEY },
        };
        
        const response = await axios(options);
        const users = response.data;
        const user = users.find(user => user.email === jwtPayload.email);
        
        if (user) {
            return next(null, user);
        } else {
            return next(null, false);
        }

    } catch (error) {
        return next(error, false);
    }
});

module.exports = {
    passportJWT
}
