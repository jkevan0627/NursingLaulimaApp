/**
 * Create a window with the list of users.
 * PARAM:
 * blogUsersData - the list of users from a request.
 * classInfo - info of the class.
 */
function createListUsers (blogUsersData, classInfo) {
    
    nursApp.system.activityIndicator.closeIndicator();
    
    //top left button of the navgroup
    var btnLeft = Ti.UI.createButton({
        //backgroundImage:'white_arrow.png',
        title:'Classes'
        //width:19,
        //height:44
    });
    
    btnLeft.addEventListener('click', function(){  
        nursApp.ui['classesWindow'].win.setTouchEnabled(true);
        nursApp.navGroup.close(self);
    });
    
    //title widget
    var winTitle = Titanium.UI.createLabel({
        color:'white',
        text:classInfo.title,
        textAlign:'center',
        font:{fontFamily:'Dakota', fontSize:'22pt'}     
    });
    
    //window
    var self = Ti.UI.createWindow({
        leftNavButton:btnLeft,
        visible:true,
        layout:'vertical',
        barColor:'#004b2d'
    });
    self.setTitleControl(winTitle);
    //Stored the window to be user later
    nursApp.ui['blogUsersWindow'] = {
        win: self
    };
    
    //start creating the table
    var tblData = [];
    
    //with the blog users data
    var parsedBlogUsersData = JSON.parse(blogUsersData);
    
    //create the list
    for (var i = 0;  i < parsedBlogUsersData['blog-blog_collection'].length; i++) {
        var name = parsedBlogUsersData['blog-blog_collection'][i].title;
        var blogId = parsedBlogUsersData['blog-blog_collection'][i].id;
        var ownerId = parsedBlogUsersData['blog-blog_collection'][i].ownerId;
        
        var row = Ti.UI.createTableViewRow({
                title:name,
                font:{fontFamily:'Optima',fontSize:'19pt'},
                rightImage:'green_arrow.png',
                blogId: blogId,
                ownerId: ownerId
            });
        tblData.push(row);
    }
    
    //set the user at the top of the list
    tblData.setFirstRow();
    
    //put the user in one table section
    var userBlog = Ti.UI.createTableViewSection();
    tblData[0].setBackgroundColor('#E6E7E8');
    userBlog.add(tblData[0]);
    
    //delete the user from the data table
    tblData.shift();
    
    //add the rest of the users in another table section
    var otherBlog = Ti.UI.createTableViewSection({
        //create a view header
        headerView: Ti.UI.createView({
            backgroundColor: '#004b2d',
            height: 7
        }),
        rows: tblData
    });
    
    //add both section
    var blogTable = Titanium.UI.createTableView({
        data:[userBlog, otherBlog],
        rowHeight:60,
        seperatorColor:'transparent'
    });
    
    //add the listener for each row in the table
    blogTable.addEventListener('click', function(e) {
        nursApp.ui['blogUsersWindow'].win.setTouchEnabled(false);
        //if clicked, then create a list of the users that has a blog in that class
        var getBlogEntries = require('/ui/modules/getBlogEntries');
        //pass the blogData that we have saved in each row
        getBlogEntries.initialize(e.rowData);
        
    });
    
    self.add(blogTable);

    nursApp.navGroup.open(self, {animated:true});
}

//Set the the user at the top of the list
Array.prototype.setFirstRow = function () {
    if(this[0].ownerId === nursApp.userData.userId) {
        return;
    }
    for (var j = 1; j < this.length; j++) {
        if(this[j].ownerId === nursApp.userData.userId) {
            var username = this.splice(j, 1);   
            this.unshift(username[0]);
            return;
        }
    }
}

exports.createListUsers = createListUsers;