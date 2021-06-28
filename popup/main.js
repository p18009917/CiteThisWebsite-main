let tab;

if(document.getElementById("cite") !== null && document.getElementById('url') !== null) {
    document.getElementById("cite").addEventListener("click", cite);
    document.getElementById("copy").addEventListener("click", copyToClipboard);
    browser.tabs.query({currentWindow: true, active: true}).then(function (tabs) {
        tab = tabs[0];

        let url = new URL(tab.url);
        
        document.getElementById('url').value = url;
        document.getElementById('publisher').value = publisher;
        document.getElementById('access').value = getCurrentDate();

        let getTitle = 'var meta = document.querySelector("meta[property=\'og:title\']");' + 
           'if (meta) meta = meta.getAttribute("content");' +
           '({' +
           '    title: document.title,' +
           '    og_title: meta || ""' +
           '});';
        browser.tabs.executeScript({
            code: getTitle
        }, function(results) {
            if (!results) {
                
                return;
            }
            let result = results[0];
            
            document.getElementById('title').value = result.og_title;
        });

        let getAuthor = 'var meta = document.querySelector("meta[name=\'author\']");' + 
           'if (meta) meta = meta.getAttribute("content");' +
           '({' +
           '    title: document.title,' +
           '    author: meta || ""' +
           '});';
        browser.tabs.executeScript({
            code: getAuthor
        }, function(results) {
            if (!results) {
                
                return;
            }
            let result = results[0];
            
            document.getElementById('author').value = result.author;
        });

        let getYear = 'var meta = document.querySelector("meta[property=\'article:published_time\']");' + 
           'if (meta) meta = meta.getAttribute("content");' +
           '({' +
           '    title: document.title,' +
           '    time: meta || ""' +
           '});';
        browser.tabs.executeScript({
            code: getYear
        }, function(results) {
            if (!results) {
                
                return;
            }
            let result = results[0];

            let date = new Date(result.time);
            
            document.getElementById('year').value = date.getFullYear();
        });

        let getPublisher = 'var meta = document.querySelector("meta[property=\'og:site_name\']");' + 
           'if (meta) meta = meta.getAttribute("content");' +
           '({' +
           '    title: document.title,' +
           '    site_name: meta || ""' +
           '});';
        browser.tabs.executeScript({
            code: getPublisher
        }, function(results) {
            if (!results) {
                
                return;
            }
            let result = results[0];
            
            document.getElementById('publisher').value = result.site_name;
        });

    }, onError);
}

function getCurrentDate() {
    let date = new Date()

    let monthNames =["Jan", "Feb", "Mar", "Apr",
                        "May", "Jun", "Jul", "Aug",
                        "Sep", "Oct", "Nov", "Dec"];
        
    let day = date.getDate();
        
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];
        
    let year = date.getFullYear();
        
    return `${day} ${monthName} ${year}`;
}

function cite() {
    let url = document.getElementById('url').value;
    let title = document.getElementById('title').value;
    let author = document.getElementById('author').value;
    let year = document.getElementById('year').value;
    let publisher = document.getElementById('publisher').value;
    let access = document.getElementById('access').value;

    let citation = 
        `${author}. ` +
        `${publisher}. ` +
        `${year}. ` +
        `${title}. ` +
        `[online] Available at: <${url}> ` +
        `[Accessed ${access}].`;
    
    document.getElementById('citation').value = citation;
}

function copyToClipboard() {
    var copyText = document.getElementById("citation");
  
    copyText.select();
    copyText.setSelectionRange(0, 99999);
  
    document.execCommand("copy");
  
    alert("Copied to clipboard: " + copyText.value);
  } 

function onError(err) {
    console.log(err);
}