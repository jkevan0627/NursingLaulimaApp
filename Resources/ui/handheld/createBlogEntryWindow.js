function initialize (userInfo, blogTable)  {
    
    var title;
    var text;
    
    function restError() {
        alert('Bad internet connection. Could not connect to Laulima');
        nursApp.ui['createBlogEntryWindow'].win.setTouchEnabled(true);
    }

    //FirstView Component Constructor
    function blogEntry() {
        
        var btnLeft = Ti.UI.createButton({
            title:'Entries',
        });
    
        var winTitle = Titanium.UI.createLabel({
            color:'white',
            text:'New Post',
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
        nursApp.ui['createBlogEntryWindow'] = {
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
            keyboardToolbar : toolbarTitle
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
            keyboardToolbar : toolbarTextArea
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
            title:'POST',
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
    
            var url = 'https://laulima.hawaii.edu/direct/blog-entry?sakai.sessionId=' + nursApp.userData.sessionID + 
            "&blog.id=" + userInfo.blogId + "&text=" + txtBlogTextArea.value + 
            "&title=" + txtBlogTitle.value + "&privacySetting=" + nursApp.userData.blogPrivacySetting;
            
            title = txtBlogTitle.value;
            text = txtBlogTextArea.value;
            
            nursApp.system.activityIndicator.setText('Posting...');
            nursApp.system.activityIndicator.openIndicator();
            nursApp.ui['createBlogEntryWindow'].win.setTouchEnabled(false);
            restCall.RESTfulCall('POST', url, restResponse, restError);
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

    function restResponse(rawData)
    {   
        createRow();
        nursApp.system.activityIndicator.closeIndicator();
        // Create window/view so it closes on exit
        var buttonLabel = Titanium.UI.createLabel({
            text:'OKAY',
            color:'white',
            font:{fontFamily:'Optima',fontSize:'14pt'}
        });
        
        var button = Titanium.UI.createButton({
            Title:'OKAY',
            color:'white',
            font:{fontFamily:'Optima',fontSize:'14pt'},
            backgroundColor:'#0a5738',
            width:90,
            height:34,
            top:182,
            style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        });
        button.add(buttonLabel);
    
        var alertLabel = Titanium.UI.createLabel({
            text:'SUCCESSFULLY UPLOADED!',
            font:{fontFamily:'Optima',fontSize:'16pt'},
            color:'white',
            top:150
        });
    
        var alertView = Titanium.UI.createView({
          backgroundColor:'#337359',
          width:289,
          height:322,
          top:59
        });
        alertView.add(alertLabel);
        alertView.add(button);
        
        var transWin = Titanium.UI.createWindow({
            background:'transparent',
            width:Titanium.UI.FILL,
            height:Titanium.UI.FILL,
            exitOnClose: true
        })
        transWin.add(alertView);
        
    
        button.addEventListener('touchstart', function() {
            button.backgroundColor = 'white';
            buttonLabel.color = '#0a5738';
        });
        
        button.addEventListener('click', function() {
            transWin.remove(alertView);
            nursApp.ui['createBlogEntryWindow'].win.setTouchEnabled(true);
            nursApp.navGroup.close(nursApp.ui['createBlogEntryWindow'].win, {animated:true});
            transWin.close();
        }); 
        
        // attach to main window and show
        //nursApp.mainWindow.add(transWin);
        transWin.open();
        
    }
    
    function createRow () {
        var row = Titanium.UI.createTableViewRow({
            rightImage:'green_arrow.png',
        });
        
        var blogTitle = Titanium.UI.createLabel ({
           text:title,
           font:{fontFamily:'Optima', fontSize:19, fontWeight:'bold'},
           width:180,
           top: 10,
           left: 15,
           height:19
        });
        
        var blogText = Titanium.UI.createLabel ({
           text:text,
           font:{fontFamily:'Optima', fontSize:15},
           width:250,
           bottom: 10,
           left: 15,
           height:15
        });
        
        var time = new Date().getTime();
        var milliTime = new Date(time);
        var parsedTime = milliTime.getMonth()+1 + '.' + milliTime.getDate() + '.' + milliTime.getFullYear();
        
        var date = Titanium.UI.createLabel ({
           text:parsedTime,
           font:{fontFamily:'Optima', fontSize:12},
           width:'auto',
           right: 20,
           top: 10
        });
        
        row.add(blogTitle);
        row.add(blogText);
        row.add(date);
        
        blogTable.insertRowBefore(0 , row);
    }
    
    blogEntry();
}

exports.initialize = initialize;