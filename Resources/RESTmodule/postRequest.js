//--------------------------------------------------------/
// REST CALL //////////////////////////////////////////////
//
// Variables:
// callType = Type of REST call (GET, POST, PUT, DELETE)
// url = Web address to send request to
// callback = function that the payload will be sent to
//-------------------------------------------------------/
exports.RESTfulCall = function (callType, url, callBack, errorCallBack)
{
	if (Titanium.Network.online == true)
	{
		// create HTTP client
	    var xhr = Ti.Network.createHTTPClient({
	        // function called when the response data is available
	        onload : function(e) {
	        	nursApp.system.updateSessionTime();
	        	callBack(this.responseText);       
	        },
	        // function called when an error occurs, including a timeout
	        onerror : function(e) {
				Ti.API.info("STATUS: " + this.status);
				Ti.API.info("TEXT:   " + this.responseText);
				Ti.API.info("ERROR:  " + e.error);
				errorCallBack(this.status);
				nursApp.system.activityIndicator.closeIndicator();
	        },
		    ondatastream: function(e) {
		        // function called as data is downloaded
		        Ti.API.info('ondatastream called, readyState = '+this.readyState);
		    },
		    onsendstream: function(e) {
		        // function called as data is uploaded
		        Ti.API.info('onsendstream called, readyState = '+this.readyState);
		    },
		    onreadystatechange: function(e) {
		        switch(this.readyState) {
		            case 0:
		                // after HTTPClient declared, prior to open()
		                // though Ti won't actually report on this readyState
		                Ti.API.info('case 0, readyState = '+this.readyState);
		            break;
		            case 1:
		                // open() has been called, now is the time to set headers
		                Ti.API.info('case 1, readyState = '+this.readyState);
		            break;
		            case 2:
		                // headers received, xhr.status should be available now
		                Ti.API.info('case 2, readyState = '+this.readyState);
		            break;
		            case 3:
		                // data is being received, onsendstream/ondatastream being called now
		                Ti.API.info('case 3, readyState = '+this.readyState);
		            break;
		            case 4:
		                // done, onload or onerror should be called now
		                Ti.API.info('case 4, readyState = '+this.readyState);
		            break;
		        }
		    },
	        timeout : 15000,  // in milliseconds
	        enableKeepAlive : true
	    });
	     
	    //prepare the connection
	    xhr.open(callType, url);
	    xhr.setRequestHeader("Content-Type","application/json");
		
		//send request
		xhr.send();

	}	else   {
		alert('You are not online');
		nursApp.system.activityIndicator.closeIndicator();
	}
}

exports.newLaulimaSession = function (callback)
{
	if (Titanium.Network.online == true)
	{
		Ti.API.info('About to request a new session');
		var url = 'https://laulima.hawaii.edu/direct/session/new/?_username=' + nursApp.userData.username + '&_password=' + nursApp.userData.password;
		var callType = 'POST';
		Ti.API.info('Sending url: ' + url);
		
		// create HTTP client
	    var xhr = Ti.Network.createHTTPClient({
	        // function called when the response data is available
	        onload : function(e) {
	        	Ti.API.info('newLaulimaSession successful');
	        	nursApp.system.updateSessionTime();
	        	nursApp.userData.sessionID = this.responseText;
	        	Ti.API.info('Executing callback');
	            callback();
	        },
	        // function called when an error occurs, including a timeout
	        onerror : function(e) {
				Ti.API.debug("STATUS: " + this.status);
				Ti.API.debug("TEXT:   " + this.responseText);
				Ti.API.debug("ERROR:  " + e.error);
	        },

	        timeout : 8000,  // in milliseconds
	        enableKeepAlive : true
	    });
	     
	    //prepare the connection
	    xhr.open(callType, url);
	    xhr.setRequestHeader("Content-Type","application/json");
		
		//send request
		xhr.send();

	}	else   {
		alert('You are not online');
	}
}

exports.test = function (callType, url, errorCallBack)
{
    if (Titanium.Network.online == true)
    {
        // create HTTP client
        var xhr = Ti.Network.createHTTPClient({
            // function called when the response data is available
            onload : function(e) {
                nursApp.system.updateSessionTime();
                return this.reponseText;
            },
            // function called when an error occurs, including a timeout
            onerror : function(e) {
                Ti.API.info("STATUS: " + this.status);
                Ti.API.info("TEXT:   " + this.responseText);
                Ti.API.info("ERROR:  " + e.error);
                errorCallBack();
                nursApp.system.activityIndicator.closeIndicator();
            },
            ondatastream: function(e) {
                // function called as data is downloaded
                Ti.API.info('ondatastream called, readyState = '+this.readyState);
            },
            onsendstream: function(e) {
                // function called as data is uploaded
                Ti.API.info('onsendstream called, readyState = '+this.readyState);
            },
            onreadystatechange: function(e) {
                switch(this.readyState) {
                    case 0:
                        // after HTTPClient declared, prior to open()
                        // though Ti won't actually report on this readyState
                        Ti.API.info('case 0, readyState = '+this.readyState);
                    break;
                    case 1:
                        // open() has been called, now is the time to set headers
                        Ti.API.info('case 1, readyState = '+this.readyState);
                    break;
                    case 2:
                        // headers received, xhr.status should be available now
                        Ti.API.info('case 2, readyState = '+this.readyState);
                    break;
                    case 3:
                        // data is being received, onsendstream/ondatastream being called now
                        Ti.API.info('case 3, readyState = '+this.readyState);
                    break;
                    case 4:
                        // done, onload or onerror should be called now
                        Ti.API.info('case 4, readyState = '+this.readyState);
                    break;
                }
            },
            timeout : 15000,  // in milliseconds
            enableKeepAlive : true
        });
         
        //prepare the connection
        xhr.open(callType, url);
        xhr.setRequestHeader("Content-Type","application/json");
        
        //send request
        xhr.send();

    }   else   {
        alert('You are not online');
        nursApp.system.activityIndicator.closeIndicator();
    }
}
