import "./css/index.scss";
import {default_sou, set_sou, sou, sousearch} from "./js/sousuo"
import {memory, throttle} from "jsb-util";
import {install} from "./js/menu.jsx";

window.scrolllock = false;
install(Vue);
const vm = new Vue({
    el: '#root',
    data() {
        return {
            search: '',
            drawer: false,
            souStatus: false,
            mouse: {
                last: 0,
                time: 0
            },
            sou: sou,
            default_sou,
            touch: {
                y: 0,
                time: 0
            },
            list: memory.get("list") || []
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
            event.preventDefault()
        },
        setsou(item) {
            set_sou(item);
            this.default_sou = item;
            this.souStatus = false
        },
        async fetchData() {
            let data = await (await fetch("https://web.png.ink/index.php?c=api&method=category_list",)).json()
            console.log(data)
            let list = await (await fetch('https://web.png.ink/index.php?c=api&method=link_list', {
                method: 'post',
                body: JSON.stringify({
                    category_id: data.data[0].id
                })
            })).json()
            vm.list = list.data
            memory.set("list", vm.list)
        }
    },
    async mounted() {
        await this.fetchData()
    }
})

//监听鼠标滚动
window.addEventListener("wheel", (event) => {
    if (scrolllock) return
    let t = new Date().getTime();
    if (t - 100 > vm.mouse.time) {
        if (event.deltaY > vm.mouse.last) {
            if (!vm.drawer)
                vm.drawer = true;
        } else if (event.deltaY < vm.mouse.last) {
            if (vm.drawer)
                vm.drawer = false;
        }
        vm.mouse.time = t;
        vm.mouse.last = event.deltaY;
    }
})
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
    console.log(y, vm.touch.time)
    if (t - 500 < vm.touch.time) {
        if (y + 100 < vm.touch.y) {
            vm.drawer = true;
        } else if (y - 100 > vm.touch.y) {
            vm.drawer = false;
        }
    }
})
document.addEventListener("touchmove", function (e) {
    e.preventDefault()
}, {passive: false})

function sumicon() {

    let w = document.querySelector(".drawer-main").clientWidth - 60;
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
