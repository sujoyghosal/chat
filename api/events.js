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
app.get("/allDeals", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, getallDeals);
    } else {
        userid = req.param("userid");
        getallDeals(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});
var options = {
    type: "Deals?limit=100",
    qs: { ql: "user_id='" + userid + "'" }
};
//Call request to initiate the API call
function getallDeals(req, res) {
    loggedIn.createCollection({ type: "Deals?limit=100" }, function(
        err,
        Deals
    ) {
        //    loggedIn.createCollection(options, function(err, ngccnotifications) {
        //  loggedIn.request({ options, function(err, ngccnotifications) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        var allDeals = [];
        while (Deals.hasNextEntity()) {
            var aDeals = Deals.getNextEntity().get();
            allDeals.push(aDeals);
        }
        res.jsonp(allDeals);
    });
}
app.get("/onlineusers", function(req, resp) {
    //    resp.jsonp(rootTemplate);
    resp.jsonp(onlineUsers);
});
var Deals_query = "";
app.get("/getDeals", function(req, res) {
    var paramname = req.param("paramname");
    var paramvalue = req.param("paramvalue");
    Deals_query = {
        type: "Deals?limit=100", //Required - the type of collection to be retrieved
        qs: { ql: paramname + "='" + paramvalue + "'" }
    };
    if (paramname === "uuid") {
        Deals_query = {
            type: "Deals", //Required - the type of collection to be retrieved
            uuid: paramvalue
        };
    }
    if (loggedIn === null) {
        logIn(req, res, getDeals);
    } else {
        getDeals(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function getDeals(req, res) {
    loggedIn.createCollection(Deals_query, function(err, Deals) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        var allDeals = [];
        while (Deals.hasNextEntity()) {
            var aDeals = Deals.getNextEntity().get();
            allDeals.push(aDeals);
        }
        res.jsonp(allDeals);
    });
}
var needs_query = "";
app.get("/getneeds", function(req, res) {
    var paramname = req.param("paramname");
    var paramvalue = req.param("paramvalue");
    var emergency = req.param('emergency');
    needs_query = {
        type: "needs?limit=500", //Required - the type of collection to be retrieved
        qs: { ql: paramname + "='" + paramvalue + "'" + " and emergency=" + emergency }
    };
    if (paramname === "uuid") {
        Deals_query = {
            type: "needs", //Required - the type of collection to be retrieved
            uuid: paramvalue
        };
    }
    if (loggedIn === null) {
        logIn(req, res, getneeds);
    } else {
        getneeds(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function getneeds(req, res) {
    loggedIn.createCollection(needs_query, function(err, needs) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        var allneeds = [];
        while (needs.hasNextEntity()) {
            var aneed = needs.getNextEntity().get();
            allneeds.push(aneed);
        }
        res.jsonp(allneeds);
    });
}
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
app.get("/allusers", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, getAllUsers);
    } else {
        //userid = req.param("userid");
        getAllUsers(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

//Call request to initiate the API call
function getAllUsers(req, res) {
    loggedIn.createCollection({ type: "users?limit=100" }, function(
        err,
        users
    ) {
        //    loggedIn.createCollection(options, function(err, ngccnotifications) {
        //  loggedIn.request({ options, function(err, ngccnotifications) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        var allUsers = [];
        while (users.hasNextEntity()) {
            var aUser = users.getNextEntity().get();
            allUsers.push(aUser);
        }
        res.jsonp(allUsers);
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
app.get("/getgroupsforuser", function(req, res) {
    var uuid = req.param("uuid");
    group_query = {
        method: "GET",
        endpoint: "users/" + uuid + "/groups"
    };
    if (loggedIn === null) {
        logIn(req, res, getgroupsforuser);
    } else {
        getgroupsforuser(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function getgroupsforuser(req, res) {
    loggedIn.request(group_query, function(err, groups) {
        if (err) {
            res.send("ERROR - " + JSON.stringify(err));
        } else {
            res.send(groups.entities);
        }
    });
}

function getgroupsforuser2(req, res) {
    loggedIn.request(group_query, function(err, groups) {
        if (err) {
            console.log("ERROR - " + JSON.stringify(err));
        } else {
            console.log(groups.entities);
            allgroups = groups;
        }
    });
}
app.get("/deletegroupforuser", function(req, res) {
    var uuid = req.param("uuid");
    var group = req.param("group");
    group_query = {
        method: "DELETE",
        endpoint: "groups/" + group + "/users/" + uuid
    };
    if (loggedIn === null) {
        logIn(req, res, deletegroupforuser);
    } else {
        deletegroupforuser(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function deletegroupforuser(req, res) {
    loggedIn.request(group_query, function(err, groups) {
        if (err) {
            res.send("ERROR - " + JSON.stringify(err));
        } else {
            res.send(groups.entities);
        }
    });
}
var gcmids_query = "";
var gcmid = "";
app.get("/attachgcmidtouser", function(req, res) {
    gcmid = req.param("gcmid");
    var uuid = req.param("uuid");
    gcmids_query = {
        type: "user",
        uuid: req.param("uuid")
    };
    if (loggedIn === null) {
        logIn(req, res, attachgcmidtouser);
    } else {
        attachgcmidtouser(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function attachgcmidtouser(req, res) {
    loggedIn.getEntity(gcmids_query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            //  res.send(entity);
            var gcm_ids = [];
            if ("gcm_ids" in entity._data) gcm_ids = entity._data.gcm_ids;
            //            res.send(gcm_ids);
            //            return;
            if (gcm_ids.indexOf(gcmid) > -1) {
                res.send("SUCCESS");
                return;
            }
            gcm_ids.push(gcmid);
            entity.set("gcm_ids", gcm_ids);
            entity.save(function(err) {
                if (err) {
                    res.jsonp(500, "ERROR");
                    return;
                }
                res.send(gcm_ids);
            });
        }
    });
}
var detach_query = "";
app.get("/detachgcmidsfromuser", function(req, res) {
    detach_query = {
        type: "user",
        uuid: req.param("uuid")
    };
    if (loggedIn === null) {
        logIn(req, res, detachgcmidsfromuser);
    } else {
        detachgcmidsfromuser(req, res);
    } //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
});

function detachgcmidsfromuser(req, res) {
    loggedIn.getEntity(detach_query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            //  res.send(entity);
            var gcm_ids = [];
            entity.set("gcm_ids", gcm_ids);
            entity.save(function(err) {
                if (err) {
                    res.jsonp(500, "ERROR");
                    return;
                }
                res.send("SUCCESS " + gcm_ids);
            });
        }
    });
}
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
var uuid = "";
var updateoptions = "";
var receiver = {};
var acceptoptions = "";
app.get("/acceptdonation", function(req, res) {
    uuid = req.param("uuid");
    receiver = {
        receiver_name: req.param("receiver_name"),
        receiver_phone: req.param("receiver_phone"),
        receiver_email: req.param("receiver_email"),
        receiver_uuid: req.param("receiver_uuid"),
        received_time: req.param("received_time")
    };
    updateoptions = {
        receiver: receiver,
        status: "Accepted"
    };
    var acname = uuid + req.param("receiver_email");
    acceptoptions = {
        donationid: uuid,
        name: acname,
        receiver: receiver,
        status: "Accepted"
    }; //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}
    /*    if (loggedIn === null) {
            logIn(req, res, updatecount);
          } else {
            userid = req.param('userid');
            updatecount(req, res);
          }*/
    if (
        loggedIn === null
    ) {
        logIn(req, res, function() {
            //    acceptdonation(acceptoptions,updateoptions, req, res);
            acceptdonation(uuid, req, res);
        });
    } else {
        //acceptdonation(acceptoptions,updateoptions, req, res);
        acceptdonation(uuid, req, res);
    }
});

function acceptdonation(uuid, req, res) {
    var opt = {
        type: "Deals", //Required - the type of collection to be retrieved
        uuid: uuid
    };
    loggedIn.getEntity(opt, function(err, Deals) {
        //    loggedIn.createCollection(options, function(err, ngccnotifications) {
        //  loggedIn.request({ options, function(err, ngccnotifications) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        //        res.send(Deals._data.passengers.length);
        //        return;
        Deals.set("receiver", receiver);
        Deals.set("status", req.param("status"));
        Deals.save(function(err) {
            if (err) {
                //error - user not updated
                //  res.jsonp(500, {'error': JSON.stringify(err) });
                res.send("Damn! Error Saving Object!");
                return;
            } else {
                //success - user updated
                res.jsonp(Deals);
            }
        });
    });
}
var aDeals_query = "";
app.get("/acceptedDeals", function(req, res) {
    var email = req.param("email");
    if (loggedIn === null) {
        logIn(req, res, function() {
            acceptedDeals(email, req, res);
        });
    } else {
        acceptedDeals(email, req, res);
    }
});

function acceptedDeals(email, req, res) {
    var opt = {
        type: "Deals",
        qs: { ql: "status='ACCEPTED' && receiver.receiver_email='" + email + "'" }
    };
    loggedIn.createCollection(opt, function(err, Deals) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        //        res.jsonp(Deals._list[0]._data.passengers);
        //        return;
        var accepted_Deals = [];
        if (!Deals._list || Deals._list.length === 0) {
            res.send("You Have No Accepted Deals.");
            return;
        } else {
            for (var i = 0; i < Deals._list.length; i++) {
                accepted_Deals.push(Deals._list[i]);
            }
        }
        if (accepted_Deals && accepted_Deals.length > 0)
            res.send(accepted_Deals);
        else res.send("You Have No Accepted Deals.");
    });
}
var aDeals_query = "";
app.get("/getpassengersfordonation", function(req, res) {
    var uuid = req.param("uuid");
    if (loggedIn === null) {
        logIn(req, res, function() {
            getpassengersfordonation(uuid, req, res);
        });
    } else {
        getpassengersfordonation(uuid, req, res);
    }
});

function getpassengersfordonation(uuid, req, res) {
    var query = {
        type: "Deals",
        uuid: uuid
    };
    loggedIn.getEntity(query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            res.send(entity._data.passengers);
            return;
        }
    });
}
var aDeals_query = "";
app.get("/getgcmidsbyuser", function(req, res) {
    var uuid = req.param("uuid");
    if (loggedIn === null) {
        logIn(req, res, function() {
            getgcmidsbyuser(uuid, req, res);
        });
    } else {
        getgcmidsbyuser(uuid, req, res);
    }
});

function getgcmidsbyuser(uuid, req, res) {
    var query = {
        type: "user",
        uuid: uuid
    };
    loggedIn.getEntity(query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            res.send(entity._data.gcm_ids);
            return;
        }
    });
}
var aDeals_query = "";
app.get("/getuserbyuuid", function(req, res) {
    var uuid = req.param("uuid");
    if (loggedIn === null) {
        logIn(req, res, function() {
            getuserbyuuid(uuid, req, res);
        });
    } else {
        getuserbyuuid(uuid, req, res);
    }
});

function getuserbyuuid(uuid, req, res) {
    var query = {
        type: "user",
        uuid: uuid
    };
    loggedIn.getEntity(query, function(err, entity) {
        if (err) {
            res.send("ERROR");
        } else {
            res.send(entity._data);
            return;
        }
    });
}
app.get("/canceloffer", function(req, res) {
    var uuid = req.param("uuid");
    if (loggedIn === null) {
        logIn(req, res, function() {
            canceloffer(uuid, req, res);
        });
    } else {
        canceloffer(uuid, req, res);
    }
});

function canceloffer(uuid, req, res) {
    var opt = {
        type: "Deals",
        uuid: uuid
    };
    loggedIn.getEntity(opt, function(err, o) {
        if (err) {
            res.jsonp(500, { error: JSON.stringify(err) });
            return;
        }
        o.destroy(function(err) {
            if (err) {
                res.send("Could not cancel offer");
            } else {
                //success - user deleted from database
                o = null; //blow away the local object
                res.send("Successfully Cancelled Offered donation.");
            }
        });
    });
}
app.get("/cancelaccepteddonation", function(req, res) {
    var uuid = req.param("uuid");
    var receiver_email = req.param("receiver_email");
    updateoptions = {
        type: "Deals", //Required - the type of collection to be retrieved
        uuid: uuid
    };
    if (loggedIn === null) {
        logIn(req, res, function() {
            canceldonation(receiver_email, updateoptions, req, res);
        });
    } else {
        canceldonation(receiver_email, updateoptions, req, res);
    }
});

function canceldonation(e, updateoptions, req, res) {
    loggedIn.getEntity(updateoptions, function(err, o) {
        if (err) {
            res.jsonp(500, err);
            return;
        }
        if (o._data.receiver.receiver_email === e) {
            o.set("receiver", "");
            o.set("status", "OFFERED");
        }
        o.save(function(err) {
            if (err) {
                //             res.jsonp(500, err);
                res.send("Could not update status to cancelled");
                return;
            } else {
                res.jsonp(o);
            }
        });
    });
}
app.post("/createDeals", function(req, res) {
    var b = req.body;
    b.name = req.body.email + "-" + req.param("time");
    /*var e = {
        name: name,
        offeredby: req.param("offeredby"),
        from_place: req.param("from_place"),
        city: req.param("city"),
        address: req.param("address"),
        phone_number: req.param("phone_number"),
        email: req.param("email"),
        currentcount: "0",
        itemtype: req.param("itemtype"),
        fa_icon: req.param('fa_icon'),
        items: req.param("items"),
        status: "OFFERED",
        time: req.param("time"),
        location: { latitude: req.param("latitude"), longitude: req.param("longitude") }
    };*/
    console.log("##### createDeals - " + JSON.stringify(b));
    if (loggedIn === null) {
        logIn(req, res, function() {
            createDeals(b, req, res);
        });
    } else {
        createDeals(b, req, res);
    }
});

function createDeals(e, req, res) {
    var opts = {
        type: "Deals"
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
            res.send("OFFER CREATED");
        });
    });
}
app.post("/createneed", function(req, res) {
    var b = req.body;
    b.name = req.body.email + "-" + req.param("time");
    console.log("Create Need Body=" + JSON.stringify(b));
    if (loggedIn === null) {
        logIn(req, res, function() {
            createneed(b, req, res);
        });
    } else {
        createneed(b, req, res);
    }
});

function createneed(e, req, res) {
    var opts = {
        type: "needs"
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
            /*if (mysocket) {
                console.log("##### Sending emergency event object");
                //mysocket.broadcast.emit('emergencydata', o);
                io.sockets.emit('emergencydata', o);
                console.log("#### Sent event emergencydata");
            } else {
                console.log("#### mysocket is null");
            }*/
            res.send("NEED CREATED");
        });
    });
}
app.post("/createevent", function(req, res) {
    var t = new Date();
    req.body.name = req.body.email + "-" + t;
    console.log("####Create Event Request Body: " + req.body);
    var options = {
        method: "POST",
        endpoint: "donationevents",
        body: req.body
    };
    if (loggedIn === null) {
        logIn(req, res, function() {
            createevent(options, req, res);
        });
    } else {
        createevent(options, req, res);
    }
});

function createevent(e, req, res) {
    loggedIn.request(e, function(err, data) {
        if (err) {
            res.send("ERROR");
        } else {
            console.log("#######CreateEvents Success!!!!!");
            if (mysocket) {
                console.log("##### Sending event " + data.entities[0].group_name);
                //mysocket.broadcast.emit('matchingevent', o);
                io.sockets.in(data.entities[0].group_name).emit('matchingevent', data);
                //io.sockets.emit('matchingevent', data);
                console.log("####Sent matchingevent");
                var msg = JSON.stringify(data.entities[0].items + "@: " +
                    data.entities[0].address + ". Contact " + data.entities[0].postedby + ": " +
                    data.entities[0].phone_number + " / " + data.entities[0].email);
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
app.get("/connectentities", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, function() {
            connectentities(req, res);
        });
    } else {
        connectentities(req, res);
    }
});

function connectentities(req, res) {
    var connecting_entity_options = {
        client: loggedIn,
        data: {
            type: 'groups',
            uuid: req.param('uuid1')
        }
    };
    var connecting_entity = new usergrid.entity(connecting_entity_options);
    // create an entity object that models the entity being connected to
    var connected_entity_options = {
        client: loggedIn,
        data: {
            type: 'donationevents',
            uuid: req.param('uuid2')
        }
    };
    var connected_entity = new usergrid.entity(connected_entity_options);
    // the connection type
    var relationship = 'matches';
    // send the POST request
    connecting_entity.connect(relationship, connected_entity, function(error, result) {
        if (error) {
            console.log("Error connecting entities - " + error);
        } else {
            // Success
            console.log("Success connecting entities");
            res.jsonp(result);
        }
    });
}
app.get("/getconnectionsforgroup", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, function() {
            getconnectionsforgroup(req, res);
        });
    } else {
        getconnectionsforgroup(req, res);
    }
});

function getconnectionsforgroup(req, res) {

    // create an Usergrid.Entity object that models the entity to retrieve connections for
    var options = {
        client: loggedIn,
        data: {
            type: 'groups',
            uuid: req.param('uuid')
        }
    };
    try {
        var entity = new usergrid.entity(options);
    } catch (error) {
        console.log("Error fetching connections - " + JSON.stringify(error));
        return;
    }
    // the connection type you want to retrieve
    var relationship = 'matches';
    // initiate the GET request
    entity.getConnections(relationship, function(error, result) {
        if (error) {
            // Error
            console.log("Error fetching connections - " + JSON.stringify(error));
        } else {
            // Success
            console.log("Success getting connected entities : " + JSON.stringify(result));
            res.jsonp(result);
        }
    });
}
var allconnections = [];
var index = 0;
var entity = {};

function getconnectionsforgroup2(req, res, uuid, last) {

    if (!uuid) {
        console.log("getconnectionsforgroup2: No group uuid received");
        return;
    }

    var options = {
        client: loggedIn,
        data: {
            type: 'groups',
            uuid: uuid
        }
    };
    entity = new usergrid.entity(options);

    // the connection type you want to retrieve
    var relationship = 'matches';
    // initiate the GET request
    entity.getConnections(relationship, function(error, result) {
        if (error) {
            // Error
            console.log("Error fetching connections - " + JSON.stringify(error));
        } else {
            // Success
            console.log("Success getting connected entity for group id " + uuid);

            //console.log(JSON.stringify(result));
            if (result.entities && result.entities.length > 0)
                allconnections = allconnections.concat(result.entities);
        }
    });
    if (last) {
        setTimeout(function() {
            console.log("All Events: " + JSON.stringify(allconnections));
            res.jsonp(allconnections);
        }, 5000)
    }
}

app.get("/geteventsforuser", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, function() {
            geteventsforuser(req, res);
        });
    } else {
        geteventsforuser(req, res);
    }
});

function geteventsforuser(req, res) {

    // create an Usergrid.Entity object that models the entity to retrieve connections for
    var uuid = req.param("uuid");
    allconnections = [];
    allgroups = [];
    index = 0;
    group_query = {
        method: "GET",
        endpoint: "users/" + uuid + "/groups"
    };
    loggedIn.request(group_query, function(err, groups) {

        if (err) {
            console.log("ERROR - " + JSON.stringify(err));
            return;
        } else {
            var uuids = [];
            if (!groups || !groups.entities || groups.entities.length == 0) {
                console.log("No subscribed event groups found");
                res.jsonp("No Groups Found");
                return;
            }
            console.log("Found " + groups.entities.length + " subscriptions.");
            var query = '';
            for (var i = 0; i < groups.entities.length; i++) {
                uuids.push(groups.entities[i].uuid);
                query += "group_uuid = '" + groups.entities[i].uuid + "'";
                if (i < (groups.entities.length - 1))
                    query += " or ";
            }
            // geteventsforgroups(req, res, uuids);
            console.log("geteventsforuser query = " + query);
            var options2 = {
                type: "donationevents?limit=100",
                qs: {
                    ql: query
                }
            };
            if (loggedIn === null) {
                logIn(req, res, function() {
                    geteventsforuser(req, res);
                });
            } else {
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
                    res.jsonp(allevents);
                });
            }
        }
    });
}
var geo_query = "";
app.get("/vicinityquery", function(req, res) {
    var criteria =
        "location within " +
        req.param("radius") +
        " of " +
        req.param("latitude") +
        ", " +
        req.param("longitude");
    var count = 100;
    if (req.param("nearest") == "") {
        count = 100;
    } else {
        count = req.param("nearest");
    }
    var type = req.param("type");
    if (!type || type === 'deals') {
        geo_query = {
            type: "Deals?limit=" + count, //Required - the type of collection to be retrieved
            //		qs:criteria
            //        qs: {"ql": "location within 500 of 51.5183638, -0.1712939000000233"}
            qs: { ql: criteria }
        };
    } else if (type && type === 'needs') {
        geo_query = {
            type: "needs?limit=" + count, //Required - the type of collection to be retrieved
            //		qs:criteria
            //        qs: {"ql": "location within 500 of 51.5183638, -0.1712939000000233"}
            qs: { ql: criteria + " and not (emergency = 'YES' or emergency = true)" }
        };
    } else if (type && type === 'emergency') {
        geo_query = {
            type: "needs?limit=" + count, //Required - the type of collection to be retrieved
            //		qs:criteria
            //        qs: {"ql": "location within 500 of 51.5183638, -0.1712939000000233"}
            qs: { ql: criteria + " and (emergency = true or emergency = 'YES')" }
        };
        console.log("Emergency Query = " + geo_query);
    } else {
        res.jsonp("Invalid Type - must be offers or needs");
        return;
    }
    if (loggedIn === null) {
        logIn(req, res, getDealsbylocation);
    } else {
        //      userid = req.param('userid');
        //      alert("Calling getDealsbylocation');
        getDealsbylocation(req, res);
    }
});

function getDealsbylocation(req, res) {
    loggedIn.createCollection(geo_query, function(err, Deals) {
        if (err) {
            res.jsonp(500, { getDealsbylocation_error: JSON.stringify(err) });
            return;
        }
        var allDeals = [];
        while (Deals.hasNextEntity()) {
            var arow = Deals.getNextEntity().get();
            /*          var e = { 'ID': arow.uuid,
                              		'name': arow.name,
                                      'street': arow.street,
                                      'address_line2': arow.address_line2,
                                      'city': arow.city,
                                     	'country': arow.country,
                                     'phone': arow.phone,
                                     'email': arow.email,
                  			'Roommate': arow.roommate,
                  			'Movie': arow.movie,
                  			'Travel': arow.travel,
                  			'Room': arow.room,
                  			'EatOut': arow.eatout,
                  			'Hiking': arow.hiking,
                                     'Created': deal.created};*/
            allDeals.push(arow);
        }
        res.jsonp(allDeals);
    });
}
app.post("/creategroup", function(req, res) {
    var group = req.body.group;
    if (group)
        group = group.trim().toUpperCase().replace(/ /g, "-");
    console.log("Creating Group: " + group);
    var options = {
        method: "POST",
        endpoint: "groups",
        body: {
            path: group,
            name: group
        }
    };
    if (loggedIn === null) {
        logIn(req, res, function() {
            createGroup(options, req, res);
        });
    } else {
        createGroup(options, req, res);
    }
});

function createGroup(e, req, res) {
    loggedIn.request(e, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(201);
        }
    });
}
app.get("/addusertogroup", function(req, res) {
    var group = req.param("group");
    var user = req.param("user");
    if (group)
        group = group.trim().toUpperCase().replace(/ /g, "-");
    var options = {
        method: "POST",
        endpoint: "groups/" + group + "/users/" + user
    };
    if (loggedIn === null) {
        logIn(req, res, function() {
            addUserToGroup(options, req, res);
        });
    } else {
        addUserToGroup(options, req, res);
    }
});

