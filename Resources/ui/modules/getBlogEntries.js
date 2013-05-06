/**
 * Get the blog entries data.
 * PARAM:
 * userInfo - the user's selected info.
 */
function initialize (userInfo) {
    // Create new laulima session
    var RESTful = require('/RESTmodule/postRequest');
    
    nursApp.system.activityIndicator.setText('Getting blog entries...');
    nursApp.system.activityIndicator.openIndicator();
    
    // Error Callback
    function errorCallback() {
        alert('there was an error');
        nursApp.ui['blogUsersWindow'].win.setTouchEnabled(true);
    }
    
    // Pass in function to get BlogPosts
    function getBlogData() {
        Ti.API.info('in getBlogData');
        url = 'https://laulima.hawaii.edu/direct/blog-entry.json?ownerId='+ nursApp.userData.sessionID + '&blogId=' + userInfo.blogId;
        RESTful.RESTfulCall('GET', url, createblogEntryLlist, errorCallback);
    }
    
    //create the blog entry list
    //if 0 entries, alert the user.
    function createblogEntryLlist (blogEntryData) {
       var blogEntryParsedData = JSON.parse(blogEntryData);
       var blogEntries = blogEntryParsedData['blog-entry_collection'];
        if(blogEntries.length == 0) {
            alert(userInfo.title + " has no blog entries for this class.");
            nursApp.ui['blogUsersWindow'].win.setTouchEnabled(true);
            nursApp.system.activityIndicator.closeIndicator();
        }
        else {
            var blogEntry = require ('/ui/handheld/blogEntriesWindow');
            blogEntry.createBlogEntryList(blogEntries, userInfo);
        }
    }
    
    getBlogData();
}

// Public interface
exports.initialize = initialize;