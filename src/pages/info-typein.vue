<template>

   <div class="typein-container"  v-loading.fullscreen="fullscreenLoading" >
        <div class="typein-nav">
            <!-- 当tab数目多时，建议用路由配置+子组件，tab动态渲染v-for -->
             <el-tabs>
                <el-tab-pane label="关键词录入">
                    <div class="filter-topic form-item">
                        <span class="tag-key">主题</span>
                        <el-radio-group v-model="userChoice.chosenTopic" size="small">
                          <el-radio-button v-for="topic in topics"  :label="topic.id">{{topic.name}}</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="filter-category form-item">
                        <span class="tag-key">分类</span>
                        <el-select v-model="userChoice.chosenCategories" multiple size="small">
                            <el-option
                              v-for="item in categories"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="file-upload form-item">
                        <span class="tag-key">关键词</span>
                        <el-upload
                          v-if="shouldUpload"
                          action="/sample/upload"
                          type="drag"
                          accept =".xlsx,.doc,.txt,.xls,.docx"
                          :data="userChoice"
                          :multiple="false"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :before-upload = "saveFileData"
                          :on-success="handleUploadState.bind(this,'success')"
                          :on-error="handleUploadState.bind(this,'error')"
                        >
                          <i class="el-icon-upload"></i>
                          <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                        <el-input
                            v-else
                            class="own_textarea"
                            style="display: inline-block"
                            type="textarea"
                            placeholder="请以换行的方式分割关键词"
                            :autosize="{minRows: 8, maxRows: 10}"
                            v-model="userChoice.text">
                        </el-input>
                    </div>

                    <div class="button-group form-item">
                        <el-button v-show="shouldUpload" size="small" type="success" @click.native="editWord">手动编辑</el-button>
                        <el-button v-show="!shouldUpload" size="small" @click.native="cancelUpload">取消</el-button>
                        <el-tooltip class="item" effect="dark" content="请确保分类及主题已选择" placement="top-start">
                            <el-button type="primary" size="small" :disabled="isUploadDisabled" @click.native="typeinWords">上传</el-button>
                        </el-tooltip>


                    </div>


                </el-tab-pane>
                <el-tab-pane label="其他录入"></el-tab-pane>
            </el-tabs>
        </div>

   </div>

</template>

<script>
import { urls } from '../../utils/constants.js';

export default {
  components: {
  },

  created(){
    //fetch subject and category

  },

  data(){
    return {
        // topics: this.$parent.subjects,
        // categories: this.$parent.categories,
        userChoice:{
            userId: this.$parent.curUser.userId,
            chosenCategories: [],
            chosenTopic: -1
        },
        topics:[],
        categories:[],
        fullscreenLoading: false,
        shouldEdit: false,
        shouldUpload: true
        // uploadFunc: null,
    }
  },

  computed:{
    // topics(){
    //     return this.$parent.subjects;
    // },

    // categories(){
    //     return this.$parent.categories.slice(1);
    // },
    canBeMounted(){
      return (this.topics && this.categories && this.topics.length>0 && this.categories.length>0);
    },

    isUploadDisabled(){
      return this.userChoice.chosenTopic===-1 || this.userChoice.chosenCategories.length<=0;
    }
  },


  methods:{
    showMessage(message,type){
        this.$message({message,type});
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    handlePreview(file) {
        console.log(file);
        this.showMessage("文件上传成功","success");
    },

    // validateBeforeUpload(){

    //   if(this.userChoice.chosenTopic===-1 || this.userChoice.chosenCategories.length<=0){
    //     this.showMessage("请选择分类及主题","error");
    //     return false;
    //   }
    //   return true;
    // },

    saveFileData(file){
        // this.shouldUpload = false;
        // debugger;
        // console.log(file);
        // this.userChoice.file = file;
        // return false;
        // var _this = this;
        // var reader = new FileReader();
        // var str = "";
        // reader.onload = function () {
        //     that.userChoice.text = this.result;
        // };
        // reader.readAsText(file);
        //
        if(file)
          this.showMessage("加载成功，请上传！","success");
        const that = this;
        return new Promise((resolve,reject)=>{
            that.$once("upload",resolve);
        });

    },
    cancelUpload() {
        this.shouldUpload = true;
        this.shouldEdit = false;
        this.userChoice.text = "";
    },
    editWord() {
        this.userChoice.text = '';
        this.shouldUpload = false;
        this.shouldEdit = true;
    },
    handleUploadState(state){
        if(state==="success")
            this.showMessage("关键词录入成功","success");
        else
            this.showMessage("关键词录入失败","error");
    },
    typeinWords(){

        if(this.isUploadDisabled) {
          this.showMessage("请选择分类及主题","error");

          return;
        }

        if(this.shouldEdit) {
            this.$http.post("/sample/save",{
                chosenCategories: this.userChoice.chosenCategories,
                chosenTopic: this.userChoice.chosenTopic,
                text: this.userChoice.text
            })
            .then((response)=>{
                this.$notify({
                    type: "success",
                    message: "关键词录入成功"
                })
            },((err)=>{

            }))
        } else {
            this.$emit("upload");
        }



/*
        const formData = new FormData();
        Object.keys(this.userChoice).forEach(key=>{
          formData.append(key,this.userChoice[key]);
        });


        console.log("dffff",this.userChoice);
        this.$http.post(urls.upload,JSON.stringify(this.userChoice))
                    .then(response=>{
                      //文件预览
                        this.showMessage("关键词录入成功","success")
                    })
                    .catch(err=>{
                        console.log(" 关键词录入失败 ",err);
                        this.showMessage("关键词录入失败","error");
                    })
*/
    }
  },

  mounted(){
    //fetch topic + category
    this.fullscreenLoading = true;

    let promises = [urls.topic,urls.category].map((url,index)=> this.$http.get(url,{params:{type:index}}));

    const that = this;

    Promise.all(promises).then(results=>{
        that.fullscreenLoading = false;

        [that.topics, that.categories] = results.map(result=>{
          const key = Object.keys(result.body).filter(key=>key.search(/List/)!==-1)[0];
          return result.body[key];
        });

    }).catch(reasons=>{
        console.log(reasons);
        that.fullscreenLoading = false;
        that.showMessage("oops,获取信息失败","error");

    });
  }
};
</script>

<style>
.own_textarea textarea {
    width: 360px;
}
</style>
