var AWS = require('aws-sdk');
require('dotenv').config();

var ddb_user_data = [];
var ddb_users = [];
var region = process.env.REGION;
var tableName = process.env.TABLE_NAME;

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: region,
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getData() {
  var params = {
    TableName: tableName,
  };
  try {
    ddb_user_data = [];
    ddb_users = [];
    var result = await dynamoDB.scan(params).promise();
    result.Items.forEach(function (item) {
      var uname = item.username;
      var data = { [uname]: item };
      ddb_user_data.push(data);
    });
    
    var users = []
    ddb_user_data.forEach((item) => {
      users.push(Object.keys(item));
    });
    
    ddb_users = users.flat();

  
    return {ddb_user_data,ddb_users}
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

module.exports = getData;