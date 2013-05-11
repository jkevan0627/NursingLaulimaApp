// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.


var TestflightTi = require('com.clinsoftsolutions.testflight');
Ti.API.info("module is => " + TestflightTi);

// Create our test app window
var win = Ti.UI.createWindow({
	backgroundColor:'white',
	layout: 'vertical'
});

var feedbackButton = Ti.UI.createButton({title: 'Open Feedback Window'});
win.add(feedbackButton);

var crashButton = Ti.UI.createButton({title: 'Test Crash'});
win.add(crashButton);

var label = Ti.UI.createLabel({top:5, border: 1});
win.add(label);

feedbackButton.addEventListener('click', function(e){
	TestflightTi.launchFeedbackView();	
});

crashButton.addEventListener('click', function(e){
	TestflightTi.testException();	
});

// Open the app window
win.open();

var lblText = '';

TestflightTi.takeOff("___INSERT_YOUR_TEAM_TOKEN___", true);
logMsg("Take off done");

logMsg("Old UDID: " + TestflightTi.oldUDID);

// Set the options for TestFlight SDK
// In this example the options are only set to the standard defaults
TestflightTi.setOptions({
	logToConsole: true,
	logToSTDERR: true,
	sendLogOnlyOnCrash: false,
	attachBacktraceToFeedback: false,
	disableInAppUpdates: false
});
logMsg("Options set");
 
TestflightTi.passCheckpoint("Test TestFlight");
logMsg("Checkpoint passed");

TestflightTi.addCustomEnvironmentInformation("Username", "Test User");

TestflightTi.submitFeedback("This is test feedback from the module example app");

TestflightTi.remoteLog("This some log text from the module example app");

function logMsg(_msg) {
	lblText += (_msg + '\n');
	label.setText(lblText);	
}
