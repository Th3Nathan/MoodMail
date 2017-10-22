var express = require('express');  
var passport = require('passport');  
var router = express.Router();
var Message = require('./../models/message.js');

const language = require('@google-cloud/language');

router.get('/home',
function(req, res) {
  res.render('home', { user: req.user });
});

router.get('/',
function(req, res){
  res.render('login');
});

router.get('/login/google',
passport.authenticate('google', {scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly']}));

router.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  res.render('home', {user: req.user});
});

router.get('/results',
require('connect-ensure-login').ensureLoggedIn(),
function(req, res){
  var userId = req.user.id;
  let count = 0;
  Message.find({
    userId: userId,
  })
  .exec(function(err, messages){
    var messagesByMonth = getMessagesByMonth(messages);
    var messageTextByMonth = getMessageTextByMonth(messagesByMonth);

    messageFetchPromises = generateLanguageAnalysisPromises(messageTextByMonth);
    Promise.all(messageFetchPromises).then(function(vals){
      var sentimentsByMonth = getSentimentsByMonth(vals);
      var dateRanges = require('./../util').chartDateRanges();
      var chart = require('./../views/chartConstruct');
      res.render('results', {
        user: req.user, 
        dateRanges: dateRanges,
        messages: messagesByMonth,
        sentiments: sentimentsByMonth,
        chart: chart(dateRanges, sentimentsByMonth)
      });
    }).catch(function(err) {
      console.error('ERROR:', err);
    });    
  });
});

function getMessagesByMonth(messages) {
  var UTCdateRanges = require('./../util').UTCdateRanges();
  return UTCdateRanges.map(function(range){
    var from = range[0];
    var to = range[1];
    return messages.filter(function(mesg){
      return mesg.date > from && mesg.date < to;
    });
  });      
}

function getMessageTextByMonth(messagesByMonth) {  
  return messagesByMonth.map(function(mesgs){
    return mesgs.reduce(function(a, mesg){
      return a + mesg.snippet;
    }, "");
  });
}

function generateLanguageAnalysisPromises(messageTextByMonth){
  return messageTextByMonth.map(function(text){
  const client = new language.LanguageServiceClient();
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
    return client.analyzeSentiment({document: document});
  });
}

function getSentimentsByMonth(languageAnalysises) {
  return languageAnalysises.map(function(analysis, i){
    return analysis[0].documentSentiment.score;
  });
}

module.exports = router;