// Saves options to chrome.storage
function save_options() {
    var customUserAgent = document.getElementById('customUserAgent').value;

    if (customUserAgent == '') {
        alert('Please, type in a valid user agent');
    } else {
        chrome.storage.sync.set({
            customUserAgent: customUserAgent
        }, function () {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = chrome.i18n.getMessage('optionsSaved');
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        });
    }
}

function setSavedCustomUserAgent() {

    chrome.storage.sync.get('customUserAgent', function(result) {
        var customUserAgent = result.customUserAgent;

        var elem = document.getElementById("customUserAgent");
        elem.focus();

        if (customUserAgent) {
            elem.value = customUserAgent;
        } else {
            elem.select();
        }

    });
}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('js-save').addEventListener('click',
        save_options);

    setSavedCustomUserAgent();
});