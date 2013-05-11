/**
 * Create a window with the list of entries from a user.
 * PARAM:
 * blogEntries- the list of entries from a user.
 * userInfo - info of the user selected.
 */
function createBlogEntryList (blogEntries, userInfo) {
    
    var TestflightTi = require('com.clinsoftsolutions.testflight');
    TestflightTi.passCheckpoint("Retrieve blog entries successful");
    
    nursApp.system.activityIndicator.closeIndicator();
    //top left button of the navgroup
    var btnLeft = Ti.UI.createButton({
        title:'Users'
    });
    
    btnLeft.addEventListener('click', function(){  
        nursApp.ui['blogUsersWindow'].win.setTouchEnabled(true);
        nursApp.navGroup.close(self);
    });
    
    var btnRight = undefined;
     
    if (userInfo.ownerId === nursApp.userData.userId) {
        btnRight = Ti.UI.createButton({
            title:'Add'
        });
        btnRight.addEventListener('click', function(){  
            var createBlogEntry = require ('/ui/handheld/createBlogEntryWindow');
            createBlogEntry.initialize(userInfo, blogTable);
        });
    }
    
    //title widget
    var winTitle = Titanium.UI.createLabel({
        color:'white',
        text:userInfo.title,
        textAlign:'center',
        font:{fontFamily:'Dakota', fontSize:'22pt'}     
    });
    
    //window
    var self = Ti.UI.createWindow({
        leftNavButton:btnLeft,
        rightNavButton:btnRight,
        visible:true,
        layout:'vertical',
        barColor:'#004b2d'
    });
    self.setTitleControl(winTitle);
    //save window to be used later
    nursApp.ui['blogEntriesWindow'] = {
        win: self
    };
    
    //start creating the table
    var tblData = [];
    
    //create the list
    for (var i = 0;  i < blogEntries.length; i++) {
        var row = Titanium.UI.createTableViewRow({
            rightImage:'green_arrow.png'
        });
        
        var blogTitle = Titanium.UI.createLabel ({
           text:blogEntries[i].title,
           entryId: blogEntries[i].id,
           font:{fontFamily:'Optima', fontSize:19, fontWeight:'bold'},
           width:180,
           top: 10,
           left: 15,
           height:19
        });
        
        
        
        var blogText = Titanium.UI.createLabel ({
           text:blogEntries[i].text,
           font:{fontFamily:'Optima', fontSize:15},
           width:250,
           bottom: 10,
           left: 15,
           height:15
        });
        
        var date = Titanium.UI.createLabel ({
           text:parseDate(blogEntries[i].dateModified),
           font:{fontFamily:'Optima', fontSize:12},
           width:'auto',
           right: 20,
           top: 10
        });
        
        row.add(blogTitle);
        row.add(blogText);
        row.add(date);
        
        tblData.push(row);
    }
    
    var blogTable = Titanium.UI.createTableView({
        data:tblData,
        rowHeight:60,
        seperatorColor:'transparent'
    });
    
    //add the listener for each row in the table
    blogTable.addEventListener('click', function(e) {
            var createEntryView = require ('/ui/handheld/EntryViewWindow');
            createEntryView.createEntryView(blogTable.data[0].rows, e.index, userInfo.ownerId);
    });
    
    self.add(blogTable);
    
    nursApp.navGroup.open(self, {animated:true});
    
    if (blogEntries.length == 0 && (userInfo.ownerId === nursApp.userData.userId)) {
            
            var dialog = Ti.UI.createAlertDialog({
                yes: 0,
                no: 1,
                buttonNames: ['Yes', 'No'],
                message: 'Would you like to create your first entry for this blog?',
                title: 'First Post Entry'
            });
            
            dialog.addEventListener('click', function(e){
                if (e.index === e.source.yes){
                     var createBlogEntry = require ('/ui/handheld/createBlogEntryWindow');
            createBlogEntry.initialize(userInfo, blogTable);
                }
            });
            dialog.show();        
    }
}

/**
 * Get the date by passing the time in milliseconds.
 * PARAM:
 * epochDate - the date in milliseconds.
 */
function parseDate (epochDate) {
    var date = new Date (epochDate);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return month + '.' + day + '.' + year;
}

exports.createBlogEntryList = createBlogEntryList;