var classInfo;
var restCall = require('/RESTmodule/postRequest');

/**
 * Intialize the procedure to get the users
 * PARAM:
 * classData - some class data passed.
 */
function intialize (classData) {
    //make the classData visible to other functions
    classInfo = classData;
    nursApp.system.activityIndicator.setText('Getting blog users...');
    nursApp.system.activityIndicator.openIndicator();
    //get the users
    getUsers();
}

function errorCallBack () {
    var TestflightTi = require('com.clinsoftsolutions.testflight');
    TestflightTi.passCheckpoint("Get Blog Users ERROR");
    alert("Couldn't get any user. Please try again.");
    nursApp.ui['classesWindow'].win.setTouchEnabled(true);
}

/**
 * Check if the current user has a blog ID.
 * If not, create a blog ID.
 * Otherwise, create a start creating the list of users.
 */
function createBlogId (blogUsersData) {
    //parsed the data received as JSON
    var parsedBlogUsersData = JSON.parse(blogUsersData);
    
    //check if the user is listed in the returned list of users.
    for (var blogUserInfo in parsedBlogUsersData['blog-blog_collection']) {
        if (parsedBlogUsersData['blog-blog_collection'][blogUserInfo].ownerId === nursApp.userData.userId) {
            classInfo.hasBlogId = true;
            classInfo.blogId = parsedBlogUsersData['blog-blog_collection'][blogUserInfo].id;
        }
    }
    
    //if user has, then go ahead and create the list
    if(classInfo.hasBlogId) {
        Ti.API.info("has blog");
        var blogUsersWindow = require ('/ui/handheld/blogUsersWindow');
        blogUsersWindow.createListUsers(blogUsersData, classInfo);
    }
    else {
        //if not, do a POST REST request to create a user blog ID.
       Ti.API.info("has NOT blog");
       url = "https://laulima.hawaii.edu/direct/blog-blog?sakai.sessionId=" + nursApp.userData.sessionID + "&ownerId=" + nursApp.userData.userId + "&location=" +
       classInfo.entityReference;
       //start again from getUsers() to double check.
       restCall.RESTfulCall('POST', url, getUsers, errorCallBack);     
    }       
}

/**
 * Get the list of users from a GET request
 */
function getUsers () {
    //the url to be sent
    var url = "https://laulima.hawaii.edu/direct/blog-blog.json?sakai.session=" + nursApp.userData.sessionID + "&location=" + 
    classInfo.entityReference;
    //do a rest call
    //if succeed, do a callback to createBlogId method
    restCall.RESTfulCall('GET', url, createBlogId, errorCallBack);
}

exports.intialize = intialize;