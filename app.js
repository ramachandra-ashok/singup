const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")
const app = express();


app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
    var firstName = req.body.fName
    var lastName = req.body.lName
    var email = req.body.email
    console.log(firstName + " " + lastName + " " + email);

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data)
    const url = "https://us18.api.mailchimp.com/3.0/lists/0eafa1968a"
    const options = {
        method: "POST",
        auth: "ram1:08131221a65728bf00968ba09b2ed799-us1"
    }

    const request = https.request(url, options, function(response) {
        console.log("response.statusCode " + response.statusCode);
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/succues.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(params) {
            console.log(JSON.parse(params));
        })

    })

    request.write(jsonData)
    request.end()

})




app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("server up and running");
})

//api key
// 08131221a65728bf00968ba09b2ed799-us18

//list id
//0eafa1968a