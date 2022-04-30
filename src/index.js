import "./css/index.scss";
import {default_sou, set_sou, sou, sousearch} from "./js/sousuo"
import {memory, throttle} from "jsb-util";
import {install} from "./js/menu.jsx";
import bus from "/src/js/bus"
import axios from "axios";

let token = false;
axios.defaults.baseURL = "";
if (location.hostname === "localhost") {
    axios.defaults.baseURL = "https://web.png.ink"
    token = "a63d21e1946cf0746056c75550a787c6" //开发环境的token
}
window.scrolllock = false;
axios.interceptors.request.use((config) => {
    config.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
    if (config.method === "post")
        if (token)
            if (typeof config.data == "object")
                config.data['token'] = token
            else
                config.data = {token: token}
    config.transformRequest = [
        function (data) {
            let ret = '';
            for (let it in data) {
                // 中文编码
                if (data[it] != '' || data[it] == 0) {
                    //值为空的全部剔除
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                }
            }
            return ret;
        },
    ];
    return config
})
install(Vue);
const vm = new Vue({
    el: '#root',
    data() {
        return {
            searchPreview: false,
            searchList: [],
            history: memory.get("history") || [],
            search: '',
            drawer: false,
            souStatus: false,
            sou: sou,
            default_sou,
            touch: {
                y: 0,
                time: 0
            },
            list: memory.get("list") || [],
            lists: [],
            mouseRight: {
                x: 0,
                y: 0,
            },
            tabbar: []
        }
    },
    methods: {
        search_go() {
            if (this.CHECK_URL(this.search)) {
                if (/^http/.test(this.search)) {
                    location.href = this.search;
                } else {
                    location.href = "//" + this.search;
                }
                return;
            }
            sousearch(this.search)
        },
        /**
         * 正则表达式判定Url
         * @param url
         * @returns {Boolean}
         */
        CHECK_URL(url) {
            //url= 协议://(ftp的登录信息)[IP|域名](:端口号)(/或?请求参数)
            var strRegex = '^((https|http|ftp)://)?'//(https或http或ftp):// 可有可无
                + '(([\\w_!~*\'()\\.&=+$%-]+: )?[\\w_!~*\'()\\.&=+$%-]+@)?' //ftp的user@  可有可无
                + '(([0-9]{1,3}\\.){3}[0-9]{1,3}' // IP形式的URL- 3位数字.3位数字.3位数字.3位数字
                + '|' // 允许IP和DOMAIN（域名）
                + '(localhost)|'	//匹配localhost
                + '([\\w_!~*\'()-]+\\.)*' // 域名- 至少一个[英文或数字_!~*\'()-]加上.
                + '\\w+\\.' // 一级域名 -英文或数字  加上.
                + '[a-zA-Z]{1,6})' // 顶级域名- 1-6位英文
                + '(:[0-9]{1,5})?' // 端口- :80 ,1-5位数字
                + '((/?)|' // url无参数结尾 - 斜杆或这没有
                + '(/[\\w_!~*\'()\\.;?:@&=+$,%#-]+)+/?)$';//请求参数结尾- 英文或数字和[]内的各种字符

            var strRegex1 = '^(?=^.{3,255}$)((http|https|ftp)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/)?(?:\/(.+)\/?$)?(\/\w+\.\w+)*([\?&]\w+=\w*|[\u4e00-\u9fa5]+)*$';
            var re = new RegExp(strRegex, 'i');//i不区分大小写
            console.log(re);
            //将url做uri转码后再匹配，解除请求参数中的中文和空字符影响
            if (re.test(encodeURI(url))) {
                return (true);
            } else {
                return (false);
            }
        },
        to({url}) {
            const index = this.lists.findIndex(el => el.url === url)//查找本地的信息
            const info = this.lists[index];
            const index1 = this.history.findIndex(it => it.url === url);
            if (index1 > -1) {//如果历史记录存在，则删除
                this.history.splice(index1, 1)
            }
            if (index > -1) {
                if (this.history.length === 8) {
                    this.history.pop();
                }
                this.history.unshift({
                    url: url,
                    title: info.title,
                    description: info.description
                })//删除后向数组最开始插入数据

                memory.set("history", this.history.slice(0, 8));
            }
            const tempwindow = window.open();
            tempwindow.location = url;
        }
        ,
        getIcon(item) {
            if (item.url) {
                let str = ""
                try {
                    str = "https://favicon.rss.ink/v1/" + btoa(encodeURI(item.url));
                } catch (e) {
                    console.log(e);
                    console.log(item)
                    console.log(item.url)
                }
                return str
            }
        }
        ,
        login() {
            location.href = '/index.php?c=login'
        },
        mouseMenu(event) {
            const {clientX, clientY} = event;
            event.preventDefault()
        }
        ,
        setsou(item) {
            set_sou(item);
            this.default_sou = item;
            this.souStatus = false
        }
        ,
        async fetchData() {
            let data = (await axios.get("/index.php?c=api&method=category_list&limit=999999")).data
            let list = (await axios.post('/index.php?c=api&method=link_list&limit=999999')).data
            vm.lists = list.data
            memory.set("lists", list.data)
            //下面是将目录和列表合并。将列表加入目录children里
            let menu = data.data;
            list.data.forEach((item) => {
                const {category_name: name} = item;
                const index = menu.findIndex(el => el.name === name);
                if (!menu[index].children) {
                    menu[index].children = [];
                }
                menu[index].children.push(item)
            })
            vm.list = menu
            memory.set("list", menu)
            await this.$nextTick(_ => {
                sumicon()
            })
        }
        ,
        searchPreviewRender() {
            const val = this.search
            // this.searchPreview = val.split("").length > 0;
            const list = memory.get("lists") || []
            let tmp = [];
            list.forEach(el => {
                if (el.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) {
                    tmp.push({
                        title: el.title.replace(RegExp(this.search, "ig"), `<b>${this.search}</b>`),
                        url: el.url,
                        description: el.description
                    })
                }
            })
            this.searchPreview = Boolean(tmp.length > 0)
            // if (!this.searchPreview) {
            //     $.ajax({
            //         url: 'https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc',
            //         dataType: 'jsonp',
            //         jsonp: 'cb',
            //         data: {wd: this.search},
            //         success: function (msg) {
            //             console.log(msg.g)
            //         }
            //     })
            // }
            this.searchList = tmp.slice(0, 10)
            if (this.drawer)
                this.drawer = false;
        }
        ,
        closePreview() {
            setTimeout(_ => {
                this.searchPreview = false
            }, 100)
        }
    },
    async mounted() {
        await this.fetchData()
        bus.$on("delhistory", (e) => {
            const index = this.history.findIndex(it => it.url === e);
            this.history.splice(index, 1)
            memory.set("history", this.history)
        })
    }
    ,
    watch: {
        search(val) {
            this.searchPreviewRender()
        }
        ,
        drawer(val) {
            if (val)
                vm.searchPreview = false
        }
    }
})
//监听鼠标滚动
window.addEventListener("wheel", (event) => {
    if (window.scrolllock) return;
    let fangxiang = Boolean(event.deltaY > 0);
    const drawer = document.querySelector(".drawer-main");
    if (fangxiang) {
        if (!vm.drawer)
            setTimeout(_ => {
                drawer.style.overflowY = "scroll"
            }, 200)
        vm.drawer = true;
    } else {
        if (drawer.scrollTop !== 0) return;
        vm.drawer = false;
        drawer.style.overflowY = "hidden"
    }
})
document.querySelector(".drawer-main").addEventListener('touchmove', function (event) {
    event.stopPropagation();
}, {passive: false})

