let intervalTime = 5;
let redirectionCount = 10;
let availableLinks;
let timer = 0;
let ignoreUrl = [];
let _M = null;

async function urlExists(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.status < 400);
    }
  };
  xhr.open('HEAD', url);
  xhr.send();
}

async function goToRandomLink() {
    const urlsOFStorage = localStorage.getItem("iurls_of_autobot");
    ignoreUrl = urlsOFStorage ? JSON.parse(urlsOFStorage) : [];
    
    let filteredAry = availableLinks.filter(function(value){ 
            if(ignoreUrl.indexOf(value) === -1) return true;
        });

    if(filteredAry.length < 1) return;

    const ind = Math.floor(Math.random() * filteredAry.length);
    let link = filteredAry[ind];

    await urlExists(link, function(exists) {
        if(exists) {
            // if(!confirm("wanna to go " + link)) return true;

            ignoreUrl.push(link);
            localStorage.setItem("iurls_of_autobot", JSON.stringify(ignoreUrl));
            // window.location.href = link;
            document.querySelector('a[href="'+link+'"]').click();
        } else {
            goToRandomLink();
        }
    });
    
}

async function getAllLinkAndFilter(){
    timer = 0;
    availableLinks = [];
    clearTimeout(_M);
    var all = document.getElementsByTagName("a");
    for(var i = 0, max = all.length; i < max; i++) 
    {
        const aTag = all[i];
        if( aTag.hasAttribute('href') ){
            let link = aTag.getAttribute('href');
            if(link.indexOf('/') > -1){
                availableLinks.push(link);
            }
        }
    }
    _M = setTimeout(()=>{
        timer++;
        goToRandomLink();
    },intervalTime * 1000);
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type === "start") {
            // console.log(request.timer);
            intervalTime = request.timer;
            redirectionCount = request.rcount;
            getAllLinkAndFilter();
        }
    }
);
