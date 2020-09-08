const moment = require('moment');

var generateMessage = (from, text, id) => {
  return {
    from,
    text,
    createdAt: moment().valueOf(),
    id
  };
};

var generateLocationMessage = (from, latitude, longitude, id) => {
  return {
    from,
    url: `https://www.google.co.in/maps/@${latitude},${longitude}`,
    createdAt: moment().valueOf(),
    id
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
}
