const {memory} = require("jsb-util");

const baidu = require("/src/assets/baidu.svg");
const google = require("/src/assets/google.svg");
const sougou = require("/src/assets/sougou.svg");
const s360 = require("/src/assets/360.svg")
const bing = require("/src/assets/bing.svg")

const sou = [
    {
        name: '百度',
        href: "https://www.baidu.com/s?&ie=utf-8&word=$key",
        icon: baidu
    },
    {
        name: '谷歌',
        href: 'https://www.google.com/search?q=$key',
        icon: google
    },
    {
        name: '搜狗',
        href: "https://www.sogou.com/web?query=$key",
        icon: sougou
    },
    {
        name: '360',
        href: 'https://www.so.com/s?ie=utf-8&q=$key',
        icon: s360
    },
    {
        name: '必应',
        href: 'https://cn.bing.com/search?q=$key',
        icon: bing
    }
]
let default_sou = memory.get("sou") || sou[0];
set_sou(default_sou)

function sousearch(text) {
    location.href = default_sou.href.replace(/\$key/, text)
}

/**
 * 设置搜索引擎
 * @param item
 */
function set_sou(item) {
    default_sou = item;
    memory.set("sou", item)
}

exports.sousearch = sousearch;
exports.set_sou = set_sou
exports.default_sou = default_sou;
exports.sou = sou;
