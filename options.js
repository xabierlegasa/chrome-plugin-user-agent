// Saves options to chrome.storage
function save_options() {
    var customUserAgent = document.getElementById('customUserAgent').value;
    chrome.storage.sync.set({
        customUserAgent: customUserAgent
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function setSavedCustomUserAgent() {

    chrome.storage.sync.get('customUserAgent', function(result) {
        customUserAgent = result.customUserAgent;

        var elem = document.getElementById("customUserAgent");
        elem.value = customUserAgent;

    });
}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('js-save').addEventListener('click',
        save_options);

    setSavedCustomUserAgent();

    console.log('ssss');
});