var User = require('./models/user.js');
var Message = require('./models/message.js');

function dateRanges() {
  var dates = [];
  var d = new Date()
  idx = 0
  while (idx < 12) {
    var until = d.toLocaleDateString();
    d.setMonth(d.getMonth() - 1)
    d.setDate((d.getDate() + 1))
    var from = d.toLocaleDateString();
    d.setDate((d.getDate() - 1))
    dates.push([from, until]);
    idx++;
  }
  return dates.reverse();
}

function chartDateRanges() {
  var dates = [];
  var d = new Date();
  idx = 0;
  while (idx < 12) {
    var until = formatDate(d.toLocaleDateString());
    d.setMonth(d.getMonth() - 1);
    d.setDate((d.getDate() + 1));
    var from = formatDate(d.toLocaleDateString());
    d.setDate((d.getDate() - 1));
    dates.push([from, until]);
    idx++;
  }
  return dates.reverse();
}

function UTCdateRanges() {
  var dates = [];
  var d = new Date();
  idx = 0;
  while (idx < 12) {
    var until = d.getTime();
    d.setMonth(d.getMonth() - 1);
    d.setDate((d.getDate() + 1));
    var from = d.getTime();
    d.setDate((d.getDate() - 1));
    dates.push([from, until]);
    idx++;
  }
  return dates.reverse();
}

function wipeDatabase() {
  User.remove({}, function(err) { 
    console.log('collection removed');
  });
  Message.remove({}, function(err) { 
    console.log('collection removed'); 
  });
}
 
function formatDate(yyyymmdd) {
  return yyyymmdd.substr(5).replace('-', '/') + '/' + yyyymmdd.substr(2, 2);
}

module.exports = {
    dateRanges: dateRanges,
    chartDateRanges: chartDateRanges,
    UTCdateRanges: UTCdateRanges,
    wipeDatabase: wipeDatabase
}