<template>

     <div id="evolve-main">
		<div class="left-container left">
			<div v-for="(title,name) in titleList" class="title-container">
				<div @click="title_click(title)" class="title-div pointer">
					{{title.name}}
					<div @click.stop.prevent="add_topic(title)" class="title-button" style="float:right;padding-right:10px;">+</div>
				</div>
				<div @click="topic_click(topic,titleList)" v-for="(topic, key) in title.children" v-show="title.showflag" class="topic-div pointer" :class="{'topic-current':topic.isCurrent}">
					- {{topic.name}}
					<div @click.stop.prevent="del_topic(topic,name,key)" class="title-button" style="float:right;padding-right:20px;">×</div>
				</div>
			</div>
		</div>
		<div class="right-container left">
			<div class="right-tab">
				<div v-for="tab in tabList" @click="tab_click(tab,tabList)" class="left right-tab-div pointer" :class="{'tab-current':tab.isCurrent}">{{tab.name}}</div>
			</div>
			<div class="right-content">
				<evolve-export v-show="tabList[0].isCurrent" :id="topicCurrent" :topic="titleCurrent"></evolve-export>
				<evolve-analysis v-show="tabList[1].isCurrent" :id="topicCurrent"></evolve-analysis>
			</div>
		</div>
	 </div>

</template>

<script>
import EvolveExport from "./evolve-export";
import EvolveAnalysis from "./evolve-analysis";

export default {
	data(){
		return {
			titleList:[],
			tabList:[
				{
					name:"关键词配置",
					isCurrent:true
				},
				{
					name:"命中统计",
					isCurrent:false
				}
			],
			topicCurrent:"",
            titleCurrent:""
		}
	},
	created(){
		var temp = [];
		this.$http.get('keyword/loadTitle',{

		}).then((response) => {
			// success callback
			temp = response.body.titleList;
			for(var key in temp){
				temp[key].showflag = false;
				for(var topic in temp[key].children){
					temp[key].children[topic].isCurrent = false;
				}
			}
			this.titleList = temp;

            if(temp.length != 0)
                this.titleCurrent = temp[0].id;
            else {
                alert("无可用专题");
            }
		}, (response) => {
			// error callback
			alert("专题加载错误");
		});
	},
	components: {
		EvolveExport,
		EvolveAnalysis
	},
	computed:{

	},

	methods:{
		title_click:function(title){
			title.showflag = !title.showflag;
		},
		add_topic:function(title){
			this.tabList[0].isCurrent = true;
			this.tabList[1].isCurrent = false;

			if(this.topicCurrent == ""){
				if(confirm("是否放弃当前未保存的专题"))
					this.topicCurrent = null;
				else
					return;
			}
			else
				this.topicCurrent = "";
            this.titleCurrent = title.id;
		},
		tab_click:function(tab,tabList){
			if(tab.name != "关键词配置" && this.topicCurrent == ""){
				alert("请选择专题");
				return;
			}
			for(var key in tabList){
				tabList[key].isCurrent = false;
			}
			tab.isCurrent = true;
		},
		topic_click:function(topic,titleList){
			this.topicCurrent = topic.id;

			for(var key in titleList){
				for(var obj in titleList[key].children){
					titleList[key].children[obj].isCurrent = false;
				}
			}
			topic.isCurrent = true;
		},
		del_topic:function(topic,title,key){
			if(confirm("确定要删除专题：" + topic.name + " 吗？")){
				this.$http.get('keyword/delTopic',{
					params:{
						id:topic.id
					}
				}).then((response) => {
					// success callback
					if(response.body.flag){
						alert("删除成功");
						this.titleList[title]["children"].splice(key,1);
					}						
				}, (response) => {
					// error callback
					alert("专题删除错误");
				});	
			}
						
		}
	}
};
</script>

<style>
/*container*/
#evolve-main{
	height:700px;
	background:white;
}

.left-container{
	width:20%;
	height:100%;

	padding:20px;
	overflow:auto;
}

.right-container{
	padding:20px;
	width:80%;
	height:100%;

	display:flex;
	flex-direction:column;
}

/*title*/
.title-container{
	border:1px solid #999d9c;
}

.title-div{
	padding:5px 0px 5px 10px;
	font-size:1rem;
	font-family:"黑体";
	color:white;

	background:#3f3f3f;
}

.topic-div{
	padding:5px 0px 5px 20px;

	font-size:1rem;
	font-family:"微软雅黑";
	color:black;

	background:white;
}

.topic-div:hover{
	background:steelblue;
}

.topic-current{
	color:white;
	background:steelblue;
}

.title-button:hover{
	color:red;
}

/*content*/
.right-tab{
	width:100%;
	height:3rem;
}

.right-tab-div{
	margin:5px;
	font-size:0.9rem;
	font-family:"微软雅黑";
	padding:5px 20px 5px 20px;
	border-bottom:1px solid gray;

}

.right-tab-div:hover{
	border-bottom:3px solid steelblue;
	color:steelblue
}

.tab-current{
	border-bottom:3px solid steelblue;
	color:steelblue
}


.right-content{
	width:100%;
	flex:1;
	overflow:auto;
}

.left{
	float:left;
}

.right{
	float:right;
}
.pointer{
	cursor:pointer;
}
</style>
