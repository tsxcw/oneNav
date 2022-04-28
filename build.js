const fs = require("fs");
const path = require("path")
const cheerio = require("cheerio")
const newPath = "./dist/index.php"
const oldPath = "./dist/index.html"
const assetsPath = "/templates/tushan/"
//检查是否存在html文件，存在则改为php结尾
if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath)
}
const html = fs.readFileSync(newPath).toString();
const $ = cheerio.load(html);
const script = $("script")//修改script的标签地址
script.map(el => {
        const element = script[el]
        const url = element.attribs.src;
        if (url.slice(0, 4) !== 'http') {
            script[el].attribs.src = assetsPath + url
        }
    }
)
const link = $("link");//修改link标签的地址
link.map(el => {
        const element = link[el]
        const url = element.attribs.href;
        if (url.slice(0, 4) !== 'http') {
            link[el].attribs.href = assetsPath + url
        }
    }
)
$("title").text("<?php echo $site['title']; ?> - <?php echo $site['subtitle']; ?>")
let result = $.html();
//转义php标签为正常标签
result = result.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
fs.writeFileSync(newPath, result)


let config = fs.readFileSync(path.resolve("package.json"))//读取package配置的版本信息
config = JSON.parse(config.toString())
let info = fs.readFileSync(path.resolve("info.json"))
info = JSON.parse(info.toString())
info.version = config.version;
info.git = 'https://github.com/tsxcw/oneNav.git';
info.update = new Date().toLocaleDateString();
fs.writeFileSync(path.resolve("info.json"), JSON.stringify(info))//将package的配置版本信息写入资源info.json信息
fs.copyFileSync(path.resolve("info.json"), path.resolve("./dist/info.json"))//将配置移动到静态目录
