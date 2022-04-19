const sou = [
    {
        name: '百度',
        href: "https://www.baidu.com/s?&ie=utf-8&word=$key"
    },
    {
        name: '搜狗'
    },
    {
        name: '360'
    },
    {
        name: '谷歌'
    },
    {
        name: '必应'
    }
]

function sousearch(text) {
    location.href = sou[0].href.replace(/\$key/, text)
}

exports.sousearch = sousearch;
exports.sou = sou;
