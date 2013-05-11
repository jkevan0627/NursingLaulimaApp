var restCall = require('/RESTmodule/postRequest');

/**
 * Dealing with the asynchronous callbacks of the restcall.
 * Increments when get class.
 * Decrements after check for the blog tool for the class.
 * Eventually this will at the end hit 0 after checking all the classes.
 */
var count = 0;

function createClasses () {
    if(count == 0) {
        var createClasses = require ('/ui/handheld/classesWindow');
        nursApp.navGroup.open(createClasses.createListClasses(), {animated:true});
    }    
}

/**
 * If any error occurs, then delete all users data.
 * Also, make sure to have the window ui login clickable again.
 */
function onErrorCallback (status) {
    if(status ===  403) {
        alert ('Wrong username or password. Please Try again.');
    }
    else if(status == 400) {
        alert('Please input your username and password.');
    }
    else {
        alert ('Bad internet connection. Please try again.');
    }
    var TestflightTi = require('com.clinsoftsolutions.testflight');
    TestflightTi.passCheckpoint("Data Initialization ERROR");
    nursApp.system.deleteUserData();
    nursApp.ui['loginWindow'].win.setTouchEnabled(true);
}

/**
 Get a Laulima session ID.
 PARAM: 
 username - user's username
 password - user's password	
**/
exports.getLaulimaData = function (username, password) {
    
    var TestflightTi = require('com.clinsoftsolutions.testflight');
    TestflightTi.takeOff("c33a52bb-1bbb-4065-9c20-1bf36f84f36e", true);

    // Set the options for TestFlight SDK
    // In this example the options are only set to the standard defaults
    TestflightTi.setOptions({
        logToConsole: true,
        logToSTDERR: true,
        sendLogOnlyOnCrash: false,
        attachBacktraceToFeedback: false,
        disableInAppUpdates: false
    });



    //show that something is working at the back-end.
    nursApp.system.activityIndicator.setText('Connecting to Laulima');
    nursApp.system.activityIndicator.openIndicator();
    
    //the url to be sent to get back a response.
    var url = 'https://laulima.hawaii.edu/direct/session/new/?_username=' + username + '&_password=' + password;
    //expected response: LAULIMA SESSION ID. Last only 10 min if inactive.
    //callback to store the SESSION ID.
    restCall.RESTfulCall('POST', url, storeSessionId, onErrorCallback);
}

/**
 Store SESSION ID and get USER UNIQUE LAULIMA ID.
 PARAM:
 sessionRawData - the response with the SESSION ID.
**/
function storeSessionId (sessionRawData) {
	//Store the sessionID.
	nursApp.userData.sessionID = sessionRawData;

	//use the SESSION ID to get the user's info.
	var url = "https://laulima.hawaii.edu/direct/user/" + nursApp.userData.username + ".json?sakai.session=" + sessionRawData;
	//expected response: User's Laulima information.
	//callback to store the USER ID.
	restCall.RESTfulCall('GET', url, storeUserId, onErrorCallback);
}

/**
 Store the USER ID and get a list of all the user's classes.
 PARAM:
 userRawData - the response with the user's information.
**/
function storeUserId (userRawData) {
	//parse the user's information as a JSON format.
	var userParsedData = JSON.parse(userRawData);
	//get user's id and store it.
	nursApp.userData.userId = userParsedData.id;

	//use the SESSION ID to get the list of classes from the user.
	var url = "https://laulima.hawaii.edu/direct/site.json?sakai.session=" + nursApp.userData.sessionID;
	
	nursApp.system.activityIndicator.setText('Getting classes...');
	//expected response: user's list of classes.
	//callback to loop through the array of classes and get a list.
	restCall.RESTfulCall('GET', url, getClassesList, onErrorCallback);
	
}

/**
 Get the list of classes and check if blog tool exists in the class.
 Increment 'count' to 1 to deal with the asynchronous callbacks.
 PARAM:
 classesRawData - the reponse with all classes and their information.
**/
function getClassesList (classesRawData) {
	//parse the reponse as a JSON object.
	var classesParsedData = JSON.parse(classesRawData);

	//loop through the list of classes.
	for(var i = 0; i < classesParsedData.site_collection.length; i++) {
	    //for asynchronous problem
	    count += 1;
		//push the info to an array.
		//map (key/value) class's id -> class's info. 
		var entityId = classesParsedData.site_collection[i].entityId;
		var entityReference = classesParsedData.site_collection[i].entityReference;
		nursApp.userData.classes[entityId] = {
			title: classesParsedData.site_collection[i].title,
			entityId: entityId,
			entityReference: entityReference,
			blogExist: false,
			hasBlogId: false,
			blogId: undefined		
		}
		nursApp.userData.classListId.push(entityId);
		var url = "https://laulima.hawaii.edu/direct" + entityReference + "/pages.json?sakai.session=" + nursApp.userData.sessionID;
        restCall.RESTfulCall('GET', url, checkForBlog, onErrorCallback);
	}
}

/**
 Get the information of a class to check for the blog tool.
 Decrement 'count' to 1 to deal with the asynchronous callbacks.
 PARAM:
 classesRawData - the reponse with all the information for a class.
**/
function checkForBlog (classesInfoRawData) {
    //parse the response as an JSON object
    var classesInfoParsedData = JSON.parse(classesInfoRawData);
    
    for (i = 0; i < classesInfoParsedData.length; i++) {
        for(j = 0; j < classesInfoParsedData[i].tools.length; j++) {
            var toolId = classesInfoParsedData[i].tools[j].toolId;
            var siteId = classesInfoParsedData[i].tools[j].siteId;
            if(toolId === 'sakai.blogwow') {
                nursApp.userData.classes[siteId].blogExist = true;
            }
        }
    }
    //for asynchronous problem
    count -= 1;
    createClasses();
        
}