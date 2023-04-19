var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: [
    'https://rtc.teefi.io'
  ]
});

module.exports = client;  
