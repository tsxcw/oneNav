import "./css/index.scss";
import {default_sou, set_sou, sou, sousearch} from "./js/sousuo"
import {memory, throttle} from "jsb-util";
import {install} from "./js/menu.jsx";
import bus from "/src/js/bus"
import axios from "axios";
import md5 from "js-md5"

const option = [{
    icon: require("/src/assets/bilibili.png"),
    name: 'bilibili',
    href: 'https://bilibili.com'
}, {
    icon: require("/src/assets/csdn.png"),
    name: 'csdn',
    href: 'https://csdn.com'
}]
axios.defaults.baseURL = "https://web.png.ink"
const token = md5("xiaozxiaoz.me")
window.scrolllock = false;
axios.interceptors.request.use((config) => {
    config.headers['Content-Type'] = "application/x-www-form-urlencoded; charset=UTF-8";
    if (config.method === "post")
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
            lists: option,
            mouseRight: {
                x: 0,
                y: 0,
            }
        }
    },
    methods: {
        search_go() {
            sousearch(this.search)
        },
        to({url}) {
            location.href = url;
        },
        getIcon(item) {
            if (item.url)
                return "https://favicon.rss.ink/v1/" + btoa(item.url);
        },
        mouseMenu(event) {
            const {clientX, clientY} = event;
            // vm.mouseRight = {
            //     x: clientX,
            //     y: clientY
            // }
            event.preventDefault()
        },
        setsou(item) {
            set_sou(item);
            this.default_sou = item;
            this.souStatus = false
        },
        async fetchData() {
            let data = (await axios.get("https://web.png.ink/index.php?c=api&method=category_list")).data
            let list = (await axios.post('https://web.png.ink/index.php?c=api&method=link_list&limit=999999')).data
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
        },
        async addMenu() {
            axios.post("", {})
        }
    },
    async mounted() {
        await this.fetchData()
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
    vm.drawer = true
})
