var express = require("express");
var usergrid = require("usergrid");
var randtoken = require("rand-token");
var nodemailer = require('nodemailer');
var request = require("request");
/*
// Run Locally
var PORT = process.env.VCAP_APP_PORT || 9000;
var BASEURL = "http://localhost:" + PORT;
var BASEGUIURL = "http://localhost:3000";
*/
//Run on Cloud
var BASEURL_APIGEE = "http://sujoyghosal-test.apigee.net/freecycleapis";
var BASEURL_PIVOTAL = "http://freecycleapissujoy-horned-erasure.cfapps.io";
var BASEGUIURL_PIVOTAL = "http://sujoyfreecycleweb-plutonic-forensics.cfapps.io";
var BASEURL_BLUEMIX = "https://freecycleapissujoy.mybluemix.net";
var BASEGUIURL_BLUEMIX = "http://sujoyfreecycleweb-nonfloriferous-capacitation.mybluemix.net";
var BASEURL_PERSONAL = "https://chatapi.mybluemix.net";
var BASEGUIURL_PERSONAL = "https://chatweb.mybluemix.net";

var BASEURL = BASEURL_PERSONAL;
//var BASEURL = "http://sujoyghosal-test.apigee.net/deals"
var BASEGUIURL = BASEGUIURL_PERSONAL;
var PORT = process.env.VCAP_APP_PORT || 80;
//var PORT = process.env.VCAP_APP_PORT || 9000;

// Usergrid config - Common for all platforms
var APPNAME_DEV = 'deals';
var CLIENTID_DEV = 'b3U6qZdN9MaZEeanNBIuBzeXfQ';
var CLIENTSECRET_DEV = 'b3U6-cw_nkkX9VRDgrvKwi0ofs2Sr4E';

var APPNAME_PROD = 'chat';
var CLIENTID_PROD = 'YXA6KuEkeEPLEeiamRI7Ehc1Lg';
var CLIENTSECRET_PROD = 'YXA6NGHLq3sqIKwleUqvEtMKiNHCW5k';

var APPNAME = APPNAME_PROD;
var CLIENTID = CLIENTID_PROD;
var CLIENTSECRET = CLIENTSECRET_PROD;
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var personality_insights = new PersonalityInsightsV3({
    "url": "https://gateway.watsonplatform.net/personality-insights/api",
    "username": "7726e370-8b95-4971-a2cb-baa8e3da94ce",
    "password": "HJr6PB72wvpW",
    version_date: '2016-10-19'
});
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: "991979531146-rdoiba5l9mctvl73eue2037eon731kei.apps.googleusercontent.com",
        clientSecret: "jTpcWci-Uh1ZtsXWzcAAGsKu"
    }
});
//var config = require('./config');
// Set up Express environment and enable it to read and write JavaScript
var allowCrossDomain = function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    //res.setHeader("Access-Control-Allow-Headers", req.getHeader("Access-Control-Request-Headers"));
    // intercept OPTIONS method
    if ("OPTIONS" == req.method) {
        res.send(200);
    } else {
        next();
    }
};
var app = express();
var allentities = [];
app.use(allowCrossDomain);
//app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// Initialize Usergrid
var bcrypt = require('bcrypt');
var encryptedPw = 'null';
var ug = new usergrid.client({
    orgName: "sujoyghosal",
    appName: APPNAME,
    URI: "https://apibaas-trial.apigee.net",
    clientId: CLIENTID,
    clientSecret: CLIENTSECRET,
    logging: true
});
var loggedIn = null;
var onlineUsers = [];
var lastHeartBeat = null;
// The API starts here
// GET /
var rootTemplate = {
    Deals: { href: "./deals" }
};
app.get("/", function(req, resp) {
    //    resp.jsonp(rootTemplate);
    var out = "Hey, are you looking for something?";
    out +=
        "  Use /alldeals to get all Deals or createDeals with name=value pairs to create a Deals";
    resp.jsonp(out);
});
// GET
var userid;

