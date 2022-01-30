let tabId = "";

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tabId = tabs[0].id;
    chrome.storage.local.get(['interval_time', 'redirection_count'], function(result) {
        $("#interval_time").val(result.interval_time);
        $("#redirection_count").val(result.redirection_count);
    });
});

$(document).ready(function() {

    // $("#interval_time").keyup(function(e) {
    //     if (e.keyCode == 13) {
            
    //     }
    // });

    $("#sure_btn").click(function() {
        const timer_val = $("#interval_time").val();
        const redirection_val = $("#redirection_count").val();
        if(timer_val || redirection_val) {
            chrome.storage.local.set({ 'tabsCnt': {} });

            chrome.storage.local.set({
                'interval_time': timer_val,
                'redirection_count': redirection_val,
            }, function() {
                chrome.tabs.sendMessage(tabId, { 
                    type: "start",
                    timer: timer_val,
                    rcount: redirection_val
                });
                window.close();
            });
        }
    });
});