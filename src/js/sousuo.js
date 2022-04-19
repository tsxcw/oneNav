const sou = [
    {
        name: '百度'
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

function sousearch(text, sou) {
    location.href = `${sou}?w=${text}`
}

exports.sousearch = sousearch;
exports.sou = sou;
