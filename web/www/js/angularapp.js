var app = angular.module("myApp", [
    "ngRoute",
    "ui.bootstrap",
    "ui.directives",
    "ui.filters",
    "ui-notification",
    "720kb.socialshare"
]);
app.config([
    "$routeProvider",
    function($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "Login.html",
                controller: "ChatCtrl",
                isLogin: true
            })
            .when("/home", {
                templateUrl: "chatbox.html",
                controller: "ChatCtrl"
            })
            .when("/chat", {
                templateUrl: "chatbox.html",
                controller: "ChatCtrl"
            })
            .when("/personality", {
                templateUrl: "personality.html",
                controller: "ChatCtrl"
            })
            .when("/register", {
                templateUrl: "Register.html",
                controller: "ChatCtrl"
            })
            .when("/updateuser", {
                templateUrl: "UpdateProfile.html",
                controller: "ChatCtrl"
            })
            .when("/updatepassword", {
                templateUrl: "UpdateProfile.html",
                controller: "ChatCtrl"
            })
            .when("/signup", {
                templateUrl: "Register.html",
                controller: "ChatCtrl"
            })
            .when("/getdeal", {
                templateUrl: "Listdeals.html",
                controller: "ChatCtrl"
            })
            .when("/dealsaccepted", {
                templateUrl: "MyPickupList.html",
                controller: "ChatCtrl"
            })
            .when("/offerdeal", {
                templateUrl: "Offerdeal.html",
                controller: "ChatCtrl"
            })
            .when("/offershistory", {
                templateUrl: "MyOffers.html",
                controller: "ChatCtrl"
            })
            .when("/createneed", {
                templateUrl: "CreateNeed.html",
                controller: "ChatCtrl"
            })
            .when("/createemergency", {
                templateUrl: "CreateEmergency.html",
                controller: "ChatCtrl"
            })
            .when("/viewneeds", {
                templateUrl: "NeedsNearby.html",
                controller: "ChatCtrl"
            })
            .when("/viewemergencies", {
                templateUrl: "ViewEmergencies.html",
                controller: "ChatCtrl"
            })
            .when("/settings", {
                templateUrl: "settings.html",
                controller: "ChatCtrl"
            })
            .when("/subscribe", {
                templateUrl: "Subscribe.html",
                controller: "ChatCtrl"
            })
            .when("/sendnotification", {
                templateUrl: "SendPush.html",
                controller: "ChatCtrl"
            })
            .when("/notifications", {
                templateUrl: "Notifications.html",
                controller: "ChatCtrl"
            })
            .when("/resetpw", {
                templateUrl: "ResetPassword.html",
                controller: "ChatCtrl"
            })
            .when("/index", {
                templateUrl: "index.html",
                controller: "ChatCtrl"
            })
            .when("/contactus", {
                templateUrl: "ContactUs.html",
                controller: "ChatCtrl"
            })
            .otherwise({
                redirectTo: "/home"
            });
    }
]);
app.config(['socialshareConfProvider', function configApp(socialshareConfProvider) {

    socialshareConfProvider.configure([{
            'provider': 'twitter',
            'conf': {
                'url': 'http://720kb.net',
                'text': '720kb is enough',
                'via': 'npm',
                'hashtags': 'angularjs,socialshare,angular-socialshare',
                'trigger': 'click',
                'popupHeight': 800,
                'popupWidth': 400
            }
        },
        {
            'provider': 'facebook',
            'conf': {
                'url': 'http://720kb.net',
                'popupHeight': 1000,
                'popupWidth': 1000
            }
        },
        //and so on ...
        {
            'provider': 'google',
            'conf': {
                'url': 'http://720kb.net',
                'trigger': 'mouseover',
                'popupHeight': 900,
                'popupWidth': 700
            }
        },
        {
            'provider': 'linkedin',
            'conf': {
                'url': 'http://720kb.net',
                'trigger': 'mouseover',
                'popupHeight': 900,
                'popupWidth': 700
            }
        }
    ]);
}]);
app.service("DataService", function() {
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;
    var response = "";

    function whatIsIt(object) {
        if (object === null) {
            response = "null";
            return response;
        } else if (object === undefined) {
            response = "undefined";
            return response;;
        } else if (object.constructor === stringConstructor) {
            response = "String";
            return response;;
        } else if (object.constructor === arrayConstructor) {
            response = "Array";
            return response;
        } else if (object.constructor === objectConstructor) {
            response = "Object";
            return response;
        } else {
            response = "don't know";
            return response;
        }
    }

    function isValidArray(object) {
        whatIsIt(object);
        if (response === "Array")
            return true;
        else
            return false;
    }

    function isValidObject(object) {
        whatIsIt(object);
        if (response === "Object")
            return true;
        else
            return false;
    }

    function isNull(object) {
        whatIsIt(object);
        if (response === "null")
            return true;
        else
            return false;
    }

    function isString(object) {
        whatIsIt(object);
        if (response === "String")
            return true;
        else
            return false;
    }

    function isUnDefined(object) {
        whatIsIt(object);
        if (response === "don't know" || response === "undefined")
            return true;
        else
            return false;
    }
    return {
        whatIsIt: whatIsIt,
        isValidArray: isValidArray,
        isValidObject: isValidObject,
        isNull: isNull,
        isString: isString,
        isUnDefined: isUnDefined,
    };
});

app.service("UserService", function() {
    var loggedinUser = {};
    var isLoggedIn = false;
    var setLoggedIn = function(newObj) {
        loggedinUser = newObj;
        //       console.log("New User = " + JSON.stringify(loggedinUser));
    };

    var getLoggedIn = function() {
        return loggedinUser;
    };

    var setLoggedInStatus = function(state) {
        isLoggedIn = state;
    }
    var getLoggedInStatus = function() {
        return isLoggedIn;
    }
    return {
        setLoggedIn: setLoggedIn,
        getLoggedIn: getLoggedIn,
        setLoggedInStatus: setLoggedInStatus,
        getLoggedInStatus: getLoggedInStatus,
    };
});

var BASEURL_LOCAL = "http://localhost:9000";
var BASEURL_PERSONAL = "https://chatapisujoy-brave-hedgehog.mybluemix.net";
var BASEURL = BASEURL_PERSONAL;
//var GUIURL = 'https://chatwebsujoy.mybluemix.net';
var GUIURL = 'http://localhost:3000';
var GEOCODEURL = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA_sdHo_cdsKULJF-upFVP26L7zs58_Zfg";

