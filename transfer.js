var AWS = require('aws-sdk');
require('dotenv').config();
var get_ph2= require('./ph2');
var getData = require('./ddb');

var region = process.env.REGION;
var tableName = process.env.TABLE_NAME;
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: region,
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function processUserData(formName) {
  try {
    const { ph2_data, ph2_users } = await get_ph2(formName);
    const { ddb_users } = await getData();
    
    const newUserArray = [];
    const existingUserArray = [];

    if (ph2_users && ddb_users) {
      
      ph2_users.forEach(function (uname) {
        if (!ddb_users.includes(uname)) {
          newUserArray.push(uname);
          
        } else {
          existingUserArray.push(uname);
          
        }
      });
    }
  
    return {newUserArray,existingUserArray,ph2_data};

  } catch (e) {
    console.log("Error : ", e);
    return { ph2_users: [], ddb_users: [] }; // Return empty arrays in case of an error
  }
}

const updateDynamoDB = async (formName) => {
  
  const { newUserArray, ph2_data, existingUserArray } = await processUserData(formName);
  
  var userData = {};
  ph2_data.forEach((userItem) => {
      const username = Object.keys(userItem)[0];
      const userDataString = userItem[username];
      userData[username] = JSON.parse(userDataString);
    });

  // Process and update data for new users
  newUserArray.forEach((username) => {
    const params = {
      TableName: tableName,
      Item: {
        username: username,
        language: "en",
        Prefered_Coach: "Ryan",
        Phone_number:"",
        Recent_Channel:""
      },
    };
    params.Item.Forms = {
      [formName]: userData[username],
    };
    dynamoDB.put(params, (error, data) => {
      if (error) {
        console.error('Error adding item:', error);
      } else {
        console.log('Item added successfully:');
      }
    });
  });

  // Process and update data for existing users
  existingUserArray.forEach((username) => {
    const updateParams = {
      TableName: tableName,
      Key: {
        username: username,
      },
      ExpressionAttributeValues: {
        ':ph2Data': userData[username],
      }
    };
    updateParams.UpdateExpression = `SET Forms.${formName} = :ph2Data`;

    dynamoDB.update(updateParams, (error, data) => {
      if (error) {
        console.error('Error updating item:',error);
      } else {
        console.log('Item updated successfully:' );
      }
    });
  });

  // Process and isNotify data for existing users
  existingUserArray.forEach((username) => {
    const updateParams = {
      TableName: tableName,
      Key: {
        username: username,
      },
      ExpressionAttributeValues: {
        ':isNotifyValue': false, // Set isNotify to false
      },
      UpdateExpression: `SET Forms.#formName.isNotify = :isNotifyValue`, // Correct the UpdateExpression
      ExpressionAttributeNames: {
        '#formName': formName,
      },
    };
    dynamoDB.update(updateParams, (error, data) => {
      if (error) {
        console.error(`${formName}Error updating item for ${username}:`, error);
      } else {
        console.log(`Item updated successfully for ${username}:`, data);
      }
    });
  });


};



module.exports = updateDynamoDB;