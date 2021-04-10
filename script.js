const pup = require("puppeteer");
let id = "xetexos283@684hh.com";
let pass = "123456";
const browserPromise = pup.launch({
    headless:false,
    defaultViewport:false,
    args: ["--start-maximized"]
});
let tab;
let brow;
browserPromise.then(function(browser){
    brow = browser;
    let pagesPromise = browser.pages();
    return pagesPromise;
}).then(function(pages){
    tab = pages[0];
    let pagesopenPromise = tab.goto("https://instagram.fdel24-1.fna.fbcdn.net/v/t51.2885-15/e35/129670231_4712559088818334_5743737695470553330_n.jpg?tp=1&_nc_ht=instagram.fdel24-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=6SlOq4XV1_MAX_Kj-kB&edm=AP_V10EAAAAA&ccb=7-4&oh=1bfe5c18233170d76c4d41d42a3eeba3&oe=609781EA&_nc_sid=4f375e");
    return pagesopenPromise;
})