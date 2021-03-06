function initialize (title, body, entryId)  {
    
    var title;
    var text;
    
    function restError() {
        var TestflightTi = require('com.clinsoftsolutions.testflight');
        TestflightTi.passCheckpoint("Edit Entry ERROR");
        alert('Bad internet connection. Could not connect to Laulima');
        nursApp.ui['editBlogEntryWindow'].win.setTouchEnabled(true);
    }

    //FirstView Component Constructor
    function blogEntry() {
        
        var btnLeft = Ti.UI.createButton({
            title:'Entries',
        });
    
        var winTitle = Titanium.UI.createLabel({
            color:'white',
            text:title,
            textAlign:'center',
            font:{fontFamily:'Dakota', fontSize:'22pt'}     
        });
        
        var self = Ti.UI.createWindow({
            backgroundImage:'background@2x.png',
            barColor:'#004b2d',
            leftNavButton:btnLeft,
            visible:true,
            layout:'vertical'
        });
        self.setTitleControl(winTitle);
        //to be used later
        nursApp.ui['editBlogEntryWindow'] = {
            win: self
        };
        
        btnLeft.addEventListener('click', function(){
            nursApp.navGroup.close(self);
        });
        
        var wrapper = Ti.UI.createScrollView({
            top:0,
            contentHeight:'auto',
            layout: 'vertical',
            height:'85%'
        });
    
        var flexSpace = Titanium.UI.createButton({
            systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
    
        var btnDone = Ti.UI.createButton({
            title:'Done',
            style:Ti.UI.iPhone.SystemButtonStyle.BORDERED
        });
        
        var btnNext = Ti.UI.createButton({
            title:'Next',
            style:Ti.UI.iPhone.SystemButtonStyle.BORDERED
        });
        
        var btnPrevious = Ti.UI.createButton({
            title:'Previous',
            style:Ti.UI.iPhone.SystemButtonStyle.BORDERED
        });
        
         btnDone.addEventListener('click', function(e){
            txtBlogTextArea.blur();
            txtBlogTitle.blur();
        });
        
         btnNext.addEventListener('click', function(e){
            txtBlogTextArea.focus();
        });
        
        btnPrevious.addEventListener('click', function(e){
            txtBlogTitle.focus();
        });
        
        var toolbarTitle = Ti.UI.iOS.createToolbar({
            items:[flexSpace, btnNext],
            bottom:0,
            borderTop:true,
            borderBottom:false,
            height:Ti.UI.SIZE,
            barColor : '#004b2d'
        });
        
        var toolbarTextArea = Ti.UI.iOS.createToolbar({
            items:[btnPrevious, flexSpace, btnDone],
            bottom:0,
            borderTop:true,
            borderBottom:false,
            height:Ti.UI.SIZE,
            barColor : '#004b2d'
        });
        
        var txtBlogTitle = Ti.UI.createTextField({
            color:'black',
            backgroundColor:'white',
            autocorrect: false,
            top:0,
            width:Ti.UI.FILL,
            paddingLeft:8,
            height:44,
            font:{fontFamily:'Optima',fontSize:'17pt'},
            keyboardToolbar : toolbarTitle,
            value: title
        })
        wrapper.add(txtBlogTitle);
        
        var txtBlogTextArea = Ti.UI.createTextArea({
            color:'black',
            backgroundColor:'white',
            autocorrect: false,
            top: 8,
            width:Ti.UI.FILL,
            height:Ti.UI.FILL,
            paddingLeft:8,
            font:{fontFamily:'Optima',fontSize:'17pt'},
            suppressReturn:false,
            keyboardToolbar : toolbarTextArea,
            value: body
        })
        wrapper.add(txtBlogTextArea);
        self.add(wrapper);
    
        
        var buttonWrapper = Ti.UI.createView({
            title:''
        });
        
        // submit credentials
        var btnClear = Ti.UI.createButton({
            backgroundColor:'white',
            color:'#0d4e32',
            left:15,
            top: 15,
            width: 90,
            height: 34,
            title:'CLEAR',
            font:{fontFamily:'Optima',fontSize:'14pt'},
            style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        })
        buttonWrapper.add(btnClear);
        
        btnClear.addEventListener('click', function() {
            txtBlogTextArea.value = '';
            txtBlogTitle.value = '';
            btnClear.backgroundColor = 'white';
            btnClear.color = '#0d4e32';
        });
        
        btnClear.addEventListener('touchstart', function() {
            btnClear.backgroundColor = '#e6e7e8';
            btnClear.color = '#a7a9ac';
        });
        
        // submit credentials
        var btnSubmitBlog = Ti.UI.createButton({
            backgroundColor:'white',
            color:'#0d4e32',
            right:15,
            top: 15,
            width: 90,
            height:34,
            title:'UPDATE',
            font:{fontFamily:'Optima',fontSize:'14pt'},
            style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        })
        buttonWrapper.add(btnSubmitBlog);
    
        btnSubmitBlog.addEventListener('touchstart', function() {
            btnSubmitBlog.backgroundColor = '#e6e7e8';
            btnSubmitBlog.color = '#a7a9ac';
        });
        self.add(buttonWrapper);
        //Add behavior for UI
        btnSubmitBlog.addEventListener('click', function() {
            // send RESTful request
            var restCall = require('/RESTmodule/postRequest');
            
            if(nursApp.system.isSessionActive() === false) {
                Ti.API.info("Old sessionID: " + nursApp.userData.sessionID);
                restCall.newLaulimaSession();
            }
    
            var url = 'https://laulima.hawaii.edu/direct/blog-entry/' + entryId + '?sakai.sessionId=' + nursApp.userData.sessionID + '&text=' + txtBlogTextArea.value + '&title=' + txtBlogTitle.value;
            
            title = txtBlogTitle.value;
            text = txtBlogTextArea.value;
            
            Ti.API.info('url: ' + url);
            Ti.API.info('entryId ' + entryId);
            nursApp.system.activityIndicator.setText('Updating...');
            nursApp.system.activityIndicator.openIndicator();
            nursApp.ui['editBlogEntryWindow'].win.setTouchEnabled(false);
            restCall.RESTfulCall('PUT', url, restResponse, restError);
            /*
            Ti.API.info('Checking is session is active before ending blog post');
            if(nursApp.system.isSessionActive())
            {
                Ti.API.info('Session is active, send post');
                restCall.RESTfulCall('POST', url, restResponse, restError);
            } else {
                // Call the session update and pass in the previously listed function
                Ti.API.info('Session is not active, get new session then send post');
                restCall.newLaulimaSession(restCall.RESTfulCall('POST', url, restResponse, restError));
            }
            */
            btnSubmitBlog.backgroundColor = 'white';
            btnSubmitBlog.color = '#0d4e32';
        });
    
        nursApp.navGroup.open(self);
    }

    function restResponse(rawData) {   
        var TestflightTi = require('com.clinsoftsolutions.testflight');
        TestflightTi.passCheckpoint("Edit Entry successful");
        alert ("Updated");
        nursApp.system.activityIndicator.closeIndicator();
        
    }
    
    
    blogEntry();
}

exports.initialize = initialize;