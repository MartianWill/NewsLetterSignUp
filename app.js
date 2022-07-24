const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');
const https = require('node:https');
const mailchimp = require('@mailchimp/mailchimp_marketing');


const app = express()
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/signup.html')
})



mailchimp.setConfig({
  apiKey: "da8b0fe0fd5f5ede-us10",
  server: "us10",
});

// // test mialchimp functioning
// async function run() {
//   const response = await mailchimp.ping.get();
//   console.log(response);
// }

// run();


app.post('/', (req,res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    // data to parse into mailchimp in json string
    var memberData = {
         members :[
            {
                email_address : email,
                status : 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME : lastName,
                }
            }
        ]
    }
    // working code 
    const memberJson = JSON.stringify(memberData);

    const URL ='https://us10.api.mailchimp.com/3.0/lists/6';
    const options = { 
        method : 'POST',
        auth : "wii:da84250-us10"        
    };

    const request = https.request(URL, options , (response) => {
        
        if(response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else{
            res.sendFile(__dirname + '/fail.html');
        }
        
        response.on('data',(d) => {
            console.log(JSON.parse(d));
        })
    })
    //  add in options
    request.write(memberJson);
    request.end();

    // const run = async () => {
    //     const response = await mailchimp.lists.batchListMembers('492c4465a6', memberData);
    //     console.log(response);
    // }
    // run();
	// //TODO: try to pass success and fail html in 
	
})

app.post('/fail', (req,res) => {
    res.redirect('/');
})

app.listen(port || 3000, () => {
    console.log("server is running on port " + port);
})



