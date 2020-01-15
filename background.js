window.username = '';
window.profilePic = '';
window.followersCount = 0;

console.log('BACKGROUND');

function fetchData(username) {
    console.log('USER name', username);
    fetch(`http://www.instagram.com/${username}?__a=1`)
        .then(r => r.text())
        .then(result => {
            console.log('result', result);
            window.username = username;
            result = JSON.parse(result);
            console.log('result', result);
            window.profilePic = result.graphql.user.profile_pic_url;
            console.log('pic', result.graphql.user.profile_pic_url);
            window.followersCount = result.graphql.user.edge_followed_by.count;
            console.log('followersCount', result.graphql.user.edge_followed_by.count);

    });
}

chrome.runtime.onStartup.addListener(() => {
    console.log('onStartup....');
    // fetchData();
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('message2');
        switch (request.type) {
            case 'fetchData':
                fetchData(request.username);
                sendResponse({ response: "FETCHED" });
            break;
            case 'setData':
                console.log('setData');
                window.username = request.username;
                window.profilePic = request.profilePic;
                window.followersCount = request.followersCount;
            break;
            case 'test':
                console.log('teeeeest');
            break;
            default:
                break;
        }
    }
);
