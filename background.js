window.username = '';
window.profilePic = '';
window.followersCount = 0;


init();

function init() {
    fetchData();
}

function fetchData(){
    chrome.storage.sync.get(['insta_username'], function (result) {
        const username = result.insta_username;
        if(username){
            fetch(`http://www.instagram.com/${result.insta_username}?__a=1`)
            .then(r => r.text())
            .then(result => {
                window.username = username;
                result = JSON.parse(result);
                window.profilePic = result.graphql.user.profile_pic_url;
                window.followersCount = result.graphql.user.edge_followed_by.count;

                checkIfFollowersCountChanged(result.graphql.user.edge_followed_by.count);  
            });
        }
    });
}

function checkIfFollowersCountChanged(newFollowersCount){
    console.log('checkIfFollowersCountChanged');
    chrome.storage.sync.get(['insta_followers_count'], function (result) {
        const count = result.insta_followers_count;
        const difference = newFollowersCount - count;
        if(difference > 0) {
            chrome.browserAction.setBadgeText({text: `+${difference}`});
            chrome.browserAction.setBadgeBackgroundColor({ color:'#4f99f8' });
        } else if ( difference < 0) {
            chrome.browserAction.setBadgeText({text: `${difference}`})
            chrome.browserAction.setBadgeBackgroundColor({ color:'#e05a3d' });
        } 
        // else {
        //      chrome.browserAction.setBadgeText({text: ''})
        // }

        saveFollowersCount(newFollowersCount);
    });
}

function clearBadge() {
    chrome.browserAction.setBadgeText({text: ''});
}

function saveFollowersCount(followersCount){
    chrome.storage.sync.set({ insta_followers_count: followersCount }, () => {});
}

function fetchDataWith(username) {
    console.log('username', username)
    fetch(`http://www.instagram.com/${username}?__a=1`)
        .then(r => r.text())
        .then(result => {
            window.username = username;
            result = JSON.parse(result);
            window.profilePic = result.graphql.user.profile_pic_url;
            window.followersCount = result.graphql.user.edge_followed_by.count;

            checkIfFollowersCountChanged(result.graphql.user.edge_followed_by.count);  
        });
}

chrome.runtime.onStartup.addListener(() => {
    fetchData();
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case 'fetchDataWith':
                fetchDataWith(request.username);
                sendResponse({ response: "FETCHED WITH" });
            break;
            case 'fetchData':
                fetchData();
                sendResponse({ response: "FETCHED" });
            break;
            case 'setData':
                window.username = request.username;
                window.profilePic = request.profilePic;
                window.followersCount = request.followersCount;
            break;
            case 'clearBadge':
                clearBadge();
            break;
            default:
                console.log('DEFAULT');
            break;
        }
    }
);