app.controller("ChatCtrl", function($scope, $rootScope, $http, $filter, $location, $timeout, $interval, $anchorScroll, $window, Notification, Socialshare, UserService, DataService) {
    $scope.spinner = false;
    $scope.alldeals = false;
    $scope.allneeds = false;
    var socket = null;
    var room = null;
    $scope.loading = false;
    $rootScope.username = UserService.getLoggedIn().fullname;
    $scope.cancel = false;
    $scope.uuid = UserService.getLoggedIn().uuid;
    $scope.lat = "";
    $scope.lng = "";

    //$scope.settings = adjustsettings(UserService.getLoggedIn().settings);
    $scope.selectedto = undefined;
    $scope.selectedfrom = undefined;
    $rootScope.login_email = UserService.getLoggedIn().email;
    $scope.login_fullname = UserService.getLoggedIn().fullname;
    $scope.showChat = true;
    $scope.found = "";
    $scope.result = "";
    $scope.errorMsg = "";
    $scope.groupusers = [];
    var param_name = "";
    $scope.offererUUID = "";
    $scope.reverseSort = false;
    $scope.emergency = false;
    $scope.eventsCount = 0;
    $rootScope.mobileDevice = false;
    $scope.chatbox = "";
    $rootScope.chatArray = [];
    //$rootScope.onlineUsers = [];
    //$rootScope.personalitytext = null;
    $scope.loading = false;
    $scope.showValues = false;
    $scope.showPersonality = false;
    $scope.showNeeds = false;
    $scope.showConsumption = false;
    $scope.resultsReady = false;
    $scope.LOL = false;
    $scope.errorMsg = '';
    $scope.sampleText = "Your literature review should be appropriate to the kind of paper you are writing. If it is a thesis, you should strive for completeness, both in reviewing all the relevant literature and in making the main arguments clear to a reader who is unfamiliar with that literature. For a course paper or journal article, it is sufficient to review the main papers that are directly relevant. Again, you should assume that your reader has not read them, but you need not go into detail. You should review only those points that are relevant to the arguments you will make. Do not say that ``X found Y'' or ``demonstrated'' if X's conclusions don't follow from X's results. You can use words like ``X claimed to show that Y'' or ``suggested that'' when you are not sure. If you see a flaw, you can add, ``However ...''. Try to avoid expressions like ``Unfortunately, Smith and Jones neglected to examine [precisely what you are examining].'' It might have been unfortunate for them or for the field, but it is fortunate for you, and everyone knows it.";
    $scope.events = [];
    $scope.timeout = null;
    $scope.showPersonality = false;
    var lastHeartBeat = null;
    var lasTimeStamp = null;
    $scope.showDropdown = false;
    $rootScope.secondPersonTextArray = [];
    var today = new Date().toISOString().slice(0, 10);
    $rootScope.lastUUID = "";
    $scope.today = {
        value: today
    };
    $scope.maxDate = {
        value: new Date(2015, 12, 31, 14, 57)
    };
    $scope.isMobileDevice = function() {

    };
    $scope.isVisible = function() {
        /*return ("/login" !== $location.path() && "/signup" !== $location.path() &&
            "/resetpw" !== $location.path() && "/updatepassword" !== $location.path());*/
        return true;
    };
    $rootScope.$on("CallGetEventsMethod", function() {
        $scope.GetEventsForUser(true);
    });
    $rootScope.$on("CallGetGroupsForUserMethod", function() {
        $scope.GetGroupsForUser();
    });
    $rootScope.$on("CallSetupWebsocketsMethod", function() {
        $scope.setupWebSockets(UserService.getLoggedIn().email, null);
    });
    $rootScope.$on("CallGetAllUsersMethod", function() {
        $scope.GetAllUsers();
    });
    $rootScope.$on("CallGetOnlineUsersMethod", function() {
        $scope.GetOnlineUsers();
    });
    $rootScope.$on("CallStartTimerMethod", function() {
        $scope.StartTimer();
    });
    $scope.$on("StopTimer", function() {
        $scope.StopTimer();
    });
    $scope.$on("NewLogin", function() {
        $scope.setupWebSockets(UserService.getLoggedIn().email, 'newlogin');
    });
    $scope.$on("CallCreateUserMethod", function() {
        $scope.CreateUser(UserService.getLoggedIn());
    });
    $rootScope.$on("Logout", function() {
        console.log("####Sending logout event to server for broadcasting....");
        $scope.setupWebSockets(UserService.getLoggedIn().email, 'logout');
        $scope.login_email = "";
        UserService.setLoggedIn({});
        UserService.setLoggedInStatus(false);
        $rootScope.loggedIn = false;
        $scope.eventsCount = 0;
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("####Logout Done!")
        }, function(error) {
            // An error happened.
            console.error("##### Problem logging user out " + JSON.stringify(error));
        });
        console.log("Logout: Set logged in status = " + UserService.getLoggedInStatus());
        $scope.StopTimer();
        $location.path("/home");
        return;
    });
    $rootScope.$on("alive", function() {
        //console.log("####Sending heartbeat event to server for broadcasting....");
        $scope.setupWebSockets(UserService.getLoggedIn().email, 'alive');
        return;
    });
    $rootScope.$on('$routeChangeStart', function(event, next) {

        if (!UserService.getLoggedInStatus() && ("/login" === $location.path() || "/chat" === $location.path() ||
                "/subscribe" === $location.path() || "/notifications" === $location.path() || "/personality" === $location.path() ||
                "/updatepassword" === $location.path() || "/createneed" === $location.path() ||
                "/offershistory" === $location.path())) {
            //console.log("User not logged in for access to " + $location.path());
            /* You can save the user's location to take him back to the same page after he has logged-in */
            $rootScope.savedLocation = $location.path();

            $location.path("/home");
            return;
        } else if (UserService.getLoggedInStatus() && "/login" == $location.path()) {
            $location.path("/home");
            return;
        }
    });

    $scope.GeoCodeAddress = function(offer, func) {
        console.log("GeoCode URL=" + GEOCODEURL + "&address=" +
            offer.address);

        $http({
            method: "GET",
            url: encodeURI(GEOCODEURL + "&address=" + offer.address)
        }).then(
            function mySucces(response) {
                if (!DataService.isValidObject(response) || !DataService.isValidObject(response.data) ||
                    !DataService.isValidArray(response.data.results)) {
                    console.log("####Invalid response")
                    Notification.error({ message: "A problem occured!", title: "Error", positionY: 'top', positionX: 'center', delay: 4000 });
                    return;
                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.geoCodeResponse = response.data;
                $scope.geocodesuccess = true;
                $scope.lat = $scope.geoCodeResponse.results[0].geometry.location.lat;
                $scope.lng = $scope.geoCodeResponse.results[0].geometry.location.lng;
                if (func && func === 'need') {
                    console.log("Creating Need...");
                    $scope.CreateNeed(offer, false);
                } else if (func && func === 'emergency') {
                    console.log("Creating Emergency...");
                    $scope.CreateNeed(offer, true);
                } else if (func && func === 'offer') {
                    console.log("Creating Offer...");
                    $scope.SendOffer(offer);
                } else {
                    console.log("No action after Geocoding");
                    Notification.error({ message: "A problem occured getting address latitude/longitude!", title: "Error", positionY: 'top', positionX: 'center', delay: 4000 });
                }
            },
            function myError(response) {
                $scope.geoCodeResponse = response.statusText;
                $scope.lat = null;
                $scope.lng = null;
            }
        );
    };

    $scope.ShowDirections = function(address) {
        $window.open("https://www.google.com/maps?saddr=My+Location&daddr=" + address + "/", "_blank");
    };
    $scope.english = '';
    $scope.GetFontAwesomeIconsForCategory = function(category) {
        var icon = '';
        if (!category || category.length < 4)
            return "fa fa-star";
        switch (category.trim()) {
            case "Electronics":
                icon = "fa fa-mobile";
                break;
            case "Fashion":
                icon = "fa fa-female";
                break;
            case "Educational":
                icon = "fa fa-university";
                break;
            case "Blood":
                icon = "fa fa-tint";
                break;
            case "Medical":
                icon = "fa fa-stethoscope";
                break;
            case "Organs":
                icon = "fa fa-heartbeat";
                break;
            case "Life Saving Drugs":
                icon = "fa fa-hospital-o";
                break;
            case "General Medicines":
                icon = "fa fa-medkit";
                break;
            case "Ambulance":
                icon = "fa fa-ambulance";
                break;
            case "Doctor":
                icon = "fa fa-user-md";
                break;
            case "Food":
                icon = "fa fa-cutlery";
                break;
            case "Furniture":
                icon = "fa fa-bed";
                break;
            case "Clothes":
                icon = "fa fa-shirtsinbulk";
                break;
            case "Sports":
                icon = "fa fa-futbol-o";
                break;
            case "Household":
                icon = "fa fa-home";
                break;
            case "Shoes":
                icon = "fa fa-tags";
                break;
            case "Other":
                icon = "fa fa-star";
            case "Natural Disaster":
                icon = "fa fa-fire";
                break;
            case "Terrorism":
                icon = "fa fa-bomb";
                break;
            case "Accident":
                icon = "fa fa-ambulance";
                break;
            case "Women's Safety":
                icon = "fa fa-life-ring";
                break;
            case "Children's Safety":
                icon = "fa fa-child";
                break;
            default:
                icon = "fa fa-star";
        }
        console.log("GetFontAwesomeIconsForCategory: Category=" + category + ", Icon=>" + icon);
        return icon;
    };
    $scope.TranslateEventToEnglish = function(type) {
        if (!type)
            $scope.english = "Emergency Event";
        switch (type.toUpperCase().trim()) {
            case "BLOOD":
                $scope.english = "Blood Needed";
                $scope.emergency = true;
                break;
            case "BLOOD":
                $scope.english = "Blood Needed";
                $scope.emergency = true;
                break;
            case "ORGANS":
                $scope.english = "Organ Needed";
                $scope.emergency = true;
                break;
            case "LIFE SAVING DRUGS":
                $scope.english = "Life Saving Drugs Needed";
                $scope.emergency = true;
                break;
            case "GENERAL MEDICINES":
                $scope.english = "General Medicines Needed";
                $scope.emergency = true;
                break;
            case "DOCTOR":
                $scope.english = "Doctor Needed";
                $scope.emergency = true;
                break;
            case "AMBULANCE":
                $scope.english = "Ambulance Needed";
                $scope.emergency = true;
                break;
            case "MEDICAL":
                $scope.english = "Medical Needs";
                $scope.emergency = true;
                break;
            case "DISASTER":
                $scope.english = "Natural Disaster";
                $scope.emergency = true;
                break;
            case "TERRORISM":
                $scope.english = "Terror Attack";
                $scope.emergency = true;
                break;
            case "ACCIDENT":
                $scope.english = "Accident";
                $scope.emergency = true;
                break;
            case "SAFETY":
                $scope.english = "Incident";
                $scope.emergency = true;
                break;
            case "OTHER":
                $scope.english = "Other Emergency";
                $scope.emergency = true;
                break;
            default:
                $scope.english = type;
        }
        return $scope.english;
    }
    $scope.isEmergency = function(type) {
        $scope.emergency = false;
        $scope.TranslateEventToEnglish(type);
        return $scope.emergency;
    }
    $scope.StackIcon = function(icon) {
        console.log("####StackIcon = " + icon + ' fa-stack-1x');
        $scope.stackicon = icon + ' fa-stack-1x';
        return icon + ' fa-stack-1x';
    }
    $scope.StartChat = function(user) {
        //alert(JSON.stringify(user));
        $rootScope.targetChatuser = user;
        //$scope.targetChatuserName = JSON.parse(user).fullname;
        $scope.showChat = true;
        if ($scope.showDropdown)
            $scope.showDropdown = false;
        else
            $scope.showDropdown = true;
        console.log("####Changed Target Chat User: " + JSON.stringify($rootScope.targetChatuser));
    };
    $scope.GetOnlineUsers = function() {
        $scope.loginResult = "";

        var getURL = BASEURL + "/onlineusers";

        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: encodeURI(getURL)
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.loginResult = "Success";
                if (DataService.isValidObject(response) && DataService.isValidArray(response.data)) {
                    $rootScope.onlineUsers = response.data.filter(value => Object.keys(value).length !== 0);
                    /*for (i = 0; i < $rootScope.onlineUsers.length; i++) {
                        if ($rootScope.onlineUsers[i].email === UserService.getLoggedIn().email ||
                            DataService.isUnDefined($rootScope.onlineUsers[i].email)) {
                            $rootScope.onlineUsers.splice(i);
                            console.log("Removed user " + i + "from online list");
                        }
                    }*/
                    //$scope.chat.targetuser = rootScope.onlineUsers[0];
                    console.log("##### online users detected: " + JSON.stringify($rootScope.onlineUsers));
                } else
                    console.log("#####No online users detected");
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.loginResult = "Error Received from Server.." + error.toString();
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.spinner = false;
                $scope.status = error.statusText;
            }
        );
    };

    $scope.SendChat = function(chat) {
        $scope.loginResult = "";
        var targetUSerOffline = true;
        console.log("####Sending chat event to " + JSON.stringify($rootScope.targetChatuser));
        /*if (!$rootScope.targetChatuser || $rootScope.targetChatuser.length < 2) {
            console.log("####SendChat -> target user seems offline");
            Notification.error({ message: "Select an online user from list", positionY: 'bottom', positionX: 'center' });
            return;
        }
        
        for (i = 0; i < $rootScope.onlineUsers.length; i++) {
            var auser = $rootScope.onlineUsers[i];
            if ($rootScope.targetChatuser === auser.email) {
                var targetUSerOffline = false;
                break;
            }
        }
        if (targetUSerOffline) {
            console.log("####SendChat -> target user seems offline");
            Notification.error({ message: "The user seems offline now.", positionY: 'bottom', positionX: 'center' });
            return;
        }*/
        var time = new Date();
        time = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        var msg = {
            "sentby": $rootScope.username,
            "email": UserService.getLoggedIn().email,
            "text": chat.text,
            "time": time,
            "css": {
                'background-color': "rgb(14, 153, 207)",
                'border': "1px solid red",
                'width': "70%"
            },
            align: "left"
        };
        $rootScope.chatArray.push(msg);
        $rootScope.chatText = msg;
        $scope.setupWebSockets($rootScope.targetChatuser, 'send');
        $scope.chat.text = null;
    };
    $scope.StartTimer = function() {
        $scope.timeout = $interval(function() {
            console.log("####Sending heartbeat event to server at " + new Date());
            //$scope.setupWebSockets(UserService.getLoggedIn().email, 'leave');
            $rootScope.$emit("alive", {});
        }, 10000);

    }
    $scope.StopTimer = function() {
        console.log("####Cancelling timer: " + JSON.stringify($scope.timeout));
        //if (!DataService.isUnDefined($scope.timeout))
        $timeout.cancel($scope.timeout);
        //else
        console.log("#### Stopped timer: " + JSON.stringify($scope.timeout));
    }
    $scope.ResetTimer = function() {
        $scope.StopTimer();
        $scope.StartTimer();
    }

    $scope.SendOffer = function(offer) {
        $scope.loginResult = "";
        var now = new Date();
        $scope.loginResult = "Sent Request";
        var postURL = BASEURL + "/createdeals";
        var reqObj = {
            email: $scope.login_email,
            offeredby: $scope.login_fullname,
            time: now,
            phone_number: event.phone,
            address: offer.address,
            city: offer.city,
            items: offer.items,
            itemtype: offer.itemtype,
            location: {
                latitude: $scope.lat,
                longitude: $scope.lng
            },
            fa_icon: $scope.GetFontAwesomeIconsForCategory(offer.itemtype)
        };
        postURL = encodeURI(postURL);
        $http.post(postURL, JSON.stringify(reqObj)).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("Create deal Response:" + JSON.stringify(response));
                $scope.loginResult = "Success";
                Notification.success({ message: "Good job! Successufully Published Your Offer. Thank You!", positionY: 'bottom', positionX: 'center' });
                //Notification.success({message: 'Success Top Left', positionX: 'left'});
                $scope.spinner = false;
                $scope.status = response.statusText;
                offer.type = "dealOffer";
                $scope.CheckIfGroupExists(offer);
                /*              notifyUsersInGroup(
                                          "FROM-" +
                                          offer.city.trim().toUpperCase() +
                                          "-" +
                                          offer.from.trim().toUpperCase(),
                                          offer.from,
                                          filteredtime,
                                          offer.name,
                                          offer.phone
                                      );*/
                //      alert("Offer " + response.statusText);
                //   var MS_PER_MINUTE = 60000;
                //   var myStartDate = new Date(offerDate.valueOf() - 15 * MS_PER_MINUTE);
                //send notification to creator 15 min b4 deal starts
                //               schedulePush(new Date());
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.loginResult = "Error Received from Server.." + error.toString();
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.spinner = false;
                $scope.status = error.statusText;
            }
        );
    };
    $scope.CheckIfGroupExists = function(event) {
        var group = "EVENT-" + event.city.trim().toUpperCase().replace(/ /g, "-") + "-" + event.itemtype.trim().toUpperCase().replace(/ /g, "-");

        var sendURL =
            BASEURL + "/getgroupbyname?group=" + group;

        $http({
            method: "GET",
            url: encodeURI(sendURL)
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.loginResult = "Success";
                if (response && response.data && response.data.entities && response.data.entities.length > 0) {
                    $scope.loginResult = "Success";
                    console.log("CheckIfGroupExists: Groups exists for event " + group);
                    $scope.spinner = false;
                    // Connect event uuid with group name
                    $scope.CreateEvent(event, response.data.entities[0].uuid, group);
                } else {
                    console.log("CheckIfGroupExists: Group does not exists: " + group);
                    $scope.spinner = false;
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.loginResult = "Error Received from Server.." + error.toString();
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.spinner = false;
                $scope.status = error.statusText;
            }
        );
    };

    $scope.AnalyseTone = function(text) {
        //  alert($scope.address);
        $scope.resultsready = false;
        $scope.loading = true;
        $http({
            method: "GET",
            url: encodeURI("https://toneanalysis-sujoy.mybluemix.net/analysetone?text=" + text)
        }).then(function mySucces(response) {
            $scope.response = $rootScope.toneResponse;

            for (i = 0; i < response.data.document_tone.tone_categories[0].tones.length; i++) {
                console.log("Tone Name=" + response.data.document_tone.tone_categories[0].tones[i].tone_name);
                console.log("Tone Score=" + response.data.document_tone.tone_categories[0].tones[i].score);
            }
            $scope.loading = false;
            $scope.resultsready = true;
        }, function myError(response) {
            $scope.response = response;
            $scope.loading = false;
        });
    };

    $scope.AnalysePersonality = function(text) {
        $scope.loading = true;
        console.log("Analysing personality text: " + text);
        if (!text || text.length < 100) {
            $scope.LOL = true;
        }
        $http({
            method: "GET",
            url: "https://personality-analyser-sujoy.mybluemix.net/personality?text=" + text
        }).then(function mySucces(response) {
            //console.log(JSON.stringify(response));
            $scope.response = response;
            $scope.resultsReady = true;
            $scope.LOL = false;
            $scope.loading = false;
            $scope.firsttime = true;
            if (response.data.hasOwnProperty('error')) {
                $scope.errorMsg = response.data.error;
                $scope.LOL = true;
                console.log($scope.errorMsg);
            }
        }, function myError(response) {
            $scope.response = response;
            $scope.loading = false;
        });
    };

    $scope.initApp = function() {
        console.log("##### InitApp called");
        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());

        var uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    if (!DataService.isValidObject(authResult) || DataService.isValidObject(authResult.user)) {
                        console.log("####Problem logging in....");
                        return;
                    }
                    var user = authResult.user;
                    // User successfully signed in.
                    // Return type determines whether we continue the redirect automatically
                    // or whether we leave that to developer to handle.
                    //console.log("####AuthResult=" + JSON.stringify(authResult));
                    console.log("##### signInSuccessWithAuthResult success!!" + JSON.stringify(user));
                    // User is signed in.
                    var displayName = user.displayName;
                    var email = user.email;
                    var emailVerified = user.emailVerified;
                    var photoURL = user.photoURL;
                    var uid = user.uid;
                    var phoneNumber = user.phoneNumber;
                    var providerData = user.providerData;
                    var thisUser = {
                        "fullname": user.displayName,
                        "email": user.email,
                        "phone": user.phoneNumber,
                        "photoURL": user.photoURL,
                        "emailVerified": user.emailVerified,
                        "providerData": user.providerData
                    }
                    console.log("##### logged in user found");
                    UserService.setLoggedIn(thisUser);
                    $rootScope.loggedIn = true;
                    $rootScope.login_email = user.email;
                    //$scope.GetUserByEmail(user.email, 'login');
                    UserService.setLoggedInStatus(true);
                    $rootScope.username = user.displayName;
                    $rootScope.login_email = user.email;
                    $rootScope.$emit("CallSetupWebsocketsMethod", null);
                    $rootScope.$emit("alive", {});
                    $rootScope.$emit("CallStartTimerMethod", null);
                    $location.path('/home');
                    return true;
                },
                uiShown: function() {
                    // The widget is rendered.
                    // Hide the loader.
                    document.getElementById('loader').style.display = 'none';
                }
            },
            // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
            //signInFlow: 'popup',
            signInSuccessUrl: GUIURL + '/#home',
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                //                firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
                //               firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            tosUrl: GUIURL + '/#tos'
        };

        ui.start('#firebaseui-auth-container', uiConfig);

        /*
                firebase.auth().onAuthStateChanged(function(user) {
                        thisUser = user;
                        if (user) {
                            console.log("##### onAuthStateChanged called with valid user");
                            // User is signed in.
                            var displayName = user.displayName;
                            var email = user.email;
                            var emailVerified = user.emailVerified;
                            var photoURL = user.photoURL;
                            var uid = user.uid;
                            var phoneNumber = user.phoneNumber;
                            var providerData = user.providerData;
                            var thisUser = {
                                "fullname": user.displayName,
                                "email": user.email,
                                "phone": user.phoneNumber,
                                "photoURL": user.photoURL,
                                "emailVerified": user.emailVerified,
                                "providerData": user.providerData
                            }
                            console.log("##### logged in user found");
                            UserService.setLoggedIn(thisUser);
                            $rootScope.loggedIn = true;
                            $rootScope.login_email = user.email;
                            //$scope.GetUserByEmail(user.email, 'login');
                            UserService.setLoggedInStatus(true);
                            $rootScope.username = user.displayName;
                            $rootScope.login_email = user.email;
                            $location.path('/home');
                            //user.getIdToken().then(function(accessToken) {
                            //document.getElementById('sign-in-status').textContent = 'Welcome ' + displayName;
                            //});
                            $rootScope.$emit("CallSetupWebsocketsMethod", null);
                            $rootScope.$emit("alive", {});
                            $rootScope.$emit("CallStartTimerMethod", null);
                            //$rootScope.$emit("CallGetOnlineUsersMethod", {});
                            //$rootScope.$emit("NewLogin", {});
                        } else {
                            // User is signed out.
                            //document.getElementById('sign-in-status').textContent = 'Signed out';
                            //document.getElementById('sign-in').textContent = 'Sign in';
                            //document.getElementById('account-details').textContent = 'null';
                            //var ui = new firebaseui.auth.AuthUI(firebase.auth());
                            // The start method will wait until the DOM is loaded.
                            //ui.start('#firebaseui-auth-container', uiConfig);
                            //ui.disableAutoSignIn();
                            console.log("##### onAuthStateChanged called with invalid user");
                            ui.start('#firebaseui-auth-container', uiConfig);
                            console.log("##### Prompting user login as no logged in user found");
                            $rootScope.loggedIn = false;
                        }
                    },
                    function(error) {
                        console.log(error);
                    });*/
    }
    $scope.gotoBottom = function() {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('bottom');

        // call $anchorScroll()
        $anchorScroll();
    };

    $scope.GetChatsByEmail = function(email) {
        if (!email) {
            Notification.error({ message: "Could not retrieve chats, please try again.", positionY: 'bottom', positionX: 'center' });
            $scope.found = "ERROR - Email NOT FOUND";
            return;
        }
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/getchatsbyemail?email=" + email.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                if (!DataService.isValidObject(response) || !DataService.isValidArray(response.data)) {
                    console.log("#####No Chats Found!");

                } else {
                    var data = response.data;
                    $scope.errorMsg = "";
                    var userTexts = [];
                    for (i = 0; i < data.length; i++) {
                        userTexts.push(data[i].from.text);
                    }
                    console.log("####Raw User Texts = " + JSON.stringify(userTexts));
                    $rootScope.personalitytext = JSON.stringify(userTexts).replace(/["']/g, "").replace(/[\[\]]/g, "");

                    if ($rootScope.personalitytext && $rootScope.personalitytext.trim().split(' ').length < 100) {
                        Notification.error({ message: "Not enough words in user chat for analysis. Please try later!", positionY: 'bottom', positionX: 'center' });
                        $scope.errorMsg = "Not enough words in user chat for analysis. Please try later!";
                        console.log("####Chat data received for " + email + " is:  " + $rootScope.personalitytext);
                        //return;
                    }
                    $scope.showChat = false;
                    $scope.showPersonality = true;
                    $location.path('/personality');
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.showChat = true;
                $scope.showPersonality = false;
            }
        );
    };
    $scope.GetPersonality = function(user) {
        if (!user)
            user = $rootScope.targetChatuser;
        $scope.showChat = false;
        $scope.spinner = true;
        $scope.GetChatsByEmail(user.email);
    }
    $scope.setupWebSockets = function(email, arg) {
        //console.log("#####Setting up listener for alerts");
        socket = io.connect(BASEURL);
        var targetUser = {
            fullname: $rootScope.targetChatuserName,
            email: email
        }
        var d = new Date();
        var loggedinUser = {
            fullname: UserService.getLoggedIn().fullname,
            email: UserService.getLoggedIn().email,
            photoURL: UserService.getLoggedIn().photoURL,
            lastHeartBeat: d
        }
        socket.on('connect', function() {
            //console.log("#### Joining events channel " + loggedinUser.email);
            socket.emit('room', loggedinUser);
        });
        if (arg && arg === "send") {
            var chatObj = {
                from: $rootScope.chatText,
                //target: JSON.parse($rootScope.targetChatuser),
                //target: $rootScope.targetChatuser,
                timestamp: d.getTime()
            };
            console.log("#### Sending chat event to  " + JSON.stringify(chatObj));
            //socket.emit('join', chatObj);
            socket.emit('sendchat', chatObj);
        } else if (arg && arg === "leave") {
            console.log("#### Leaving room " + email);
            socket.emit('leave', email);
        } else if (arg && arg === "logout") {
            console.log("#### Logging out " + email);
            socket.emit('logout', email);
        } else if (arg && arg === "alive") {
            socket.emit('alive', loggedinUser);
        }

        socket.on('activeuserschanged', function(data) {

            var b = {
                email: 'abcd@yahoo.com',
                fullname: 'ABCD',
                photoURL: null,
                lastHeartBeat: new Date()
            };
            var activeUsers = JSON.parse(data);
            if (lastHeartBeat === activeUsers.timestamp) {
                //console.log("Discarding duplicate activeuserschanged events");
                return;
            } else {
                lastHeartBeat = activeUsers.timestamp;
                $rootScope.onlineUsers = activeUsers.users;
                for (i = 0; i < $rootScope.onlineUsers.length; i++) {
                    var a = $rootScope.onlineUsers[i];
                    if (!DataService.isValidObject(a.photoURL) || a.photoURL == null || a.photoURL == "") {
                        $rootScope.onlineUsers[i].nophoto = true;
                    } else {
                        $rootScope.onlineUsers[i].nophoto = false;
                    }
                }
                //$scope.users.push(b);
                //console.log("#### activeuserschanged - current online users are" + JSON.stringify($scope.users));
                $scope.$apply();
            }

        });
        socket.onclose = function(evt) {
            console.log("##### Received socket onlcose event: " + JSON.stringify(evt));
            //$scope.setupWebSockets('init', null);
        };
        socket.on('chateventforall', function(data) {
            console.log("####received chat event for all: " + JSON.stringify(data));
            if (!DataService.isValidObject(data)) {
                console.log("#####received matching event but no data!");
                return;
            }
            console.log("#### Checking for email same as loggedInUser email");
            if (data.from.email === UserService.getLoggedIn().email) {
                //console.log("#####received matching event but no data!");
                console.log("#### email same as loggedInUser email");
                return;
            }
            console.log("#### Checking for same timestamp");
            if ($rootScope.lastUUID === data.timestamp) {
                console.log("#####Discarding duplicate events");
                return;
            } else {
                var msg = {
                    sentby: data.from.sentby,
                    email: data.from.email,
                    text: data.from.text,
                    time: data.from.time,
                    "css": {
                        'background-color': "greenyellow",
                        'border': "1px solid red",
                        'width': "70%"
                    },
                    align: "right"
                };
                console.log("#####received chat event created by someone else! " + JSON.stringify(msg));
                $rootScope.chatArray.push(msg);
                $rootScope.secondPersonTextArray.push(msg.text);
                //$rootScope.targetChatuser.fullname = JSON.stringify(data.from.sentby).replace(/\"$/, "").replace(/\"/, "");
                //$rootScope.targetChatuser.email = JSON.stringify(data.target.email).replace(/\"$/, "").replace(/\"/, "");
                $rootScope.targetChatuser = {
                        fullname: data.from.sentby,
                        email: data.from.email,
                        photoURL: null,
                        lastHeartBeat: new Date()
                    }
                    //$rootScope.targetChatuser = JSON.stringify(t);
                    //$rootScope.targetChatuser.email = data.from.email;
                    //console.log("######Current Target USer = " + JSON.stringify($rootScope.targetChatuser));
                console.log("#####Set new target user as: " + JSON.stringify($rootScope.targetChatuser));
                $scope.showChat = true;
                $scope.gotoBottom();
                $scope.$apply();
                //$scope.HandleEvent("Chat Message", msg);
                $rootScope.lastUUID = data.timestamp;
            }

        });
    }
    $scope.HandleEvent = function(title, text) {
        /*cordova.plugins.notification.local.schedule({
            title: title,
            text: text,
            foreground: true
        });*/
        console.log("####Handling matching event..." + JSON.stringify(text));
        if (!text || text.length < 1) {
            console.log("No substantial text for notification..aborting");
            return;
        }
        Notification.info({
            //message: text.replace(/\"$/, "").replace(/\"/, ""),
            message: text.text,
            title: title,
            positionY: 'top',
            positionX: 'center',
            delay: 4000,
            replaceMessage: true
        });
        /*var r = confirm(text.sentby + " wants to chat with you. Do you want to chat now?");
        if (r == true) {
            $location.path("/chat");
        } else {
            // 
        }*/
    }
    $scope.HandleLogout = function() {
        $rootScope.loggedIn = false;
        $rootScope.$emit("Logout", {});
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log("#### Successful Logout");
            location.reload();
        }).catch(function(error) {
            // An error happened.
            console.log("#### UnSuccessful Logout");
        });
    }
    $scope.CreateNeed = function(need, emergency) {
        $scope.loginResult = "";
        var now = new Date();
        $scope.loginResult = "Request Sent";
        var postURL = BASEURL + "/createneed";
        var reqObj = {
            email: $scope.login_email,
            postedby: $scope.login_fullname,
            time: now,
            phone_number: need.phone,
            address: need.address,
            city: need.city,
            items: need.items,
            itemtype: need.itemtype,
            location: {
                latitude: $scope.lat,
                longitude: $scope.lng
            },
            fa_icon: $scope.GetFontAwesomeIconsForCategory(need.itemtype),
            emergency: emergency
        };
        postURL = encodeURI(postURL);
        $http.post(postURL, JSON.stringify(reqObj)).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.loginResult = "Success";
                Notification.success({ message: "Successufully Published. Thank You!", title: "Good job!", positionY: 'bottom', positionX: 'center', delay: 4000 });
                $scope.spinner = false;
                $scope.status = response.statusText;
                /*              notifyUsersInGroup(
                                          "FROM-" +
                                          offer.city.trim().toUpperCase() +
                                          "-" +
                                          offer.from.trim().toUpperCase(),
                                          offer.from,
                                          filteredtime,
                                          offer.name,
                                          offer.phone
                                      );*/
                //      alert("Offer " + response.statusText);
                //   var MS_PER_MINUTE = 60000;
                //   var myStartDate = new Date(offerDate.valueOf() - 15 * MS_PER_MINUTE);
                //send notification to creator 15 min b4 deal starts
                //               schedulePush(new Date());
                if (emergency && response) {
                    $scope.CheckIfGroupExists(need);
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.loginResult = "A problem occurred processing the request. Please try again later.";
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.spinner = false;
                $scope.status = "A problem occurred processing the request. Please try again later.";
            }
        );
    };
    $scope.Redirect = function(url) {
        $location.path(url);
    }

    function schedulePush(time) {
        window.plugin.notification.local.add({
            date: time,
            message: "Your deal offer is in 15min. Please start."
        });
    }
    $scope.OpenPersonalityPage = function() {
        $rootScope.personalitytext = $rootScope.secondPersonTextArray.toString();
        console.log("Second Person Text Is: " + $rootScope.personalitytext);
        $location.path('/personality');
    }
    $scope.SendPush = function(gcmids, text) {
        if (!gcmids || !text) return;
        if (text.length === 0) {
            console.log("No text for push message. ");
            return;
        }
        $scope.spinner = true;

        var notifyURL =
            BASEURL + "/sendpush/devicespush?regids=" +
            gcmids +
            "&text=" +
            text;
        console.log("SendPush: notifyURL=" + notifyURL);
        $http({
            method: "GET",
            url: encodeURI(notifyURL)
        }).then(
            function successCallback(response) {
                $scope.spinner = false;

                //   $scope.result = "Successfully Sent Push Messages to Subscribed Users for these locations.";
            },
            function errorCallback(error) {
                $scope.spinner = false;
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                //          $scope.result = "Could not send push messages. ";
            }
        );
    };
    $scope.CreateEvent = function(event, group_uuid, group_name) {
        $scope.loginResult = "";
        var now = new Date();
        var postURL = BASEURL + "/createevent";
        var reqObj = {
            email: $scope.login_email,
            postedby: $scope.login_fullname,
            time: now,
            phone_number: event.phone,
            address: event.address,
            city: event.city,
            items: event.items,
            itemtype: event.itemtype,
            latitude: $scope.lat,
            longitude: $scope.lng,
            fa_icon: $scope.GetFontAwesomeIconsForCategory(event.itemtype),
            group_uuid: group_uuid,
            group_name: group_name
        };
        postURL = encodeURI(postURL);
        console.log("#######CreateEvent URL=" + postURL);
        $http.post(postURL, JSON.stringify(reqObj))
            .then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.loginResult = "Success";
                    $scope.spinner = false;
                    $scope.status = response.statusText;
                    // Connect event uuid with group name
                    //$scope.ConnectEntities(group, response.data._data.uuid);
                },
                function errorCallback(error) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.loginResult = "Error Received from Server.." + error.toString();
                    Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                    $scope.spinner = false;
                    $scope.status = error.statusText;
                }
            );
    };
    $scope.ConnectEntities = function(uuid1, uuid2) {
        if (!uuid1 || !uuid2) {
            console.log("ConnectEntities - Invalid Parameters");
            return;
        }
        var getURL =
            BASEURL + "/connectentities?uuid1=" + uuid1 + "&uuid2=" + uuid2;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("Successful Connection of Entities");
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("Failed to connect entities");
            }
        );
    };
    var notifyUsersInGroup = function(group, from, time, by, phone) {
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/getusersingroup?group=" + group;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                var users = [];
                var gcmids = "";
                users = response.data;
                for (var i = 0; i < users.length; i++) {
                    if (!checkIfPushAllowedNow(users[i].settings)) continue;
                    var gcms = [];
                    gcms = users[i].gcm_ids;
                    for (var j = 0; j < gcms.length; j++) {
                        //   gcmids.push(gcms[j]);
                        gcmids += gcms[j] + "^";
                    }
                }

                $scope.SendPush(
                    gcmids,
                    "A new deal created by " +
                    by +
                    "(ph: " +
                    phone +
                    "), pickup at " +
                    time +
                    " from " +
                    from
                );

                // $scope.found  = "Active deal offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                $scope.alldeals = false;
            }
        );
    };

    function checkIfPushAllowedNow(settingsObject) {
        //       console.log("checkIfPushAllowedNow: received input - " + JSON.stringify(settingsObject));
        if (settingsObject === undefined || !settingsObject) return true;

        if (settingsObject.pushon) {
            var start = new Date();
            start.setHours(
                settingsObject.pushstarttimehrs,
                settingsObject.pushstarttimemin
            );
            var stop = new Date();
            stop.setHours(
                settingsObject.pushstoptimehrs,
                settingsObject.pushstoptimemin
            );
            var timenow = new Date();
            if (stop < start) stop.setDate(timenow.getDate() + 1);
            if (stop == start) return true;
            if (timenow < start || timenow > stop) {
                return false;
            } else {
                return true;
            }
        } else return false;
    }
    $scope.SocialShare = function(row, site) {

        if (!DataService.isValidObject(row))
            return;
        var message = row.items;
        var title = '';
        if (!DataService.isUnDefined(row.postedby)) {
            message += ' posted by ' + row.postedby;
            title = "FreeCycle Alert: " + row.itemtype;
        } else if (!DataService.isUnDefined(row.offeredby)) {
            message += ' offered by ' + row.offeredby;
            title = "FreeCycle Alert: " + row.itemtype + " Item Offered";
        }
        message += ' at ' + row.address + '; posted on ' + new Date(row.modified);
        var options = {};
        switch (site) {
            case 'twitter':
                options = {
                    provider: "twitter",
                    attrs: {
                        socialshareText: message
                    }
                }
                break;
            case 'facebook':
                options = {
                    provider: "facebook",
                    attrs: {
                        socialshareQuote: message
                            //socialshareVia: "1942374775794853"
                    }
                }
                break;
            case 'google':
                options = {
                    provider: "google",
                    attrs: {
                        socialshareUrl: 'http://720kb.net'

                    }
                }
                break;
            case 'linkedin':
                options = {
                    provider: "linkedin",
                    attrs: {
                        socialshareText: title,
                        socialshareDescription: message
                    }
                }
                break;
            case 'flipboard':
                options = {
                    provider: "flipboard",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'pocket':
                options = {
                    provider: "pocket",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'tumblr':
                options = {
                    provider: "tumblr",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'pinterest':
                options = {
                    provider: "pinterest",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'stumbleupon':
                options = {
                    provider: "stumbleupon",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
            case 'digg':
                options = {
                    provider: "digg",
                    attrs: {
                        socialshareText: message,
                        socialshareUrl: 'http://720kb.net'
                    }
                }
                break;
        }
        Socialshare.share(options);
    }
    $scope.GetDeals = function(paramname, paramvalue, myoffers) {
        if (!paramvalue || paramvalue.length < 2) {
            alert("Need " + paramname, "Please provide a valid " + paramname, "warning");
            return;
        }
        $scope.spinner = true;
        param_name = paramname.trim();
        var getURL =
            BASEURL + "/getdeals?paramname=" +
            param_name +
            "&paramvalue=" +
            paramvalue.trim();
        getURL = encodeURI(getURL);

        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!DataService.isValidObject(response) || !DataService.isValidArray(response.data)) {

                    if (DataService.isString(response)) {
                        console.log("####Invalid response: " + JSON.stringify(response));
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.spinner = false;
                $scope.citydeals = response.data;

                //Show only newer offers
                var ONE_DAY = 24 * 60 * 60 * 1000; //ms
                var filtereddeals = [];

                if ($scope.citydeals && $scope.citydeals.length > 0) {
                    for (var i = 0; i < $scope.citydeals.length; i++) {
                        var d = new Date();
                        var o = new Date($scope.citydeals[i].modified);
                        if (!myoffers) {
                            if (((d - o) > 7 * ONE_DAY) || $scope.citydeals[i].email === $scope.login_email)
                                continue;
                            else
                                filtereddeals.push($scope.citydeals[i]);
                        } else {
                            filtereddeals.push($scope.citydeals[i]);
                        }
                    }
                    //console.log("Filtered " + ($scope.citydeals.length - filtereddeals.length) + " old records");
                    $scope.citydeals = filtereddeals;
                    $scope.found = "Found " + $scope.citydeals.length + " offers";
                } else {
                    $scope.found = "No Offers Found";
                }
                if ($scope.citydeals.length == 0) {
                    $scope.alldeals = false;
                    return;
                }
                $scope.alldeals = true;
                $scope.cancel = false;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                //      $scope.result = "Could not submit acceptance. " + error;
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.alldeals = false;
            }
        );
    };

    $scope.Subscribe = function(data, user) {
        $scope.spinner = true;
        if (!data || !data.city || !data.itemtype) {
            Notification.error({ message: "Please enter City and Item name for alerts", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
            return;
        }
        console.log("Creating subscription for city " + data.city + "and item type " + data.itemtype);
        $scope.result = "Sending Request....";
        var group = "EVENT-" +
            data.city
            .toString()
            .trim()
            .toUpperCase() +
            "-" +
            data.itemtype
            .toString()
            .trim()
            .toUpperCase();
        var postURL = BASEURL + "/creategroup";
        var reqObj = {
            group: group
        };
        postURL = encodeURI(postURL);
        $http.post(postURL, JSON.stringify(reqObj))
            .then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.spinner = false;
                    var u = $scope.login_email;
                    addUserToGroup(group, u);
                    //$scope.found  = "Active deal offers for " + param_name;
                },
                function errorCallback(error) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.spinner = false;
                    $scope.found = "Could not process this request. Please try again later!";
                    console.log("#####Subscribe error: " + JSON.stringify(error));
                    Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                    $scope.alldeals = false;
                }
            );
    };

    var addUserToGroup = function(group, user) {
        $scope.spinner = true;
        //first create group with id=<city>-<place>

        var getURL =
            BASEURL + "/addusertogroup?group=" + group + "&user=" + user;
        getURL = encodeURI(getURL);
        console.log("Adding User to Group: " + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                console.log("SUCCESS ADDING SUBSCRIPTION TO GROUP " + group);
                $scope.result = "SUCCESS ADDING SUBSCRIPTION. YOU WILL NOW RECEIVE NOTIFICTAIONS FOR OFFERS OR NEEDS MATCHING THIS CRITERIA ";
                Notification.success({ message: "SUCCESS ADDING SUBSCRIPTION. YOU WILL NOW RECEIVE NOTIFICTAIONS FOR OFFERS OR NEEDS MATCHING THIS CRITERIA.", title: "Success!", positionY: 'bottom', positionX: 'center', delay: 4000 });
                $rootScope.$emit("CallGetGroupsForUserMethod", {});
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "ERROR ADDING SUBSCRIPTION TO THIS EVENT";
                Notification.error({ message: "ERROR ADDING SUBSCRIPTION TO THIS EVENT.", title: "Error!", positionY: 'bottom', positionX: 'center', delay: 4000 });
                $scope.alldeals = false;
            }
        );
    };

    var getUsersInGroup = function(group) {
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/getusersingroup?group=" + group;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $scope.groupusers = response;
                // $scope.found  = "Active deal offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                $scope.alldeals = false;
            }
        );
    };
    $scope.GetAllUsers = function() {
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/allusers";
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $rootScope.allusers = response.data;
                if (DataService.isValidArray($rootScope.allusers)) {
                    $rootScope.allusers.splice($rootScope.allusers.length - 1, 1);
                }
                //console.log("####All Users: " + JSON.stringify($rootScope.allusers));
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                $scope.alldeals = false;
            }
        );
    };
    $scope.GetEventsForUser = function(executeInBg) {

        if (!executeInBg) {
            $scope.spinner = true;
            $scope.showevents = false;
        } else {
            $scope.spinner = false;
        }
        var uuid = UserService.getLoggedIn().uuid;
        var getURL = BASEURL + "/geteventsforuser?uuid=" + uuid;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!executeInBg) {
                    $scope.spinner = false;
                    $scope.showevents = true;
                }
                //               console.log("GetEventsForUser Response= " + JSON.stringify(response));
                if (response && response.data && response.data === "No Groups Found") {
                    console.log("No Groups Found");
                    $scope.events = [];
                    $scope.eventsCount = 0;
                    $scope.found = "You are not subscribed for notifications. Please select an event first from subscription menu.";
                    $scope.showevents = false;
                    return;
                }
                //console.log("Events Count= " + response.data.length);
                $scope.events = response.data;

                //Show only newer events
                var ONE_DAY = 24 * 60 * 60 * 1000; //ms
                var filteredEvents = [];
                if ($scope.events && $scope.events.length > 0) {
                    for (var i = 0; i < $scope.events.length; i++) {
                        var d = new Date();
                        var o = new Date($scope.events[i].modified);
                        if ((d - o) > 4 * ONE_DAY) //events for only last 4 days
                            continue;
                        else if ($scope.events[i].email === UserService.getLoggedIn().email) //self posted event
                            continue;
                        else
                            filteredEvents.push($scope.events[i]);
                    }
                    //console.log("Filtered " + ($scope.events.length - filteredEvents.length) + " old records");
                    $scope.events = filteredEvents;
                    //$scope.resultEvents = "Found " + $scope.events.length + " events matching your criteria.";
                    $scope.found = $scope.events.length + " events";
                } else {
                    $scope.found = "No Notifications Found";
                    $scope.showevents = false;
                }
                $scope.eventsCount = $scope.events.length;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                $scope.showevents = false;
                $scope.found = "Problem fetching notifications. Please try again later.";
            }
        );
    };

    $scope.GetEventsForGroup = function(uuid) {
        if (!uuid) {
            console.log("Invalid UUID");
            return;
        }
        console.log("Inside GetEventsForGroup");
        var getURL = BASEURL + "/getconnectionsforgroup?uuid=" + uuid;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!DataService.isValidObject(response) || !DataService.isValidObject(response.data) ||
                    !DataService.isValidArray(response.data.entities)) {

                    if (DataService.isString(response)) {
                        console.log("####Invalid response: " + JSON.stringify(response));
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.showevents = true;
                var aevent = {};
                if (response.data.entities && response.data.entities.length > 0) {
                    for (var i = 0; i < response.data.entities.length; i++) {
                        aevent = response.data.entities[i];
                        if ($scope.login_email === aevent.email)
                            continue;
                        else {
                            $scope.events.push(aevent);
                            $scope.eventsCount++;
                        }
                    }
                }

                // $scope.found  = "Active deal offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log("Error getting events for group: " + uuid);
            }
        );
    };
    $scope.GetGroupsForUser = function() {
        $scope.spinner = true;
        $scope.showmyevents = false;
        //first create group with id=<city>-<place>
        var uuid = UserService.getLoggedIn().uuid;

        var getURL = BASEURL + "/getgroupsforuser?uuid=" + uuid;
        getURL = encodeURI(getURL);
        console.log("####GetGroupsForUser URL=" + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (!DataService.isValidObject(response) || !DataService.isValidArray(response.data)) {

                    if (DataService.isString(response)) {
                        console.log("####Invalid response: " + JSON.stringify(response));
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'top', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        console.log("####Invalid response - null or undefined");
                        Notification.error({ message: "A problem occured!", title: "Error", positionY: 'top', positionX: 'center', delay: 4000 });
                        return;
                    }

                } else {
                    console.log("Awesome, a valid response!");
                }
                $scope.spinner = false;
                $scope.showmyevents = true;
                console.log("GetGroupsForUser success");
                $scope.usergroups = response.data;
                $rootScope.$emit("CallGetEventsMethod", {});
                $scope.setupWebSockets("init", null);
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                $scope.alldeals = false;
            }
        );
    };
    $scope.DeleteGroupForUser = function(group) {
        if (!group || group.length < 2) {
            console.log("####Invalid Group Name Received in DeleteGroupForUser");
            return;
        }
        $scope.spinner = true;
        $scope.showmyevents = false;
        //first create group with id=<city>-<place>
        var uuid = UserService.getLoggedIn().uuid;

        var getURL = BASEURL + "/deletegroupforuser?uuid=" + uuid + "&group=" + group;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $scope.showmyevents = true;
                Notification.success({ message: "Successfully removed this subscription!", positionY: 'bottom', positionX: 'center' });
                $scope.result = "Successfully removed this subscription!";
                $scope.setupWebSockets("leave", group);
                $rootScope.$emit("CallGetGroupsForUserMethod", {});
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.groupusers = "ERROR GETTING GROUP USERS ";
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                $scope.alldeals = false;
            }
        );
    };

    function SendPushToUserByEmail(email, text) {
        $scope.spinner = true;
        var getURL = BASEURL + "/getuser?email=" + email.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                $scope.spinner = false;
                if (
                    angular.isObject(response) &&
                    response.data.toString() === "User Not Found"
                ) {
                    $scope.found = "Id Not Found";
                } else {
                    var obj = response.data[0];
                    if (!checkIfPushAllowedNow(obj.settings)) {
                        console.log(
                            "SendPushToUser: Prevented push as filtered by settings opitions. " +
                            ":" +
                            JSON.stringify(response.data.settings)
                        );
                        return;
                    } else {
                        console.log(
                            "SendPushToUser: Sending Push as filtered by settings opitions. " +
                            ":" +
                            JSON.stringify(response.data.settings)
                        );
                        SendPushToUser(obj.uuid, text);
                    }

                    return;
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //      $scope.loginResult = "Could not submit login request.." + error;
                $scope.spinner = false;
                //      $scope.login_email = '';
            }
        );
    }
    $scope.GetUserFromEmail = function(email) {
        if (!email) {
            Notification.error({ message: "Email Not Found!", positionY: 'bottom', positionX: 'center' });
            $scope.found = "ERROR - Email NOT FOUND";
            return;
        }
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/getuser?email=" + email.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                if (!DataService.isUnDefined(response.data) && DataService.isValidArray(response.data) &&
                    response.data.length > 0) {
                    console.log("#### GetUserFromEmail Response: " + JSON.stringify(response.data));
                    $rootScope.targetChatuserName = response.data[0].fullname;
                    return response.data[0];
                }

            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.passengers = "ERROR GETTING PASSENGERS ";
            }
        );
    };
    $scope.NotifyDonor = function(email, text) {
        if (!email) {
            Notification.error({ message: "Email Not Found!", positionY: 'bottom', positionX: 'center' });
            $scope.found = "ERROR - Email NOT FOUND";
            return;
        }
        $scope.spinner = true;
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/getuser?email=" + email.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                var passengers = [];
                passengers = response.data;
                for (var i = 0; i < passengers.length; i++) {
                    var auuid = "";
                    auuid = passengers[i].uuid;
                    SendPushToUser(auuid, text);
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.passengers = "ERROR GETTING PASSENGERS ";
            }
        );
    };

    function SendPushToUser(uuid, text) {
        //       alert("Sending Push TO User With UUID=" + uuid);
        //        return;
        $scope.spinner = true;
        if (!uuid) {
            $scope.found = "ERROR";
            console.log("SendPushToUser(uuid, text): No UUID received");
            return;
        }
        console.log(
            "Attempting to send push to uuid: " + uuid + " with text: " + text
        );
        //first create group with id=<city>-<place>
        var getURL = BASEURL + "/getuserbyuuid?uuid=" + uuid.trim();
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;

                if (!checkIfPushAllowedNow(response.data.settings)) {
                    console.log(
                        "SendPushToUser: Prevented push as filtered by settings opitions. " +
                        uuid +
                        ":" +
                        JSON.stringify(response.data.settings)
                    );
                    return;
                } else {
                    console.log(
                        "SendPushToUser: Sending Push as filtered by settings opitions. " +
                        uuid +
                        ":" +
                        JSON.stringify(response.data.settings)
                    );
                }

                var gcmidarray = [];
                gcmidarray = response.data.gcm_ids;
                console.log("SendPush GCMIDs=" + JSON.stringify(gcmidarray));
                var gcmids = "";
                if (gcmidarray && gcmidarray.length > 0) {
                    for (var i = 0; i < gcmidarray.length; i++) {
                        gcmids += gcmidarray[i] + "^";
                    }
                    $scope.SendPush(gcmids, text);
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
            }
        );
    }
    $scope.SendSettings = function(settings) {
        $scope.result = "";
        $scope.spinner = true;
        var starttimehrs = new Date(settings.fromtime).getHours();
        var starttimemin = new Date(settings.fromtime).getMinutes();
        var stoptimehrs = new Date(settings.totime).getHours();
        var stoptimemin = new Date(settings.totime).getMinutes();

        $scope.spinner = true;
        var getURL =
            BASEURL + "/updateusersettings?uuid=" +
            $scope.uuid +
            "&starttimehrs=" +
            starttimehrs +
            "&starttimemin=" +
            starttimemin +
            "&stoptimehrs=" +
            stoptimehrs +
            "&stoptimemin=" +
            stoptimemin +
            "&pushon=" +
            settings.pushon;
        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                $scope.result = "SUCCESS SAVING YOUR SETTINGS ";
                // $scope.found  = "Active deal offers for " + param_name;
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.result = "ERROR ADDING SUBSCRIPTION TO PUSH MESSAGES ";
                $scope.alldeals = false;
            }
        );
    };

    $scope.ContactUs = function(query) {
        $scope.spinner = true;
        var getURL =
            /*BASEURL + "/contactus?email=" +
            query.email.trim() +
            "&fullname=" +
            query.name.trim() +
            "&phone=" +
            query.phone.trim() + "&city=" +
            query.city.trim() + "&subject=" +
            query.subject.trim() + "&text=" +
            query.text.trim();*/
            BASEURL + "/contactus";
        getURL = encodeURI(getURL);
        var reqObj = {
            email: query.email.trim(),
            fullname: query.name.trim(),
            phone: query.phone.trim(),
            city: query.city.trim(),
            subject: query.subject.trim(),
            text: query.text.trim()
        };
        console.log("ContactUs URL=" + getURL);
        $http.post(getURL, JSON.stringify(reqObj))
            .then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.spinner = false;
                    if (
                        angular.isObject(response) &&
                        response.data.toString() === "QUERY CREATED"
                    ) {
                        Notification.success({ message: "Thank You! Your query has been sent. We will get back to you as soon as possible.", positionY: 'bottom', positionX: 'center' });
                        $scope.result = "Thank You! Your query has been sent. We will get back to you as soon as possible.";
                        return;
                    } else {
                        $scope.result = "Error sending mail. Please try again later.";
                        Notification.error({ message: "Could not create user id, might be existing!", positionY: 'bottom', positionX: 'center' });
                        return;
                    }
                },
                function errorCallback(error) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.spinner = false;
                    $scope.result = "Error submitting  request. Please try again later.";
                    Notification.error({ message: "Could not create user id, might be existing!", positionY: 'bottom', positionX: 'center' });
                }
            );
    };
    $scope.spinner = false;
    $scope.isCollapsed = true;
    $rootScope.mobileDevice = false;

    $scope.isVisible = function() {
        //return ("/login" !== $location.path() && "/signup" !== $location.path() && "/resetpw" !== $location.path());
        return true;
    };

    $scope.Login = function(login) {
        $scope.spinner = true;
        var getURL = BASEURL + "/loginuser?email=" + login.email.trim() + "&pw=" + login.password.trim();

        getURL = encodeURI(getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                //      $scope.loginResult = response.data;
                $scope.spinner = false;

                if (
                    angular.isObject(response) &&
                    response.data.toString() === "User Not Found"
                ) {
                    $scope.loginResult = "Id Not Found";

                    if (
                        confirm(
                            "Email ID not found in App database. Would you like to create an account with this id?"
                        ) == true
                    ) {
                        $location.path("/signup");
                        return;
                    }
                } else {
                    //        alert("Id Found");
                    if (angular.isObject(response) &&
                        response.data.toString() === "Authentication Error") {
                        Notification.error({ message: "Invalid Password!", title: "Error", positionY: 'bottom', positionX: 'center', delay: 4000 });
                        return;
                    } else {
                        var obj = response.data[0];
                        UserService.setLoggedIn(obj);
                        UserService.setLoggedInStatus(true);
                        $scope.loginResult = obj.username;
                        $scope.login_fullname = obj.fullname;
                        $scope.login_email = obj.email;
                        $scope.login_phone = obj.phone;
                        $rootScope.username = obj.fullname;
                        $rootScope.loggedIn = true;
                        //$rootScope.$emit("CallGetGroupsForUserMethod", {});
                        $rootScope.$emit("CallSetupWebsocketsMethod", {});
                        //$rootScope.$emit("CallGetOnlineUsersMethod", {});
                        //$rootScope.$emit("CallStartTimerMethod", {});
                        $rootScope.$emit("NewLogin", {});
                        //$location.path($rootScope.savedLocation);

                        $location.path("/home");
                        return;
                    }
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //      $scope.loginResult = "Could not submit login request.." + error;
                $scope.spinner = false;

                $scope.loginResult = "Could not submit request..";
                //      $scope.login_email = '';
            }
        );
    };
    $scope.login_fullname = UserService.getLoggedIn().fullname;
    $scope.login_email = UserService.getLoggedIn().email;
    //    $scope.login_phone = UserService.getLoggedIn().phone;
    //    $scope.login_address = UserService.getLoggedIn().address;
    $scope.CreateUser = function(user) {
        $scope.spinner = true;
        var postURL = BASEURL + "/createuserwithoauth";
        console.log("CreateUer Object=" + user);
        $http.post(postURL, user)
            .then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.spinner = false;
                    if (
                        angular.isObject(response) &&
                        response.data.toString() === "CREATED"
                    ) {
                        Notification.success({ message: "Account Created with id " + user.email, positionY: 'bottom', positionX: 'center' });
                        $location.path("/login");
                        return;
                    } else {
                        $scope.result = "Error creating id. Email already in use.";
                        Notification.error({ message: "Could not create user id, might be existing!", positionY: 'bottom', positionX: 'center' });
                        //        $location.path("/login");
                        return;
                    }
                },
                function errorCallback(error) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.spinner = false;
                    $scope.loginResult = "Could not submit request.." + error;
                    Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
                }
            );
    };
    $scope.UpdateUser = function(user) {

        if ($scope.login_email && (!user || (!user.phone && !user.address))) {
            Notification.error({ message: "Please enter values to update", positionY: 'bottom', positionX: 'center' });
            $scope.spinner = false;
            return;
        } else if (!$scope.login_email && (!user || !user.email || !user.password)) {
            Notification.error({ message: "Please Enter Email and Password", positionY: 'bottom', positionX: 'center' });
            return;
        }
        $scope.spinner = true;
        var email = '';
        if ($scope.login_email)
            email = $scope.login_email;
        else
            email = user.email;
        var getURL =
            BASEURL + "/updateuser?name=" + email;
        /*if (user && user.phone)
            getURL += "&phone=" + user.phone.trim();
        else
            getURL += "&phone=" + UserService.getLoggedIn().phone;
        if (user && user.address)
            getURL += "&address=" + user.address.trim();
        else
            getURL += "&address=" + UserService.getLoggedIn().address;*/
        if (user && user.password)
            getURL += "&password=" + user.password.trim();
        getURL = encodeURI(getURL);
        console.log("Update URL=" + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                if (
                    angular.isObject(response)
                ) {
                    console.log("UpdateUSer response: " + JSON.stringify(response));

                    if (!$scope.login_email) {
                        Notification.success({ message: "Password Update Successful!", positionY: 'top', positionX: 'center', delay: 4000 });
                        $scope.result = "Password Update Sucessful.";
                        $location.path("/login");
                        return;
                    } else {
                        Notification.success({ message: "Successfully updated your info!", positionY: 'top', positionX: 'center', delay: 4000 });
                        $scope.result = "Account Update Sucessful.";
                        if (DataService.isValidObject(response) &&
                            DataService.isValidObject(response.data) &&
                            DataService.isValidObject(response.data._data)) {
                            UserService.setLoggedIn(response.data._data);
                        }
                        return;
                    }
                } else {
                    $scope.result = "Could not update profile";
                    Notification.error({ message: "Could not update profile!", positionY: 'top', positionX: 'center', delay: 4000 });
                    //        $location.path("/login");
                    return;
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.loginResult = "Could not submit request.." + error;
            }
        );
    }
    $scope.SendResetPasswordRequest = function(email) {
        if (!email || email.length < 4) {
            Notification.info({ message: "Please enter valid email!", positionY: 'top', positionX: 'center', delay: 4000 });
            return;
        }
        var getURL =
            BASEURL + "/sendresetpwmail?email=" +
            email.trim();
        getURL = encodeURI(getURL);
        console.log("Create URL=" + getURL);
        $http({
            method: "GET",
            url: getURL
        }).then(
            function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.spinner = false;
                console.log("SendResetPasswordRequest response: " + JSON.stringify(response));
                if (DataService.isValidObject(response) && (response.data) && response.data == "Email Not Found") {
                    Notification.error({ message: "Error processing this request. Please check the email address!", positionY: 'bottom', positionX: 'center' });
                } else {
                    Notification.success({ message: "An email has been sent with the password reset link.", positionY: 'bottom', positionX: 'center' });
                }
            },
            function errorCallback(error) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.spinner = false;
                $scope.loginResult = "Could not submit request.." + error;
                Notification.error({ message: "Error processing this request. Please try again later!", positionY: 'bottom', positionX: 'center' });
            }
        );
    }
    $scope.Back = function() {
        $window.history.back();
    }
});

app.directive("fixBottom", function() {
    return {
        link: function(scope, element, attrs) {
            var scrollBot = function() {
                var target = document.getElementById(attrs.fixBottom);
                target.scrollTop = target.scrollHeight;
            };

            element[0].addEventListener("submit", scrollBot);

            scope.$on('$destroy', function() {
                element.removeEventListener("submit", scrollBot);
            });

        }
    }
})