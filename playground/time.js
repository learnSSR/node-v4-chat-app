const moment = require('moment');

// var date = new Date();
//
// console.log(date.getMonth());

var createdAt = 12345;
var date = moment(createdAt);

console.log(date.format());
