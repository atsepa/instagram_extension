document.addEventListener('DOMContentLoaded', function () {
    const bg = chrome.extension.getBackgroundPage();

    init();

    document.getElementById('settings').addEventListener('click', onclickSettings, false);

    function init() {
        chrome.storage.sync.get(['insta_username'], function (result) {
            if(!result.insta_username){
                console.log('iiiif');
                // means there is no username set
                requestUser();
            } 
            else if((result.insta_username && !bg) || (result.insta_username && !bg.username) || (result.insta_username && bg.username === ''))
            {
                console.log('else iiif user', result.insta_username);
                console.log('else iiif bg', bg);
                // means bg did not load
                // requestUser();
                tempo();
                //  maybe do a loading
                // maybe use localhost data
                callFetchWith(result.insta_username);
            } 
            else {
                console.log('else');
                setPopup();
                callFetch();
            }

            clearBadge();
        });
    }

    function tempo() {
        document.getElementById('popup').style.display = 'grid';
        document.getElementById('new-user').style.display = 'none';

        setCountFromMemory();
        setUsernameFromMemory();
        // setProfilePic();
    }

    function callFetch() {
        chrome.runtime.sendMessage({
            type: 'fetchData'
        });
    }

    function callFetchWith(insta_username) {
        chrome.runtime.sendMessage({
            type: 'fetchDataWith',
            username: insta_username
        });
    }

    function clearBadge(){
        chrome.runtime.sendMessage({
            type: 'clearBadge'
        });
    }

    function setPopup() {
        document.getElementById('popup').style.display = 'grid';
        document.getElementById('new-user').style.display = 'none';

        setCount();
        setUsername();
        setProfilePic();
    }

    function requestUser() {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('new-user').style.display = 'block';
    }

    function onclickSettings() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.tabs.create({
                url: './src/settings/settings.html'
            });
        });
    }
    
    function setCount () {
        document.getElementById('followers_count').innerHTML = `${bg.followersCount} followers`;
    }

    function setCountFromMemory () {
        chrome.storage.sync.get(['insta_followers_count'], function (result) {
            document.getElementById('followers_count').innerHTML = `${result.insta_followers_count} followers`;
        });
    }

    function setUsername () {
        document.getElementById('username').innerHTML = `<strong>${bg.username}<strong/>`;
    }

    function setUsernameFromMemory () {
        chrome.storage.sync.get(['insta_username'], function (result) {
            document.getElementById('username').innerHTML = `<strong>${result.insta_username}<strong/>`;
        });
    }

    function setProfilePic () {
        document.getElementById('profile_pic').innerHTML = `<img src="${bg.profilePic}" />`;
    }
}, false)
