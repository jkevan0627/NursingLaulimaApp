/**
 * Create the login window.
 */
function createApplicationWindow() { 
    
    //create the window login ui
    var self = loginManager();
    
    //store the window to be used later
    nursApp.ui['loginWindow'] = {
        win: self
    };
    
    //Here's the nav group that will hold them both...
    nursApp.navGroup = Ti.UI.iPhone.createNavigationGroup({
        window: self
    });
    
    //create component instance
    var appWindow = Ti.UI.createWindow({
        barColor:'#004b2d'
    });
    
    //add the login window as the root in the navgroup
    appWindow.add(nursApp.navGroup);
    //open the login ui
    appWindow.open();  
            
    return appWindow;
};


//Login ui components structure
function loginManager() {
    
    //title widget
    var winTitle = Titanium.UI.createLabel({
        color:'white',
        text:'Laulima',
        textAlign:'center',
        font:{fontFamily:'Dakota', fontSize:'26pt'}     
    });
    
    //window widget
    var self = Ti.UI.createWindow({
        backgroundImage:'background@2x.png',
        visible:true,
        barColor:'#004b2d'
    });
    self.setTitleControl(winTitle);
    
    //username textfield
    var txtUsername = Ti.UI.createTextField({
        color:'black',
        hintText:'USERNAME',
        backgroundColor:'white',
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top:0,
        width:'100%',
        paddingLeft:9,
        height:44,
        font:{fontFamily:'Optima',fontSize:'19pt'},
        returnKeyType: Titanium.UI.RETURNKEY_NEXT 
    })
    self.add(txtUsername);
    
    //password textfield
    var txtPassword = Ti.UI.createTextField({
        color:'black',
        hintText:'PASSWORD',
        backgroundColor:'white',
        autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        top:51,
        width:'100%',
        paddingLeft:9,
        height:44,
        font:{fontFamily:'Optima',fontSize:'19pt'},
        passwordMask:true,
        returnKeyType: Titanium.UI.RETURNKEY_DONE
    })
    self.add(txtPassword);
    
    txtUsername.addEventListener('return', function() {
        txtPassword.focus();
    });
    
    txtPassword.addEventListener('return', function() {
        txtPassword.blur();
    });
    
    //UH NURSING banner logo
    var sondhLogo = Ti.UI.createImageView({
        image:'UHM_Nursing_mobile_banner.png',
        bottom: 10
    })
    self.add(sondhLogo);
    
    //switch label widget
    // Switch to store user data
    var switchLabel = Ti.UI.createLabel({
        top:122,
        left:100,
        text:'Save Login',
        color:'white',
        font:{fontFamily:'Optima',fontSize:'18pt'}
    });
    self.add(switchLabel);
    
    var basicSwitch = Ti.UI.createSwitch({
        value:true, // mandatory property for iOS
        left:15, 
        top:121
    });
    self.add(basicSwitch);
    
    //switch widget listener
    basicSwitch.addEventListener('change',function(e){
        Ti.API.info('Switch value: ' + basicSwitch.value);
    });
    
    //Login button
    //submit credentials
    var btnSubmitCreds = Ti.UI.createButton({
        backgroundColor:'white',
        color:'#0d4e32',
        right:15,
        top: 118,
        width: 90,
        height:34,
        title:'SIGN IN',
        font:{fontFamily:'Optima',fontSize:'16pt'},
        style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
    })
    self.add(btnSubmitCreds);
    
    //Add login button listener
    btnSubmitCreds.addEventListener('click', function() {
    
        // Hide keyboard if it's still up
        txtUsername.blur();
        txtPassword.blur();
        
        //while getting the data, make sure the login window is on standby so no widgets are clickable
        nursApp.ui['loginWindow'].win.setTouchEnabled(false);
        
        //Creates an activity Indicator while getting the data
        var activityIndicator = require ('/ui/modules/activityindicatorWindow');
        nursApp.system.activityIndicator = activityIndicator.createIndicatorWindow();
        
        // store the UN & PW for future requests
        Ti.API.info('Store UN & PW');
        nursApp.userData.username = txtUsername.value;
        nursApp.userData.password = txtPassword.value;
        
        //start getting the data from the users
        var dataInitialization = require('/ui/modules/dataInitialization');
        dataInitialization.getLaulimaData(txtUsername.value, txtPassword.value);

        // Store values if remember is toggled to yes, otherwise clear.
        if(basicSwitch.value != true)
        {
            nursApp.userData.storeUserId = basicSwitch.value;
            txtUsername.value = '';
            txtPassword.value = '';         
        } else {
            nursApp.userData.storeUserId = basicSwitch.value;
        }
        
        btnSubmitCreds.backgroundColor = 'white';
        btnSubmitCreds.color = '#0d4e32';
        
    });
    
    //when the login button is touched.
    //for ui view
    btnSubmitCreds.addEventListener('touchstart', function() {
        btnSubmitCreds.backgroundColor = '#e6e7e8';
        btnSubmitCreds.color = '#a7a9ac';
    });
    
    return self;
}

exports.createApplicationWindow = createApplicationWindow;