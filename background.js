var applyPlugin = false;
var customUserAgent = '';


function initPlugin() {
    // disable plugin and set disabled icon
    chrome.storage.sync.set({applyPlugin: false}, function () {
    });
    chrome.browserAction.setIcon({path: 'images/icon19_off.png'});

    // load customUserAgent from storage
    chrome.storage.sync.get('customUserAgent', function (result) {
        customUserAgent = result.customUserAgent;
    });
}


document.addEventListener('DOMContentLoaded', function () {


    initPlugin();


    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);

            if (key == 'customUserAgent') {
                customUserAgent = storageChange.newValue;
            } else if (key == 'applyPlugin') {
                applyPlugin = storageChange.newValue;
            }

        }
    });


    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {

            if (applyPlugin) {

                for (var i = 0; i < details.requestHeaders.length; ++i) {
                    if (details.requestHeaders[i].name === 'User-Agent') {
                        details.requestHeaders.splice(i, 1);
                        break;
                    }
                }

                details.requestHeaders.push({
                    name: 'User-Agent',
                    value: customUserAgent
                });

                return {requestHeaders: details.requestHeaders};
            } else {
                console.log('do nothing because hat is off');
            }
        },
        {urls: ["<all_urls>"]},
        ["blocking", "requestHeaders"]
    );


    chrome.browserAction.onClicked.addListener(function (tab) {

        extensionIconClicked();

        if (customUserAgent) {
            if (applyPlugin) {
                chrome.storage.sync.set({applyPlugin: false}, function () {
                });
                chrome.browserAction.setIcon({path: 'images/icon19_off.png'});
            } else {
                chrome.storage.sync.set({applyPlugin: true}, function () {
                });
                chrome.browserAction.setIcon({path: 'images/icon19_on.png'});
            }
        } else {
            alert('Configure the User-Agent first:\n Right click on the plugin icon >> options');
        }
    });


    // Check whether new version is installed
    chrome.runtime.onInstalled.addListener(function(details){

        if(details.reason == "install"){
            // it is a first install
            chrome.tabs.create({url: "options.html"});
        }else if(details.reason == "update"){
            //var thisVersion = chrome.runtime.getManifest().version;
            //console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        }

    });
});



var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59820248-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function extensionIconClicked(){
    console.log('icon clicked');
    _gaq.push(['_trackEvent', 'plugin icon click (browser action)', 'clicked']);
}