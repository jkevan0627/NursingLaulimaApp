function createEntryView (entryInfo, id, blogId) {
    
    
    //top left button of the navgroup
    var btnLeft = Ti.UI.createButton({
        title:'Entries'
    });
    
    btnLeft.addEventListener('click', function(){  
        nursApp.navGroup.close(self);
    });
    
     var btnRight = undefined;
     
    if (blogId === nursApp.userData.userId) {
        btnRight = Ti.UI.createButton({
            title:'Edit'
        });
        btnRight.addEventListener('click', function(){  

        });
    }
    
    //title widget
    var winTitle = Titanium.UI.createLabel({
        color:'white',
        text:entryInfo[id].children[0].text,
        textAlign:'center',
        font:{fontFamily:'Dakota', fontSize:'22pt'}     
    });
    
    //window
    var self = Ti.UI.createWindow({
        leftNavButton:btnLeft,
        rightNavButton:btnRight,
        visible:true,
        layout:'vertical',
        title:entryInfo[id].children[0].text,
        barColor:'#004b2d'
    });
    self.setTitleControl(winTitle);
    
    //Main view
    var view = Ti.UI.createView ({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundColor: 'white'
    });
    self.add(view);
    
    //Label with the post body text
    var entryBody = Ti.UI.createLabel ({
        text: entryInfo[id].children[1].text,
        font: {fontFamily:'Optima', fontSize:'19'},
        top:15,
        left:15,
        right:15 
    });
    view.add(entryBody);
    
    //Swiping between post entries.
    view.addEventListener('swipe', function (e) {
       if(e.direction == 'left' && id < entryInfo.length - 1) {
           id = id + 1;
           winTitle.setText(entryInfo[id].children[0].text);
           entryBody.setText(entryInfo[id].children[1].text);
       } 
       if(e.direction == 'right' && id > 0) {
           id = id - 1;
           winTitle.setText(entryInfo[id].children[0].text);
           entryBody.setText(entryInfo[id].children[1].text);
       }
    });
    
    nursApp.navGroup.open(self, {animated:true});
}


exports.createEntryView = createEntryView;