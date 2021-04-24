const moment = require('moment');//this will allow to use timestap

//this will allow to take the username and text
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

module.exports = formatMessage;