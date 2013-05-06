/**
 * Create the list of classes that has the blog tool
 */
function createListClasses () {
    
    //close the indicator
    nursApp.system.activityIndicator.closeIndicator();
	
	//top left button widget of the navgroup
	var btnLeft = Ti.UI.createButton({
		//backgroundImage:'white_arrow.png',
		title:'Log Out'
		//width:19,
		//height:44
	});
	
	//add the button listener
    btnLeft.addEventListener('click', function(){
        nursApp.system.deleteUserData();
        nursApp.ui['loginWindow'].win.setTouchEnabled(true);    
        nursApp.navGroup.close(self);
    });
    
    //widget title
	var winTitle = Titanium.UI.createLabel({
		color:'white',
		text:'Classes',
		textAlign:'center',
		font:{fontFamily:'Dakota', fontSize:'22pt'}		
	});
	
	//window widget
	var self = Ti.UI.createWindow({
		leftNavButton:btnLeft,
		visible:true,
		layout:'vertical',
		barColor:'#004b2d'
	});
	self.setTitleControl(winTitle);
	//store the window to be used later
    nursApp.ui['classesWindow'] = {
        win: self
    };
    
    //start creating the data table	
	var tblData = [];
	
	//get classes title in the list of classes available that has blog
	for (var i = 0; i < nursApp.userData.classListId.length; i++) {
		
		var classId = nursApp.userData.classListId[i];
		var blogExist = nursApp.userData.classes[classId].blogExist;
        var classTitle = nursApp.userData.classes[classId].title;
        
        //if blog does exist in the class, create the row with the class title
		if(blogExist) {		    
            var row = Ti.UI.createTableViewRow({
                title:classTitle,
                font:{fontFamily:'Optima',fontSize:'19pt'},
                rightImage:'green_arrow.png',
                //add some information to be used later
                blogData:nursApp.userData.classes[classId]
            });
            //push the row to the table
            tblData.push(row);   
		}
	}
    
    //create the table and add all the rows to it
	var blogTable = Titanium.UI.createTableView({
		data:tblData,
		rowHeight:60,
		seperatorColor:'transparent'
	});
	
	//add the listener for each row in the table
	blogTable.addEventListener('click', function(e) {
	    nursApp.ui['classesWindow'].win.setTouchEnabled(false);
	    //if clicked, then create a list of the users that has a blog in that class
        var getBlogUsers = require('/ui/modules/getBlogUsers');
        //pass the blogData that we have saved in each row
        getBlogUsers.intialize(e.rowData.blogData);
    });
    
    //add the table to the window        
    self.add(blogTable);

	return self;
}

exports.createListClasses = createListClasses;