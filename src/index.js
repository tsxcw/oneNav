import "./css/index.scss";
import Vue from './js/vue'

const vm = new Vue({
    el: '#root',
    data() {
        return {
            search: ''
        }
    }
})


window.addEventListener("wheel", (event) => {
    console.log(event)
})