var group_query = "";
app.get("/getusersingroup", function(req, res) {
    var group = req.param("group");
    group_query = {
        method: "GET",
        endpoint: "groups/" + group + "/users/"
    };
    if (loggedIn === null) {
        logIn(req, res, getusersingroup);
    } else {
        getusersingroup(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function getusersingroup(req, res) {
    loggedIn.request(group_query, function(err, users) {
        if (err) {
            res.send("ERROR - " + JSON.stringify(err));
        } else {
            res.send(users.entities);
        }
    });
}

app.get("/getgroupbyname", function(req, res) {
    var group = req.param("group");
    group_query = {
        method: "GET",
        endpoint: "groups/" + group
    };
    if (loggedIn === null) {
        logIn(req, res, getgroupbyname);
    } else {
        getgroupbyname(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function getgroupbyname(req, res) {
    loggedIn.request(group_query, function(err, group) {
        if (err) {
            res.send("ERROR - " + JSON.stringify(err));
        } else {
            res.jsonp(group);
        }
    });
}
app.get('/personality', function(req, res) {
    var text = req.param('text');
    var params = {
        "text": text
    }
    personality_insights.profile({
            text: text,
            consumption_preferences: true
        },
        function(err, response) {
            if (err) {
                res.jsonp(err);
            } else
                res.jsonp(response);
        });
});

app.get("/updateuser", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, updateuser);
    } else {
        updateuser(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function updateuser(req, res) {
    var option = {
        type: "users",
        name: req.param("name")
    };
    loggedIn.getEntity(option, function(err, entity) {

        if (err) {
            res.send("ERROR");
        } else {
            if (req.param('password')) {
                encryptedPw = encryptPassword(req.param('password'));
                entity.set("pw", encryptedPw);
            }
            entity.set("phone", req.param("phone"));
            entity.set("address", req.param("address"));
            entity.save(function(err) {
                if (err) {
                    res.jsonp(500, "ERROR");
                    return;
                }
                res.jsonp(entity);
            });
        }
    });
}
app.get("/updateusersettings", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, updateusersettings);
    } else {
        updateusersettings(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function updateusersettings(req, res) {
    var option = {
        type: "users",
        uuid: req.param("uuid")
    };
    loggedIn.getEntity(option, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            //  res.send(entity);
            var settings = {
                pushon: req.param("pushon"),
                pushstarttimehrs: req.param("starttimehrs"),
                pushstoptimehrs: req.param("stoptimehrs"),
                pushstarttimemin: req.param("starttimemin"),
                pushstoptimemin: req.param("stoptimemin")
            };
            entity.set("settings", settings);
            entity.save(function(err) {
                if (err) {
                    res.jsonp(500, "ERROR");
                    return;
                }
                res.send(entity);
            });
        }
    });
}

function getchatsbyemail(e) {
    var options2 = {
        type: "chatevents",
        qs: {
            ql: "from.email = '" + e + "'"
        }
    };
    console.log("####getchatsbyemail: options = " + JSON.stringify(options2));
    loggedIn.createCollection(options2, function(err, chatevents) {
        if (err) {
            console.error("##### Error fetching chat events: " + JSON.stringify(err));
            return;
        }
        //console.log("####getchatsbyemail: response = " + JSON.stringify(chatevents));
        var allchats = [];
        var time = new Date();
        while (chatevents.hasNextEntity()) {
            var achat = chatevents.getNextEntity().get();
            allchats.push(achat);
        }
        var response = {
            timestamp: time.getTime(),
            events: allchats
        }
        io.sockets.emit('chateventsforoneuser', response);
        return JSON.stringify(response);

    });
}

function insertChatEvent(e) {

    var options = {
        method: "POST",
        endpoint: "chatevents",
        body: e
    };
    loggedIn.request(options, function(err, data) {
        if (err) {
            console.error("####ERROR: while inserting event to DB..createevent menthod.");
            return;
        } else {
            console.log("#######CreateEvents Success!!!!! " + JSON.stringify(data));

        }
    });
}

app.post("/sendchat", function(req, res) {
    var t = new Date();
    req.body.name = req.body.email + "-" + t;
    console.log("####Create Chat Event Request Body: " + JSON.stringify(req.body));
    var options = {
        method: "POST",
        endpoint: "chatevents",
        body: req.body
    };
    if (loggedIn === null) {
        logIn(req, res, function() {
            sendchat(options, req, res);
        });
    } else {
        sendchat(options, req, res);
    }
});

function sendchat(e, req, res) {
    loggedIn.request(e, function(err, data) {
        if (err) {
            res.send("ERROR");
        } else {
            console.log("#######CreateEvents Success!!!!! " + JSON.stringify(data));
            if (mysocket) {
                console.log("##### Sending event ");
                //mysocket.broadcast.emit('matchingevent', o);
                io.sockets.in(req.param('email')).emit('chatevent', data);
                //io.sockets.emit('matchingevent', data);
                console.log("####Sent chatevent to email " + req.param('email'));
                var msg = JSON.stringify(data.entities[0].sentby + ": " +
                    data.entities[0].text);
                //sendFCMPush("FreeCycle Event", msg, data.entities[0].group_name.replace(/-/g, '_'));
                console.log("#####Event Object = " + JSON.stringify(data));
                res.jsonp(data);
            } else {
                console.log("#### mysocket is null");
                res.send("EVENT CREATED BUT NOT BROADCAST DUE TO NULL SOCKET!");
            }

        }
    });
}
app.post("/contactus", function(req, res) {
    var name = req.body.email + "-" + new Date();
    var e = {
        name: name,
        fullname: req.body.fullname,
        email: req.body.email,
        city: req.body.city,
        phone: req.body.phone,
        subject: req.body.subject,
        text: req.body.text
    }
    console.log("##### Contact Us request details - " + JSON.stringify(e));
    if (loggedIn === null) {
        logIn(req, res, function() {
            createcontactusquery(e, req, res);
        });
    } else {
        createcontactusquery(e, req, res);
    }
});

function createcontactusquery(e, req, res) {
    var opts = {
        type: "userqueries"
            //        name: 'Dominos'
    };
    loggedIn.createEntity(opts, function(err, o) {
        if (err) {
            res.send(err);
            return;
        }
        o.set(e);
        o.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.send("QUERY CREATED");
        });
    });
}

app.post("/createuser", function(req, res) {
    var fullname = req.body.fullname;
    var password = req.body.password;
    var email = req.body.email;
    var organisation = req.body.organisation;
    var ngo = req.body.ngo;
    encryptedPw = encryptPassword(password);
    var options = {
        method: "POST",
        endpoint: "users",
        body: {
            username: email,
            name: email,
            email: email,
            organisation: organisation,
            fullname: fullname,
            pw: encryptedPw,
            ngo: ngo
        }
    };
    console.log("#### Create User Object Is: " + JSON.stringify(options));
    if (loggedIn === null) {
        logIn(req, res, function() {
            createUser(options, req, res);
        });
    } else {
        createUser(options, req, res);
    }
});

app.post("/createuserwithoauth", function(req, res) {

    var options = {
        method: "POST",
        endpoint: "users",
        body: {
            username: req.body.email,
            name: req.body.email,
            email: req.body.email,
            photoURL: req.body.photoURL,
            fullname: req.body.fullname,
            phone: req.body.phone,
            emailVerified: req.body.emailVerified
        }
    };
    console.log("#### Create User Object Is: " + JSON.stringify(options));
    if (loggedIn === null) {
        logIn(req, res, function() {
            createUser(options, req, res);
        });
    } else {
        createUser(options, req, res);
    }
});

function createUser(e, req, res) {
    loggedIn.request(e, function(err, data) {
        if (err) {
            res.send("ERROR");
        } else {
            res.send("CREATED");
        }
    });
}

function encryptPassword(password) {
    const saltRounds = 10;
    const myPlaintextPassword = password;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(myPlaintextPassword, salt);
    encryptedPw = hash;
    console.log("Encrypted password=" + hash);
    return hash;
};

function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
    //return true;
};
app.get("/getuser", function(req, res) {
    var email = req.param("email");
    var options2 = {
        type: "users",
        qs: {
            ql: "name='" + email + "'"
        }
    };
    if (loggedIn === null) {
        logIn(req, res, function() {
            getuserbyemail(options2, req, res);
        });
    } else {
        getuserbyemail(options2, req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});
//Call request to initiate the API call
function getuserbyemail(e, req, res) {
    loggedIn.createCollection(e, function(err, users) {
        if (err) {
            res.jsonp(e);
            return;
        }
        var allusers = [];
        while (users.hasNextEntity()) {
            var auser = users.getNextEntity().get();
            allusers.push(auser);
        }
        if (allusers.length > 0) res.jsonp(allusers);
        else res.send("User Not Found");
    });
}

//Call request to initiate the API call
function geteventsforgroups(req, res, groups) {
    if (!groups || groups.length == 0) {
        console.log('Invalid Groups uuids');
        return;
    }
    var query = '';
    for (var i = 0; i < groups.length; i++) {
        query += "group_uuid = '" + groups[i] + "'";
        if (i < (groups.length - 1))
            query += " or ";
    }
    console.log("geteventsforgroups query = " + query)
    var options2 = {
        type: "donationevents",
        qs: {
            ql: query
        }
    };
    loggedIn.createCollection(options2, function(err, events) {
        if (err) {
            res.jsonp(e);
            return;
        }
        var allevents = [];
        while (events.hasNextEntity()) {
            var aevent = events.getNextEntity().get();
            allevents.push(aevent);
        }
        if (allevents.length > 0) res.jsonp(allevents);
        else res.send("Events Not Found");
    });
}
app.get("/loginuser", function(req, res) {
    var email = req.param("email");
    var options2 = {
        type: "users",
        qs: {
            ql: "name='" + email + "'"
        }
    };
    if (loggedIn === null) {
        logIn(req, res, function() {
            getuserafterauth(options2, req, res);
        });
    } else {
        getuserafterauth(options2, req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function getuserafterauth(e, req, res) {
    loggedIn.createCollection(e, function(err, users) {
        if (err) {
            res.jsonp(e);
            return;
        }
        var allusers = [];
        while (users.hasNextEntity()) {
            auser = users.getNextEntity().get();
            allusers.push(auser);
        }
        if (!allusers || allusers.length == 0)
            res.send("User Not Found");
        else
        if (allusers && allusers.length > 0 && checkPassword(req.param('pw'), allusers[0].pw))
            res.jsonp(allusers);
        else
            res.send("Authentication Error");
    });
}

app.get("/sendresetpwmail", function(req, res) {

    if (loggedIn === null) {
        logIn(req, res, saveresettokenandsendmail);
    } else {
        saveresettokenandsendmail(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

var emailtext = "";
var saveresettokenandsendmail = function(req, res) {
    var option = {
        type: "users",
        name: req.param("email")
    };
    loggedIn.getEntity(option, function(err, entity) {
        // encryptedPw = encryptPassword(req.param('password'));
        if (err) {
            console.log("ERROR: " + JSON.stringify(err));
            res.send("Email Not Found");
        } else {
            console.log("saveresttoken: Found user SUCCESS for email=" + req.param('email'));
            var token = randtoken.generate(16);
            entity.set("resettoken", token);
            entity.save(function(err, data) {
                if (err) {
                    console.log(JSON.stringify(err));
                } else {
                    var to = req.param('to');
                    var subject = 'Reset Pasword';
                    emailtext = "Please use the following link to reset your password\n";
                    emailtext += BASEURL + "/verifyresettoken?token=" + token + "&email=" + req.param('email');
                    console.log("######saveresttoken updated user entity SUCCESS.");
                    sendmail(req, res, emailtext);
                }
            });
        }
    });
};

function sendmail(req, res, text) {

    transporter.sendMail({
        from: "sujoy.ghosal@gmail.com",
        to: req.param('email'),
        subject: 'Password Reset',
        text: text,
        auth: {
            user: 'sujoy.ghosal@gmail.com',
            refreshToken: '1/cmlvnBPn8-FCiim25R0J9c68zO1FTeaiYIzUGr_5ldw',
            accessToken: 'ya29.Glv-BAff-7QHfbnhJ5LvhexaatvSAWsi_pq13DvwoXXunD_EKB59VB86bVvFH38gAAw7UR5CLZxX0jmMLyF_laCvEwqv_nSyZbluWiVCD6V_v_0ko5nNW50hQjeo',
            expires: 3600
        }
    });
    console.log("Sent mail");
    res.send("Sent Mail");
}

app.get("/sendfcmpush", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, sendFCMPush);
    } else {
        sendFCMPush(req, res, '');
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function sendFCMPush(title, text, topic) {
    if (!topic || topic.length < 2) {
        console.log("#### No topic received, not sending push");
        return;
    }
    if (!text || text.length < 2) {
        console.log("#### No text received, not sending push");
        return;
    }
    console.log("Sending FCM Push....");
    var options = {
        method: 'POST',
        url: 'https://cordova-plugin-fcm.appspot.com/push/freesend',
        headers: {
            'cache-control': 'no-cache',
            'access-control-allow-origin': '*',
            'content-type': 'application/json'
        },
        body: {
            recipient: topic,
            isTopic: 'true',
            title: title,
            body: text.replace(/\"/g, ""),
            apiKey: 'AAAA5vaWa4o:APA91bGdenh15KUIJVAKISsHLNCgPLka_Npdal5v8YsZnK2lEps5E6Bc0ImAka8zytn1D5t_t0iZSlfqVNSJFTkXYPA3PIhG-3a7qtKDeHfMF3MQNctwW4Dnw2vObuqFeY7zMj62Qud9',
            application: 'com.sujoy.freecycle',
            customData: [{
                param: 'a',
                value: 'b'
            }]
        },
        json: true
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        return ("SUCCESS");
    });
};
var login_query = "";
// We need this for UserGrid authentication
function logIn(req, res, next) {
    console.log("Logging in as %s", "sujoy");
    ug.login("sujoyghosal", "Kolkata1", function(err) {
        if (err) {
            console.log("Login failed: %s", JSON.stringify(err));
            //res.jsonp(500, { error: err });
            return;
        }
        loggedIn = new usergrid.client({
            orgName: "sujoyghosal",
            appName: APPNAME,
            URI: "https://apibaas-trial.apigee.net",
            authType: usergrid.AUTH_APP_USER,
            token: ug.token,
            logging: true
        });
        console.log("Got a token. I wonder when it expires? Let's guess.");
        // Go on to do what we were trying to do in the first place
        setTimeout(expireToken, 6000);
        next();
    });
}

function expireToken() {
    console.log("Getting rid of user authentication token");
    if (loggedIn !== null) {
        loggedIn.logout();
        loggedIn = null;
    }
}
// Listen for requests until the server is stopped
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mysocket = null;
http.listen(PORT, function() {
    console.log('listening on *:' + PORT);
});
setInterval(removeOfflineUsersFromList, 20000);

function sendActiveUsers() {
    var activeUsersObj = {}
    activeUsersObj.timestamp = new Date();
    activeUsersObj.users = onlineUsers;
    io.emit('activeuserschanged', JSON.stringify(activeUsersObj));
}

function removeOfflineUsersFromList() {
    console.log("Checking for offline users.....");
    var time = new Date();
    if (onlineUsers && onlineUsers.length > 0) {
        for (i = 0; i < onlineUsers.length; i++) {
            console.log("OnlineUsers = " + JSON.stringify(onlineUsers[i]));
            console.log("##### Difference from last ping time for " + onlineUsers[i].fullname + " is: " +
                Math.abs((Date.parse(onlineUsers[i].lastHeartBeat) - time.getTime()) / 1000));
            if (Math.abs((Date.parse(onlineUsers[i].lastHeartBeat) - time.getTime()) / 1000) > 60) {
                console.log(onlineUsers[i].email + " has not pinged lately. Removing from online list.....");
                onlineUsers.splice(i, 1);
                //onlineUsers[i].status = "Offline";
            }
        }
    }

    //console.log("#### Broadcasting latest Online Users List.." + JSON.stringify(onlineUsers));
    //io.emit('activeuserschanged', JSON.stringify(onlineUsers));
    sendActiveUsers();
}

function isUserOnline(email) {
    var online = false;
    if (onlineUsers && onlineUsers.length > 0) {
        for (i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i].email === email) {
                online = true;
                break;
            }
        }
    }
    //console.log("@@@@ isUserOnline " + email + ":" + online);
    return online;
}
io.on('connection', function(socket) {
    mysocket = socket;
    socket.on('room', function(loggedinUser) { //login
        if (!loggedinUser || loggedinUser == undefined) {
            console.log("####Ignoring null or undefined login time join request");
            return;
        }
        if (!isUserOnline(loggedinUser.email)) {
            //console.log("####Conecting client socket to room " + loggedinUser.email);
            socket.join(loggedinUser.email);
            //removeOfflineUsersFromList();
            loggedinUser.status = "Online";
            onlineUsers.push(loggedinUser);
            console.log("#### Online now - " + JSON.stringify(onlineUsers));
            //io.emit('activeuserschanged', JSON.stringify(onlineUsers));           
        }
        sendActiveUsers();
    });
    socket.on('join', function(chatObj) { //login
        if (!chatObj || chatObj == undefined) {
            console.log("####Ignoring null or undefined join request");
            return;
        } else {
            console.log("####Checking if target user " + JSON.stringify(chatObj) + " is online.")
        }
        console.log("####Joining room " + chatObj.target.email);
        socket.join(chatObj.target.email);
        io.sockets.in(chatObj.target.email).emit('chatevent', chatObj);
        console.log("#####Event Object = " + JSON.stringify(chatObj));

    });
    socket.on('sendchat', function(chatObj) { //login
        if (!chatObj || chatObj == undefined) {
            console.log("####Ignoring null or undefined join request");
            return;
        } else {
            console.log("####Checking if target user " + JSON.stringify(chatObj) + " is online.")
        }
        //console.log("####Joining room " + chatObj.target.email);
        //socket.join(chatObj.target.email);
        io.sockets.emit('chateventforall', chatObj);
        chatObj.name = chatObj.from.sentby + "-" + Date();
        if (loggedIn === null) {
            logIn(null, null, function() {
                insertChatEvent(chatObj);
            });
        } else {
            insertChatEvent(chatObj);
        }

        //socket.broadcast.emit('chateventforall', chatObj);
        //io.sockets.in(chatObj.target.email).emit('chatevent', chatObj);
    });
    socket.on('getchats', function(email) { //login
        if (!email || email == undefined) {
            console.log("####Ignoring null or undefined join request");
            return;
        } else {
            console.log("####Pulling chats for email " + JSON.stringify(email));
        }

        if (loggedIn === null) {
            logIn(null, null, function() {
                getchatsbyemail(email);
            });
        } else {
            getchatsbyemail(email);
        }
    });
    socket.on('leave', function(room) {
        if (!room || room == undefined) {
            console.log("####Ignoring null or undefined leave request");
            return;
        }
        console.log("####Disconecting client socket from room " + room);
        socket.leave(room);
        if (onlineUsers && onlineUsers.length > 0) {
            for (i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].email === room) {
                    //onlineUsers.splice(i, 1);
                    onlineUsers[i].status = "Offline";
                    console.log("Set user status for " + room + "to offline");
                }
            }
        }
    });
    socket.on('alive', function(loggedinUser) {
        if (!loggedinUser || !loggedinUser.email || loggedinUser.email == undefined) {
            console.log("####Ignoring null or undefined alive event");
            return;
        }
        //console.log("#### Alive event received for user: " + loggedinUser.email);
        if (loggedinUser.lastHeartBeat === lastHeartBeat) {
            //console.log("##### Discarding duplicate alive events for " + loggedinUser.email);
            return;
        } else {
            lastHeartBeat = loggedinUser.lastHeartBeat;
        }
        loggedinUser.status = "Online";
        //removeOfflineUsersFromList();
        var alreadyInList = false;
        if (onlineUsers && onlineUsers.length > 0) {
            for (i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].email === loggedinUser.email) {
                    //console.log("User already in alive list");
                    onlineUsers[i] = loggedinUser;
                    alreadyInList = true;
                    break;
                }
            }
        }
        if (!alreadyInList) {
            onlineUsers.push(loggedinUser);
            //console.log("#### Broadcasting Online Users List");
            //io.emit('activeuserschanged', JSON.stringify(onlineUsers));
            //sendActiveUsers();
        }
    });
    socket.on('logout', function(email) {
        if (!email || email == undefined) {
            console.log("####Ignoring null or undefined logout request");
            return;
        }
        console.log("#### Online USers: " + JSON.stringify(onlineUsers));
        console.log("####Received logout event for  " + email);
        if (onlineUsers && onlineUsers.length > 0) {
            for (i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].email === email) {
                    //onlineUsers.splice(i, 1);
                    onlineUsers[i].status = "Offline";
                    console.log("Set status of " + email + " to offline");
                }
            }
        }
        //console.log("#### Broadcasting logout event for " + email + " for all users to update active user states");
        console.log("#### Online USers after delete: " + JSON.stringify(onlineUsers));
        //io.emit('activeuserschanged', email);
        sendActiveUsers();
    });
})