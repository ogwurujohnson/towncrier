const fs = require('fs');

function processRequest(data) {
  fs.appendFile('persist.txt', JSON.stringify(data) + "\r\n", function(err){
    if(err) throw err;
    console.log('IS WRITTEN')
    });
}

module.exports = processRequest;