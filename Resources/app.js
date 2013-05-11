// For iOS, create a navigation group to open windows.
var nursApp = {
    navGroup : undefined
};

//Store user top-level user' information
nursApp.userData = {
	sessionID: undefined,
	username: undefined,
	password: undefined,
	userId: undefined,
	classListId: []
};

//Set some properties to be used globally in the app
nursApp.system = {
	storeUserData : function()
	{
		Ti.API.info('storing user data');
		Ti.App.Properties.setString("userData", JSON.stringify(nursApp.userData));
	},
	
	retrieveUserData : function()
	{
		Ti.API.info('retrieving user data');
		nursApp.userData = JSON.parse(Ti.App.Properties.getString('userData'));
	},
	
	deleteUserData : function()
	{
		Ti.API.info('deleting user data');
		
		nursApp.userData.sessionID = undefined;
		nursApp.userData.username = undefined;
		nursApp.userData.password = undefined;
		nursApp.userData.userId = undefined;
		nursApp.userData.classListId = [];

	
		Ti.App.Properties.removeProperty('userData');
	},
	
	checkForProp : function()
	{
		if(Ti.App.Properties.hasProperty('userData'))
		{
			Ti.API.info('The property exists');
			alert('User data exists');
			return true;
		} else {
			Ti.API.info('The property doesnt exist');
			alert('User data doesnt exist');
			return false;
		}
	},
	
	activityIndicator : null,
	
	lastAccess : null,
	
	//Check if the session is active
	//A session last 10 min
	isSessionActive : function()
	{
		Ti.API.info('checking isSessionActive');
		if(nursApp.system.lastAccess != null)
		{
			var timeStamp = new Date();
			var sessionDifference = timeStamp.getTime() - nursApp.system.lastAccess
			
			// If the last session was never stored, or greater than 9 minutes ago, get a new sessionId
			if(sessionDifference > 540000)	
			{
				Ti.API.info('isSessionActive = false');
				return false;
			} 
				else // Use the current sessionId 
			{
				Ti.API.info('isSessionActive = true');
				return true;
			}
		} else {
			Ti.API.info('isSessionActive = false');
			return false;
		}
	},
    
    //Update a session with new time
	updateSessionTime : function()
	{
		Ti.API.info('updating the session time');
		// Store the last time Laulima was accessed successfully
		var timeStamp = new Date();
		nursApp.system.lastAccess = timeStamp.getTime();
	}
};

//classes information
nursApp.userData.classes = {};

//sometimes need the window ui so store them here
nursApp.ui = {};

nursApp.posts = {};
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.

// open the login window screen
var login = require('/ui/handheld/loginWindow');
// Hide the status bar
Titanium.UI.iPhone.hideStatusBar();
nursApp.mainWindow = login.createApplicationWindow();