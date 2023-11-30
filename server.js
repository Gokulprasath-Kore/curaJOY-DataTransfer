const AWS = require('aws-sdk');
const axios = require('axios');
var ph2_data = [];
var ph2_users = [];
require('dotenv').config();
const updateDynamoDB = require('./transfer');
const get_ph2 = require('./ph2');

const region = process.env.REGION;
const tableName = process.env.TABLE_NAME;

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: region,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;

dynamoDB.scan({ TableName: tableName }, (error, data) => {
  if (error) {
    console.error('Failed to connect to DynamoDB:', error);
  } else {
    app.get("/start-transfer", async (req, res) => {
      try {
        // for the form ph2
        var formName = "ph2";
        var { ph2_users: ph2UsersPh2 } = await get_ph2(formName);
        if (ph2UsersPh2.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
        
      } catch (error) {
        console.error("Error transferring data:", error);
        
      }

      try{
        // for the form gad7
        formName = "gad7"; // Reassigning formName
        var { ph2_users: ph2UsersGad7 } = await get_ph2(formName);
        if (ph2UsersGad7.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
      }catch (error) {
        console.error("Error transferring data:", error);
        
      }

      try{
        // for the form qabf
        formName = "qabf"; // Reassigning formName
        var { ph2_users: ph2UsersQabf } = await get_ph2(formName);
        if (ph2UsersQabf.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
      }catch (error) {
        console.error("Error transferring data:", error);
        res.status(500).send("Data transfer failed.");
      }

      try{
        // for the form ucla
        formName = "ucla"; // Reassigning formName
        var { ph2_users: ph2UsersUCLA } = await get_ph2(formName);
        if (ph2UsersUCLA.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
      }catch (error) {
        console.error("Error transferring data:", error);
        
      }

      try{
        // for the form familyhealthscale
        formName = "familyhealthscale"; // Reassigning formName
        var { ph2_users: ph2UsersFHS } = await get_ph2(formName);
        if (ph2UsersFHS.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
      }catch (error) {
        console.error("Error transferring data:", error);
        
      }

      try{
        // for the form wellnesscheckin
        formName = "wellnesscheckin"; // Reassigning formName
        var { ph2_users: ph2UsersWCI } = await get_ph2(formName);
        if (ph2UsersWCI.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
      }catch (error) {
        console.error("Error transferring data:", error);
        
      }
      try{
        // for the form behaviorcheckin
        formName = "behaviorcheckin"; // Reassigning formName
        var { ph2_users: ph2UsersBCI } = await get_ph2(formName);
        if (ph2UsersBCI.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
      }catch (error) {
        console.error("Error transferring data:", error);
        
      }
      try{
        // for the form childintakeform
        formName = "childintakeform"; // Reassigning formName
        var { ph2_users: ph2UsersCIF } = await get_ph2(formName);
        if (ph2UsersCIF.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
      }catch (error) {
        console.error("Error transferring data:", error);
        
      }

      try{
        // for the form childintakeform
        formName = "warwickedinburghmentalwellbeingscale"; // Reassigning formName
        var { ph2_users: ph2UsersWEMWBS } = await get_ph2(formName);
        if (ph2UsersWEMWBS.length) {
          await updateDynamoDB(formName);
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
      }catch (error) {
        console.error("Error transferring data:", error);
        
      }

      res.status(200).send("Data transfer complete.");

    });

    app.get("/user-transfer",async(req,res)=>{
      try {
        var formName = "userdetail";
        ph2_data = [];
        ph2_users = [];
        let data = JSON.stringify({
          "query": {
            "expressions": [
              {
                "field": "Updated_On",
                "operand": ">",
                "value": "2023-10-21"
              }
            ]
          }
        });
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          headers: { 
            'auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYXBwSWQiOiJjcy0xMzVkNzQ1OC05MzlhLTU3OTktODcyMi1mYjM5NGU5ZWUwNGUifQ.y4NjjAJ5vyq91dGKkOIN2nnaUVQdh9zW5gCnsdd1Sqs', 
            'content-type': 'application/json'
          },
          data : data
        };
        config['url'] = `https://bots.kore.ai/api/public/tables/${formName}/query`;
        const response = await axios.request(config);
        const updatePromises = response.data.queryResult.map(async (item) => {
          const username = item.username; // Assign item.username to a variable
          const newFormData = JSON.stringify(item);
          var dataToUpdate = { [username]: newFormData }; // Correctly create an object with a dynamic property
          ph2_data.push(dataToUpdate);
    
        });
        var users = []
        ph2_data.forEach((item) => {
          users.push(Object.keys(item));
        });
        ph2_users = users.flat();
        if (ph2_users.length) {
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
            }
            catch(e){
              console.error("Error fetching data:", error);
            }
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
          var userData = {};
          ph2_data.forEach((userItem) => {
              const username = Object.keys(userItem)[0];
              const userDataString = userItem[username];
              userData[username] = JSON.parse(userDataString);
            });
          newUserArray.forEach((username) => {
              console.log(userData[username]);
              var eachData = userData[username];
  
              const params = {
                  TableName: tableName,
                  Item: {
                    username: username,
                    Id:eachData.Id,
                    Phone_number:eachData.Phone_Number,
                    email:eachData.email,
                    language: eachData.language,
                    Prefered_Coach: eachData.Prefered_Coach,
                    Recent_Channel:eachData.Recent_Channel,
                    Instagram_Contact_Id:eachData.Instagram_Contact_Id
                  },
                };
            
            dynamoDB.put(params, (error, data) => {
              if (error) {
                console.error('Error adding item:', error);
              } else {
                console.log('Item added successfully:');
              }
            });
          });
          existingUserArray.forEach((username) => {
              console.log(userData[username]);
              var eachData = userData[username];
              const updateValues = {
                    ':Id':eachData.Id,
                    ':Phone_number':eachData.Phone_Number,
                    ':email':eachData.email,
                    ':languageAlias': eachData.language,
                    ':Prefered_Coach': eachData.Prefered_Coach,
                    ':Recent_Channel':eachData.Recent_Channel,
                    ':Instagram_Contact_Id':eachData.Instagram_Contact_Id
                  // Add more attributes and values as needed
                };
            const updateParams = {
              TableName: tableName,
              Key: {
                username: username,
              },
              ExpressionAttributeValues: {
                  ':Id': updateValues[':Id'],
                  ':Phone_number': updateValues[':Phone_number'],
                  ':email': updateValues[':email'],
                  ':languageAlias': updateValues[':languageAlias'],
                  ':Prefered_Coach': updateValues[':Prefered_Coach'],
                  ':Recent_Channel': updateValues[':Recent_Channel'],
                  ':Instagram_Contact_Id':updateValues[':Instagram_Contact_Id']
              },
              ExpressionAttributeNames: {
                '#L': 'language', // Define an alias for the reserved keyword
              },
            };
            updateParams.UpdateExpression = `SET email=:email,Id = :Id,Phone_number = :Phone_number,#L = :languageAlias,Prefered_Coach = :Prefered_Coach,Recent_Channel = :Recent_Channel,Instagram_Contact_Id = :Instagram_Contact_Id`;
        
            dynamoDB.update(updateParams, (error, data) => {
              if (error) {
                console.error('Error updating item:',error);
              } else {
                console.log('Item updated successfully:' );
              }
            });
          });
          console.log(`Success updating form ${formName}`);
        } else {
          console.log(`No data for form ${formName}`);
        }
        
      } catch (error) {
        console.error("Error transferring data:", error);
        
      }
      res.status(200).send("Data transfer complete.");
    })

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  }
});
