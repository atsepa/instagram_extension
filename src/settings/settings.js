document.addEventListener('DOMContentLoaded', function () {
    console.log('settings');

    let username;
    let profilePic;
    let followersCount;
    // clearUsername();
    setUsernameOnInput();
    displayMessageCard('error-card', 'none');
    displayMessageCard('success-card', 'none');
    document.getElementById('save-button').addEventListener('click', onClickSave, false);

    //TODO create a util file with this function
    function setUsernameOnInput () {
        console.log('setUsernameOnInput');
        chrome.storage.sync.get(['insta_username'], function (result) {
            if (result.insta_username) document.getElementById('username').value = result.insta_username;
        });
    }
    
    function onClickSave() {
        console.log('onClickSave');
        username = document.getElementById('username').value;

        checkIfAccountExists();
    }

    function checkIfAccountExists() {
        console.log('checkIfAccountExists');

        fetch(`http://www.instagram.com/${username}?__a=1`)
            .then(r => r.text())
            .then(result => {
                console.log('FETCH')
                result = JSON.parse(result);
                console.log('result', result);
                profilePic = result.graphql.user.profile_pic_url
                followersCount = result.graphql.user.edge_followed_by.count;

                usernameExist(!!result.graphql);
            })
            .catch(() => {
                usernameExist(false);
            });
    }

    function usernameExist(exists) {
        let card = 'error-card';

        if(exists) {
            card = 'success-card';
            setUserData();
        }

        displayMessageCard(card, 'block');
        setTimeout(() => { displayMessageCard(card, 'none'); }, 5000);

    }

    function setUserData(){
        chrome.storage.sync.set({ insta_username: username }, () => {});
        chrome.storage.sync.set({ insta_profile_pic: profilePic }, () => {});
        chrome.storage.sync.set({ insta_followers_count: followersCount }, () => {});
        chrome.runtime.sendMessage({
            type: 'setData',
            username: username,
            profilePic: profilePic,
            followersCount: followersCount
        });
    }

    function displayMessageCard(id, display) {
        document.getElementById(id).style.display = display;
    }

    function clearUsername() {
        chrome.storage.sync.clear(function () {
            console.log('cleared')
        });
    }

}, false);