//监听面触摸滑动事件
document.querySelector("#root").addEventListener("touchstart", function (event) {
    if (scrolllock) return
    let y = event.touches[0].clientY;
    vm.touch = {
        y: y,
        time: new Date().getTime()
    }
})
//页面滑动结束事件
document.querySelector("#root").addEventListener("touchend", function (event) {
    if (scrolllock) return
    let y = event.changedTouches[0].clientY;
    let t = new Date().getTime();
    if (y === vm.touch.y) {
        return false;
    }
    if (t - 300 < vm.touch.time) {
        if (y + 100 < vm.touch.y) {
            vm.drawer = true;
        } else if (y - 100 > vm.touch.y) {
            if (document.querySelector(".drawer-main").scrollTop !== 0) return;
            vm.drawer = false;
        }
    }
})
//阻止冒泡
document.querySelector("#root").addEventListener("touchmove", function (e) {
    e.stopPropagation();
    e.preventDefault()
}, {passive: false})

function sumicon() {
    let w = outerWidth - 60;
    let auto = Math.floor(w / 100);
    let l = w / auto
    if (outerWidth > 501) {
        document.querySelectorAll(".dreaer-list").forEach(el => {
            el.style.width = l + 'px';
        })
    } else {
        document.querySelectorAll(".dreaer-list").forEach(el => {
            el.style.width = "";
        })
    }
}

sumicon();
window.addEventListener("resize", throttle(sumicon, 200))

bus.$on("cc", function () {
    //打开抽屉
    vm.drawer = true
})

window.base64ToBlob = (urlData, type) => {
    let arr = urlData.split(',');
    let mime = arr[0].match(/:(.*?);/)[1] || type;
    let bytes = window.atob(arr[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: mime
    });
}
let base = memory.get("bg");
if (base) {
    if (base.length < 100) {
        memory.del('bg')
    } else {
        base64ToBlob(base)
        const bz = URL.createObjectURL(base64ToBlob(base))
        document.querySelector("#root").style.background = `url(${bz}) no-repeat center/cover`
    }
}
