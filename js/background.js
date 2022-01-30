chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
    chrome.storage.local.get(['interval_time', 'redirection_count', 'tabsCnt'], function(data) {
        let tmp_tabsCnt = Boolean(data.tabsCnt) ? {...data.tabsCnt} : {};
        let tabCnt = tmp_tabsCnt["t_"+tabId]>-3 ? tmp_tabsCnt["t_"+tabId]+1 : -1;
        tmp_tabsCnt["t_"+tabId] = tabCnt;

        console.log(tabCnt, data.redirection_count);
        if(tabCnt > parseInt(data.redirection_count)) return; 
        chrome.tabs.sendMessage(tabId, {
            type: "start",
            timer: data.interval_time,
            rcount: data.redirection_count
        });

        chrome.storage.local.set({ 'tabsCnt': tmp_tabsCnt });
    });
});