function addUserToGroup(e, req, res) {
    loggedIn.request(e, function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
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

app.get("/verifyresettoken", function(req, res) {
    if (loggedIn === null) {
        logIn(req, res, verifyresettoken);
    } else {
        verifyresettoken(req, res);
    }
});

function verifyresettoken(req, res) {
    var option = {
        type: "users",
        name: req.param("email")
    };
    loggedIn.getEntity(option, function(err, entity) {
        // encryptedPw = encryptPassword(req.param('password'));
        if (err) {
            res.send("ERROR");
        } else {
            console.log("verifyresettoken: entity = " + JSON.stringify(entity));
            var resettoken = entity.get("resettoken");

            console.log("ResetToken = " + resettoken);
            if (resettoken === req.param('token')) {
                console.log("Password reset token matched successfully");
                res.send("Please follow the following link to set a new password: " + BASEGUIURL + "#updatepassword");
                return;
            } else {
                console.log("Password reset token NOT matched");
                res.send("FAIL");
                return;
            }
        }
    });

}; //qs:{ql:"name='bread' or uuid=b3aad0a4-f322-11e2-a9c1-999e12039f87"}

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
            res.jsonp(500, { error: err });
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
        next(req, res);
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
io.on('connection', function(socket) {
    mysocket = socket;
    socket.on('room', function(loggedinUser) { //login
        if (!loggedinUser || loggedinUser == undefined) {
            console.log("####Ignoring null or undefined login time join request");
            return;
        }
        console.log("####Conecting client socket to room " + loggedinUser.email);
        socket.join(loggedinUser.email);
        var online = false;
        if (onlineUsers && onlineUsers.length > 0) {
            for (i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].email === loggedinUser.email) {
                    online = true;
                    break;
                }
            }
        }
        if (!online) {
            onlineUsers.push(loggedinUser);
            console.log("#### Online now - " + JSON.stringify(loggedinUser));
            io.emit('activeuserschanged', loggedinUser.email);
        }
    });
    socket.on('join', function(targetUser) { //login
        if (!targetUser || targetUser == undefined) {
            console.log("####Ignoring null or undefined join request");
            return;
        } else {
            console.log("####Checking if target user " + JSON.stringify(targetUser) + " is online.")
        }
        if (onlineUsers && onlineUsers.length > 0) {
            var online = false;
            for (i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].email === targetUser.email) {
                    online = true;
                    break;
                }
            }
            if (!online) {
                console.log("####Cannot join room " + targetUser.email + ", seems offline");
                socket.emit('offline', targetUser.email);
            } else {
                console.log("####Joining room " + targetUser.email);
                socket.join(targetUser.email);
            }
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
                    onlineUsers.splice(i, 1);
                    console.log("Removed user " + room + "from online list");
                }
            }
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
                    onlineUsers.splice(i, 1);
                    console.log("Removed user " + email + " from online list");
                }
            }
        }
        console.log("#### Broadcasting logout event for " + email + " for all users to update active user states");
        console.log("#### Online USers after delete: " + JSON.stringify(onlineUsers));
        io.emit('activeuserschanged', email);
    });
});