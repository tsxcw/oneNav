exports.install = function install(Vue) {
    Vue.component('men_add',
        {
            template: (`
                 <el-dialog :close-on-click-modal="false" append-to-body :visible.sync="dialogVisible" title="添加链接" width="500px">
                     <div class="menu_add">
                         <el-input placeholder="请输入完整的网址链接" v-model="addInfo.url"></el-input>
                         <el-input placeholder="请输入备用链接，没有请留空" v-model="addInfo.burl"></el-input>
                         <el-input placeholder="请输入标题" v-model="addInfo.title"></el-input>
                         <el-input placeholder="请输入站点面熟（完整）" show-word-limit maxlength="300" type="textarea" v-model="addInfo.tips"></el-input>
                    </div>
                     <span slot="footer" class="dialog-footer">
                       <el-button @click="dialogVisible = false">取 消</el-button>
                       <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                      </span>
                 </el-dialog>
                `),
            methods: {},
            data() {
                return {
                    dialogVisible: false,
                    addInfo: {
                        url: '',
                        burl: '',
                        title: '',
                        tips: ''
                    }
                }
            },
            watch: {
                dialogVisible(e) {
                    if (e === false) {
                        window.scrolllock = false
                    } else if (e === true) {
                        window.scrolllock = true;
                    }
                }
            }
        })


    Vue.component("tabar", {
        template: (`<div v-show="show" class="tabar" :style="{left:mouseRight.x,top:mouseRight.y}">
                        <div>新增目录</div>
                        <div>删除目录</div>
                        <div>新增链接</div>
                        <div>删除链接</div>
                    </div>`),
        data() {
            return {
                mouseRight: {
                    x: 0,
                    y: 0
                },
                show: false
            }
        },
        props: ["xy", "type"],
        methods: {},
        mounted() {
            document.querySelector(".tabar").addEventListener("click", function (event) {
                event.stopPropagation();
                event.preventDefault();
            })
            document.addEventListener("click", (event) => {
                this.show = false;
            })
            window.addEventListener("mouseup", (e) => {
                this.mouseRight = {
                    x: e.clientX + 'px',
                    y: e.clientY + 'px'
                }
                console.log(e)
                if (e.button === 2) {
                    this.show = true;
                }

                e.preventDefault()
                e.stopPropagation();
            })
        },
        watch: {
            xy({x, y}) {
                console.log(x, y)
                this.show = true;
                this.mouseRight = {
                    x: x + 'px',
                    y: y + 'px'
                }
            },
            type() {

            }
        }
    })
}
