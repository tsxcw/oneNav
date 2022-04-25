const bus = require("./bus");
const axios = require("axios");
const {memory} = require("jsb-util");
exports.install = function install(Vue) {
    Vue.component('add_link',
        {
            template: (`
                 <el-dialog :close-on-click-modal="false" append-to-body :visible.sync="dialogVisible" title="添加链接" width="500px">
                     <div class="menu_add">
                         <el-input placeholder="请输入完整的网址链接" v-model="addInfo.url"></el-input>
                         <el-input placeholder="请输入备用链接，没有请留空" v-model="addInfo.url_standby"></el-input>
                         <el-input placeholder="请输入标题" v-model="addInfo.title"></el-input>
                         <el-input placeholder="请输入站点描述（完整）" show-word-limit maxlength="300" type="textarea" v-model="addInfo.description"></el-input>
                         <div class="other">
                         <el-select v-model="addInfo.fid" placeholder="请选择目录">
                            <el-option :value="it.id" :label="it.name" v-for="(it,index) in option" :key="index"></el-option>
                         </el-select>
                         <el-input placeholder="权重（0-99）" v-model="addInfo.weight"></el-input>
                         <el-switch
                        v-model="addInfo.property"
                        active-color="#13ce66"
                        inactive-text="是否公开"
                        inactive-color="#ff4949">
                        </el-switch>
                         </div>
                    </div>
                     <span slot="footer" class="dialog-footer">
                       <el-button @click="dialogVisible = false">取 消</el-button>
                       <el-button type="primary"  @click="submit">确 定</el-button>
                      </span>
                 </el-dialog>
                `),
            methods: {
                submit(type) {
                    const data = {...this.addInfo};
                    let url = ""
                    if (this.isedit) {
                        url = "/index.php?c=api&method=edit_link"
                    } else {
                        url = "/index.php?c=api&method=add_link"
                    }
                    data.property = this.addInfo.property ? 0 : 1;
                    axios.post(url, data).then(e => {
                        const {code} = e.data;
                        if (code === 0) {
                            this.$message.success("添加成功")
                            setTimeout(_ => location.reload(), 1000)
                            this.dialogVisible = false
                        } else {
                            this.$message.error("添加失败")
                        }
                    })

                }
            },
            data() {
                return {
                    dialogVisible: false,
                    option: [],
                    addInfo: {
                        url: '',
                        weight: '',
                        title: '',
                        property: true,
                        fid: "",
                        url_standby: '',
                        description: ''
                    },
                    isedit: false
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
            },
            mounted() {
                bus.$on("show", () => {
                    this.option = memory.get("list") || [];
                    this.dialogVisible = true
                })
                bus.$on("showandupdate", (e) => {
                    this.addInfo = e
                    this.addInfo.property = e.property == 0 ? true : false
                    this.dialogVisible = true
                    this.isedit = true
                })
            }
        })


    Vue.component("tabar", {
        template: (`<div v-show="show" class="tabar" :style="{left:mouseRight.x,top:mouseRight.y}">
                        <div @click="addmenu">新增目录</div>
                        <div v-if="sunshow(2)" @click="delmenu" >删除目录</div>
                        <div class="addlink" @click="addlink">新增链接</div>
                        <div v-if="sunshow(3)" @click="dellink">删除链接</div>
                        <div v-if="sunshow(4)" @click="updatelink">修改链接</div>
                        <div @click="setting">个性设置</div>
                    </div>`),
        data() {
            return {
                mouseRight: {
                    x: 0,
                    y: 0
                },
                show: false,
                info: {},
                ctype: [],
                element: null
            }
        },
        props: ["xy", "type"],
        methods: {
            addmenu() {
                bus.$emit("menushow", true)
            },
            addlink() {
                bus.$emit("show", true)
            },
            async delmenu() {
                try {
                    await this.$confirm("是否删除？")
                } catch (e) {
                    return false;
                }
                axios.post("/index.php?c=api&method=del_category", {
                    id: this.info
                }).then(el => {
                    const {code} = el.data;
                    if (code === 0) {
                        this.element.parentNode.remove()
                        this.$message.success("删除成功")
                    } else {
                        this.$message.error("删除失败")
                    }
                })
            },
            async dellink() {
                try {
                    await this.$confirm("是否删除？")
                } catch (e) {
                    return false;
                }
                const lists = memory.get("lists") || []
                const index = lists.findIndex(e => e.id == this.info)
                if (index === -1) return false;
                const info = lists[index];
                axios.post("/index.php?c=api&method=del_link", {
                    id: info.id
                }).then(el => {
                    const {code} = el.data;
                    if (code === 0) {
                        this.element.remove()
                        this.$message.success("删除成功")
                    } else {
                        this.$message.error("删除失败")
                    }
                })
            },
            setting() {

            },
            updatelink() {
                const lists = memory.get("lists") || []
                const index = lists.findIndex(e => e.id == this.info)
                if (index === -1) return false;
                const info = lists[index];

                bus.$emit("showandupdate", info)
            },
            sunshow(index) {
                return Boolean(this.ctype.indexOf(index) > -1)
            }
        },
        mounted() {
            document.querySelector(".tabar").addEventListener("click", function (event) {
                event.stopPropagation();
                event.preventDefault();
            })
            document.addEventListener("click", (event) => {
                this.show = false;
            })

            window.addEventListener("mouseup", (e) => {
                if (e.button === 2) {
                    this.mouseRight = {
                        x: e.clientX + 'px',
                        y: e.clientY + 'px'
                    }
                    try {
                        let t = JSON.parse(e.toElement.attributes.ctype.value)
                        if (t.length > 0) {
                            this.ctype = t;
                        }
                    } catch (e) {
                        this.ctype = []
                    }
                    try {
                        let info = e.toElement.attributes.cdata.value;
                        this.info = info
                        this.element = e.target
                    } catch (e) {

                    }
                    this.show = true;
                    e.preventDefault()
                    e.stopPropagation();
                }
            })
        },
    })


    Vue.component('add_menus',
        {
            template: (`
                 <el-dialog :close-on-click-modal="false" append-to-body :visible.sync="dialogVisible" title="添加链接" width="500px">
                     <div class="menu_add">
                         <el-input placeholder="请输入分类名称" v-model="addInfo.name"></el-input>
                         <el-input placeholder="请输入站点描述（完整）" show-word-limit maxlength="300" type="textarea" v-model="addInfo.description"></el-input>
                         <div class="other">
                         <el-input placeholder="权重（0-99）" v-model="addInfo.weight"></el-input>
                         <el-switch
                             v-model="addInfo.property"
                             active-color="#13ce66"
                             inactive-text="是否公开"
                             inactive-color="#ff4949">
                        </el-switch>
                         </div>
                    </div>
                     <span slot="footer" class="dialog-footer">
                       <el-button @click="dialogVisible = false">取 消</el-button>
                       <el-button type="primary"  @click="submit">确 定</el-button>
                      </span>
                 </el-dialog>
                `),
            methods: {
                submit() {
                    const data = {...this.addInfo};
                    data.property = this.addInfo.property ? 0 : 1;
                    axios.post("/index.php?c=api&method=add_category", data).then(e => {
                        const {code} = e.data;
                        if (code === 0) {
                            this.$message.success("添加成功")
                            setTimeout(_ => location.reload(), 1000)
                            this.dialogVisible = false
                        } else {
                            this.$message.error("添加失败")
                        }
                    })

                }
            },
            data() {
                return {
                    dialogVisible: false,
                    option: [],
                    addInfo: {
                        name: '',
                        weight: '',
                        property: true,
                        description: ''
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
            },
            mounted() {
                bus.$on("menushow", () => {
                    this.option = memory.get("list") || [];
                    this.dialogVisible = true
                })
            }
        })

}
