const fs = require("fs");
const cheerio = require("cheerio")
const newPath = "./dist/index.php"
const oldPath = "./dist/index.html"
if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath)
}
const html = fs.readFileSync(newPath).toString();
const $ = cheerio.load(html);
$("script").map(el => {
        const element = $("script")[el]
        const url = element.attribs.src;
        if (url.slice(0, 4) !== 'http') {
            $("script")[el].attribs.src = "/templates/tushan/" + url
        }
    }
)
$("link").map(el => {
        const element = $("link")[el]
        const url = element.attribs.href;
        if (url.slice(0, 4) !== 'http') {
            $("link")[el].attribs.link = "/templates/tushan/" + url
        }
    }
)
fs.writeFileSync(newPath, $.html())
