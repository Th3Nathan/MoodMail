var GoogleStrategy = require('passport-google-oauth2').Strategy; 
var User = require('./../models/user.js');
var Message = require('./../models/message.js');

var googleCallback = function(accessToken, refreshToken, profile, cb) {
  User.findOne({'id': profile.id}, function(err, user) {
    if (err) { return done(err)}
    if (!user) {
      var user = new User({
        email: profile.emails[0].value,
        name: profile.displayName,
        id: profile.id,
      });
      user.save(function(err) {
        if (err) throw err;
        return messageCallback(accessToken, cb, user);
      });   
    }
    else {
      return messageCallback(accessToken, cb, user);
    }
  });
};

function messageCallback(accessToken, cb, user){
  var Gmail = require('node-gmail-api');
  var gmail = new Gmail(accessToken);
  var options = {
    max: 3,
    fields: ['id', 'internalDate', 'snippet'],
    format: 'full'
  };
  var dateRanges = require('./../util.js').dateRanges();
  dateRanges.forEach(function(range, i){
    var from = range[0];
    var to = range[1];
    var messageRequest = gmail.messages(`label:sent before:${to} after:${from}`, options);
    messageRequest.on('data', function (data) {
      var message = new Message({
        id: data.id,
        date: data.internalDate,
        snippet: data.snippet,
        userId: user.id
      });
      message.save(err => {
        if (err){
          return cb(null, user);
        } 
        console.log('saved to database');
        //runs callback only once the last months data is saved to the database
        if (i == 11){
          return cb(null, user);
        }
      });
    });
  });
}
  
module.exports = {
  googleStrategy: new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  }, googleCallback)
}


// this code gets the whole message body, but theres markup and images, snippts will be better for now
// until a string parsing algo is implemented
// let rawContent = data.payload.parts.reduce((a, part) => {
//   return a + part.body.data;
// }, '')
// message.content = atob(rawContent.replace(/-/g, '+').replace(/_/g, '/'));