<template>
	<view class="addDb">
		<view class="form_box">
			<view class="px-input">
				<view class="title">名称：</view>
				<input class="uni-input" placeholder="输入名称" placeholder-class="placeholder" v-model="form_data.database" />
			</view>
			<view class="px-input">
				<view class="title">主机名/IP：</view>
				<input class="uni-input" type="text" placeholder="输入主机名/IP" placeholder-class="placeholder" v-model="form_data.hostname" />
			</view>
			<view class="px-input">
				<view class="title">用户：</view>
				<input class="uni-input" placeholder="输入用户名" placeholder-class="placeholder" v-model="form_data.username" />
			</view>
			<view class="px-input">
				<view class="title">密码：</view>
				<input class="uni-input" type="password" placeholder="输入密码" placeholder-class="placeholder" v-model="form_data.password" />
			</view>
			<view class="px-input">
				<view class="title">端口：</view>
				<input class="uni-input" type="number" placeholder="输入端口号" placeholder-class="placeholder" v-model="form_data.hostport" />
			</view>
			<!-- <view class="px-input">
				<view class="title">类型：</view>
				<input class="uni-input" type="number" placeholder="选择类型" placeholder-class="placeholder" v-model="form_data.type" :disabled="true" />
			</view> -->
			<view class="protocol">
				<text>点击确认表示您已同意服务条款:</text><navigator class="protocol_link" url="/pages/protocol/protocol">《免责声明》</navigator>
			</view>
			<view class="join_db" @click="addDbJoinInfo">确认</view>
			<view class="del_db" @click="delDbJoinInfo" v-show="db_id">删除</view>
		</view>
		
	</view>
</template>

<script>
	import { addDbJoin,delDbJoin,editDbJoin } from '@/components/tool/getData.js'
	export default {
		data() {
			return {
				db_id:null,
				form_data:{
					database:"",
					hostname:"",
					username:"",
					password:"",
					hostport:3306,
					type:"mysql"
				}
			};
		},
		//分享
		onShareAppMessage(res) {
			return {}
		},
		//分享到朋友圈
		onShareTimeline(res) {
			return {}
		},
		onLoad(options) {
			// console.log(options);
			if(options.id){
				this.db_id = options.id;
				this.form_data = {
					database: options.database,
					hostname: options.hostname,
					username: options.username,
					password: options.password,
					hostport: options.hostport,
					type: options.type
				};
			}
		},
		methods: {
			addDbJoinInfo(){
				if(!this.form_data.database){
					return uni.showModal({content: `数据库名(真实的数据库名)`,showCancel: false});
				}
				if(!this.form_data.hostname){
					return uni.showModal({content: `请输入主机名/IP`,showCancel: false});
				}
				if(!this.form_data.username){
					return uni.showModal({content: `请输入用户名`,showCancel: false});
				}
				if(!this.form_data.password){
					return uni.showModal({content: `请输入密码`,showCancel: false});
				}
				if(!this.form_data.hostport){
					return uni.showModal({content: `请输入端口号`,showCancel: false});
				}
				if(this.db_id){
					let form_data = this.form_data
					form_data.id = this.db_id
					editDbJoin(form_data).then(res=>{
						uni.navigateBack();
					})
				}else{
					addDbJoin(this.form_data).then(res=>{
						uni.navigateBack();
					})
				}
			},
			delDbJoinInfo(){
				uni.showModal({
					title: '提示',
					content: '确认删除？',
					success: (res)=> {
						if (res.confirm) {
							delDbJoin({id:this.db_id}).then(res=>{
								uni.navigateBack();
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="less">
.addDb{
	padding: 25rpx;
	.form_box{
		border-radius: 15px;
		padding:25rpx 25rpx;
		.px-input{
			margin-bottom: 45rpx;
		}
		.join_db{
			background-color: #1c9464;
			border-radius: 35rpx;
			text-align: center;
			padding: 25rpx 0;
			// width: 90%;
			margin:30rpx auto;
			display: flex;
			align-items: center;
			justify-content: center;
			// margin-right: 25rpx;
			letter-spacing: 3px;
			font-weight: 600;
			color: #fff;
			&:active{
				background-color: #187f56;
			}
			.icon{
				margin-right: 10rpx;
			}
		}
		.del_db{
			background-color: transparent;
			border-radius: 35rpx;
			text-align: center;
			border: 1px solid #f35050;
			padding: 25rpx 0;
			// width: 90%;
			margin:40rpx auto;
			display: flex;
			align-items: center;
			justify-content: center;
			// margin-right: 25rpx;
			letter-spacing: 3px;
			font-weight: 600;
			color: #f35050;
			&:active{
				background-color: #f35050;
				color: #fff;
			}
			.icon{
				margin-right: 10rpx;
			}
		}
	}
	
}
</style>
