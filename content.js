// function init() {
//     username ? fetchData() : console.log('no user')
// };

// function setUsername() {
//     chrome.storage.sync.get(['insta_username'], function (result) {
//         username = result['insta_username'];
//         init();
//     });
// }

// function fetchData() {
//     chrome.runtime.sendMessage({ type: "fetchData", username }, function (response) {
//         console.log('Message sended', response.response);
//     });
// }


// chrome.runtime.sendMessage({
//     username,
//     followersCount
// });

// chrome.storage.onChanged.addListener(function(){
//     setUsername();
// });

// setUsername();

function init(){
    console.log('init content');
    chrome.storage.sync.get(['insta_username'], function (result) {
        console.log('result', result)
        if(result.insta_username){
            console.log('result.insta_username', )
            chrome.runtime.sendMessage({
                type: 'fetchDataWith',
                username: result.insta_username,
            });
        }
    });
}

init();
