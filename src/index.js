import "./css/index.scss";
import {sou, sousearch} from "./js/sousuo"

const vm = new Vue({
    el: '#root',
    data() {
        return {
            search: '',
            drawer: false,
            mouse: {
                last: 0,
                time: 0
            },
            sou: sou,
            touch: {
                y: 0,
                time: 0
            }
        }
    },
    methods: {
        search_go() {
            sousearch(this.search)
        }
    }
})
window.addEventListener("wheel", (event) => {
    let t = new Date().getTime();
    if (t - 100 > vm.mouse.time) {
        if (event.deltaY > vm.mouse.last) {
            console.log("shang")
            if (!vm.drawer)
                vm.drawer = true;
        } else if (event.deltaY < vm.mouse.last) {
            console.log("xia")
            if (vm.drawer)
                vm.drawer = false;
        }
        vm.mouse.time = t;
        vm.mouse.last = event.deltaY;
    }
})

window.addEventListener("touchstart", function (event) {
    let y = event.touches[0].clientY;
    vm.touch = {
        y: y,
        time: new Date().getTime()
    }
})
window.addEventListener("touchend", function (event) {
    let y = event.changedTouches[0].clientY;
    let t = new Date().getTime();
    if (y == vm.touch.y) {
        return false;
    }
    console.log(y, vm.touch.time)
    if (t - 500 < vm.touch.time) {
        if (y + 100 < vm.touch.y) {
            console.log("shang")
            vm.drawer = true;
        } else if (y - 100 > vm.touch.y) {
            console.log("xia")
            vm.drawer = false;
        }
    }
})
document.addEventListener("touchmove", function (e) {
    e.preventDefault()
}, {passive: false})
