var client = require('./connection.js');
//console.log("client", client);
client.cluster.health({},function(err,resp,status) {  
  console.log("err", err);
  console.log("-- Client Health --",resp);
});
