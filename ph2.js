const axios = require('axios');
var ph2_data = [];
var ph2_users = [];

async function get_ph2(formName){ //data from kore.ai data table
  
  try {
    ph2_data = [];
    ph2_users = [];
    // const date = new Date();
    // const today = date.toISOString().split('T')[0];

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
      console.dir(item,{depth:null});
      const username = item.username; // Assign item.username to a variable
      // const newFormData = JSON.stringify(item);
      // var dataToUpdate = { [username]: newFormData }; // Correctly create an object with a dynamic property
      const newFormData = { ...item, isNotify: false }; // Add new field isNotify with value false
      var dataToUpdate = { [username]: JSON.stringify(newFormData) };
      ph2_data.push(dataToUpdate);

    });
    var users = []
    ph2_data.forEach((item) => {
      users.push(Object.keys(item));
    });
    
    ph2_users = users.flat();

    return {ph2_data,ph2_users};

  } catch (error) {
    console.log(`Error retrieving the data from the data table ph2`);
  }
};
get_ph2("ph2");
module.exports = get_ph2;