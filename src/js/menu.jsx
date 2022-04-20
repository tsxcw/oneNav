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
}
