var googleStrategy = require('./strategies').googleStrategy;

module.exports = function(passport){
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
        
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });  

  passport.use(googleStrategy);  
};

