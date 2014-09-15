// Add icon to URL bar
function checkForValidUrl(tabId, changeInfo, tab) {
    //console.log( JSON.stringify(tabId));
    //console.log( JSON.stringify(changeInfo));
    //console.log( JSON.stringify(tab));
    if ( tab.url.indexOf('dict.youdao.com') > -1 ){
		chrome.pageAction.show(tab.id);
    }
};

// Listen for any changes to the URL of any tab
chrome.tabs.onUpdated.addListener(checkForValidUrl);
