import { html } from 'cheerio/lib/api/manipulation';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
const seenUrls = {};
 
const getUrl = (link) => {
    if(link.includes('http')){
        return link;
    }else if(link.startsWith("/s")){
        return `url${link}`;
    }else{
        return `url${link}`;
    }
}

const crawl = async ({url}) => {
    if(!seenUrls[url]){
    seenUrls[url]= true;
    const response = await fetch(url);
    const html = await response.text();
    console.log("html", html);
    const $ = cheerio.load(html)
    

    const links = $('a')
        .map((i, link) => link.attribs.href)
        .get();
    // we look for the image tags
    const imageUrls = $("img")
        .map((i, link) => link.attribs.src)
        .get();

        imageUrls.forEach(imageUrl => {
            fetch(getUrl(imageUrl)).then(response => {
                const filename = path.basename(imageUrl);
                const dest = fs.createWriteStream(`images/${filename}`);
                response.body?.pipe(dest);
            })
        })

    
    console.log("images", imageUrls)
    console.log(links);
    links.forEach(link => {
    crawl({
        url: getUrl(link),
    })
})
}};
