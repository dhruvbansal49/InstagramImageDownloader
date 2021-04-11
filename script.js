const pup = require("puppeteer");

// Please use fake id as there is chances of blocking of you personal id
// Use those username whose profile is public

let id = ""; // Your instagram id
let user = ""; // Your instagram username
let pass = ""; // Your instagram password
let pathToDownloadFolder='C:/Users/bansa/Downloads'; //path of download folder in yor PC(edit it)
let chromePath='C:/Program Files/Google/Chrome/Application/chrome'; // path of chrome in your PC(edit it)
let tab;
let usernameOfDownload = process.argv[2];
let no_of_images=1;

console.log(typeof(usernameOfDownload));
async function wait(ms){
    await new Promise(function(resolve,reject){
        setTimeout(function(){
            resolve();
        },ms)
    })
}
async function main(){
    const browser = await pup.launch({
        headless:false,
        defaultViewport:false,
        args:["--start-maximized"],
      })
    let pages = await browser.pages();
    tab = pages[0];
    await tab.goto("https://www.instagram.com/accounts/login/");

    await tab.waitForSelector("input[name='username']",{visible:true});
    await tab.type("input[name='username']",user);
    await wait(1000);
    await tab.type("input[name='password']",pass);
    await wait(1000);

    await tab.waitForSelector("button[type='submit']",{visible:true});
    await tab.click("button[type='submit']");
    
    await tab.waitForSelector("input[placeholder='Search']",{visible:true});
    
    await tab.type("input[placeholder='Search']",usernameOfDownload);
    await wait(3000);
    await tab.keyboard.press('ArrowDown');
    await tab.keyboard.press('Enter');
    await tab.waitForSelector(".v1Nh3.kIKUG._bz0w a",{visible:true});
    let postUrlInComp = await tab.$$(".v1Nh3.kIKUG._bz0w a");
    let allUrlPromises=[];
    for(let i of postUrlInComp){
        let url = tab.evaluate(function(ele){
            return ele.getAttribute("href")
        },i)
        allUrlPromises.push(url);
    }
    let postUrls = await Promise.all(allUrlPromises);
    for(let i=0;i<postUrls.length;i++){
        await downloadImage("https://www.instagram.com/"+postUrls[i]);
    }    
    await browser.close();  
}
async function downloadImage(url){
    await tab.goto(url);
    let image = await tab.$(".ZyFrc img[class='FFVAD']");
    let nextButton = await tab.$("._6CZji");
    if(nextButton==null){
        if(image!=null){
            
            let imageExact = await tab.evaluate(function(ele){
                return ele.getAttribute("src");
            },image)
            await tab.goto(imageExact);
            let actualImage = await tab.$("img");
            let data = await tab.evaluate(function(){
                return confirm("Want to download this Image then press 'Ok'");
            })
            if(data){
                await actualImage.screenshot({path:`${pathToDownloadFolder}/downloadedImage${no_of_images}.png`});
                no_of_images++;
            }
        }else{
            let video = await tab.$(".tWeCl");
            let videoExact = await tab.evaluate(function(ele){
                return ele.getAttribute("src");
            },video);
            await downloadVideo(videoExact);
        }
        
    }else{
        let images=[];
        let videos=[];
        let st=1;
        while(nextButton!=null){ 
            await wait(1000);
            let displayed = await tab.$$(".Ckrof");

            let neededDisplay;
            if(st==1){
                neededDisplay = displayed[0];
                st++;
            }else{
                neededDisplay = displayed[1];
            }
            
            image = await neededDisplay.$(".ZyFrc img[class='FFVAD']");
            if(image==null){
                let video = await neededDisplay.$(".tWeCl");
                let videoExact = await tab.evaluate(function(ele){
                    return ele.getAttribute("src");
                },video);
                videos.push(videoExact);
                await nextButton.click();
                wait(1000);
                nextButton = await tab.$("._6CZji");
                
            }else{
                console.log("Not Null")
                let imageExact = await tab.evaluate(function(ele){
                    return ele.getAttribute("src");
                },image);
                images.push(imageExact);
                await wait(1000);
                await nextButton.click();
                // wait(1000);
                nextButton = await tab.$("._6CZji");
            }
        }
        await wait(2000);
        let displayed = await tab.$$(".Ckrof");
        let neededDisplay = displayed[displayed.length-1];
        image=await neededDisplay.$(".ZyFrc img[class='FFVAD']");
        if(image==null){
            let video = await neededDisplay.$(".tWeCl");
            let videoExact = await tab.evaluate(function(ele){
                return ele.getAttribute("src");
            },video);
            videos.push(videoExact);
            
        }else{
            let imageExact = await tab.evaluate(function(ele){
                return ele.getAttribute("src");
            },image);
            images.push(imageExact);
        }
        for(let i of images){
            await tab.goto(i);
            let actualImage = await tab.$("img");
            let data = await tab.evaluate(function(){
                return confirm("Want to download this Image then press 'Ok'");
            })
            if(data){
                await actualImage.screenshot({path:`${pathToDownloadFolder}/downloadedImage${no_of_images}.png`});
                no_of_images++;
            }
        }
        for(let i of videos){
            await downloadVideo(i);
        }
    }
}
async function downloadVideo(videoUrl){
    const brow = await pup.launch({
        executablePath: chromePath,
        headless:false,
        defaultViewport:false,
        args:["--start-maximized"],
      })
    let pages = await brow.pages();
    let tab = pages[0];
    await tab.goto(videoUrl);
    await wait(2000);
    let data = await tab.evaluate(function(){
        return confirm("Want to download this Video then press 'Ok'");
    })
    if(data){
        await tab.click("video");
        await wait(500);
        await tab.keyboard.press("Tab");
        await wait(500);
        await tab.keyboard.press("Tab");
        await wait(500);
        await tab.keyboard.press("Tab");
        await wait(500);
        await tab.keyboard.press("Tab");
        await wait(500);
        await tab.keyboard.press("Tab");
        await wait(500);
        await tab.keyboard.press("Enter");
        await wait(500);
        await tab.keyboard.press("ArrowUp");
        await wait(500);
        await tab.keyboard.press("Enter");
        await wait(3000);
        await brow.close();
    }else{
        await brow.close();
    }
    
}
main();