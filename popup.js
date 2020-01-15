/**TODO
 * ver como poner un loader
 * checar bn la validacion en init
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('popup');
    const bg = chrome.extension.getBackgroundPage();

    init();
    // init2();

    document.getElementById('settings').addEventListener('click', onclickSettings, false);

    function init() {
        console.log('INIT');
        console.log('BG.username', bg.username);
        console.log('BG.followersCount', bg.followersCount);
        console.log('BG.profilePic', bg.profilePic);
        // validar q bg no sea undefined
        chrome.storage.sync.get(['insta_username'], function (result) {
            if(bg.username === '' && result.insta_username){
                // show a loader
                console.log('NO BG bg.username', bg.username)
                console.log('insta_username', result.insta_username)
                callFetch(result.insta_username);
            } else if(bg.username !== '' && result.insta_username) { 
                setPopup();
            } else { 
                equestUser();
            }
        });
    }

    function callFetch(insta_username) {
        console.log('callFetch')
        chrome.runtime.sendMessage({
            type: 'fetchData',
            username: insta_username
        });
    }

    function init2(){
        chrome.storage.sync.get(['insta_username'], function (result) {
            if(result.insta_username) {
                chrome.runtime.sendMessage({
                    type: 'fetchData',
                    username: result.insta_username
                });
            }
        });
        
    }

    function setPopup() {
        console.log('setPopup');
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
        console.log('setCount');
        console.log('bg', bg);
        document.getElementById('followers_count').innerHTML = `${bg.followersCount} followers`;
    }

    function setUsername () {
        document.getElementById('username').innerHTML = `<strong>${bg.username}<strong/>`;
    }

    function setProfilePic () {
        document.getElementById('profile_pic').innerHTML = `<img src="${bg.profilePic}" />`;
    }
}, false)
