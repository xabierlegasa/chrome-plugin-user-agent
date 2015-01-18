var applyPlugin = false;
var customUserAgent = '';


function initPlugin() {
    // disable plugin and set disabled icon
    chrome.storage.sync.set({applyPlugin: false}, function () {
    });
    chrome.browserAction.setIcon({path: 'icon19_off.png'});

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
        ["blocking", "requestHeaders"]);




    chrome.browserAction.onClicked.addListener(function (tab) {

        if (customUserAgent) {
            if (applyPlugin) {
                chrome.storage.sync.set({applyPlugin: false}, function () {
                });
                chrome.browserAction.setIcon({path: 'icon19_off.png'});
            } else {
                chrome.storage.sync.set({applyPlugin: true}, function () {
                });
                chrome.browserAction.setIcon({path: 'icon19_on.png'});
            }
        } else {
            alert('You are almost done! \nSet up first the User-Agent you want to use.\n Plugin icon (right click) -> Options');
        }
    });

});
