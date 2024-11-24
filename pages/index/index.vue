<template>
	<view class="index">
		<view class="hearder">数据库</view>
		<view class="db_box">
			<view v-show="dbData.length" class="db_item" v-for="(item,index) in dbData" :key="index" @click="open_db(item.database,item.id)">
				<view class="db_icon" :style="{background: item.bgColor}">
					<image class="db_img" src="/static/icon/db.png"></image>
				</view>
				<view class="db_content">
					<view class="name">{{item.database}}</view>
					<view class="bottom">{{item.hostname}}</view>
				</view>
				<view class="db_set" @click.stop="dbSet(item)">
                    <uni-icons type="settings-filled" size="30" color="#fff"></uni-icons>
                </view>
			</view>
			<view class="no_data" style="display: flex;flex-direction: column;align-items: center;justify-content: center;margin: 20%;" v-if="!dbData.length">
				<image style="width: 110rpx;height: 110rpx;" src="/static/icon/no_data.png"></image>
				<view style="color: #d2d2d2;margin-top: 15rpx;">暂无数据</view>
			</view>
		</view>
	
		<view style="height: 180rpx;"></view>
		<view class="footer">
			<navigator url="/pages/addDb/addDb" class="create"><uni-icons type="link" size="26" color="#fff" class="icon"></uni-icons>创建数据库连接</navigator>
		</view>
	</view>
</template>

<script>
	import { dbJoinList } from '@/components/tool/getData.js'
	export default {
		data() {
			return {
				color_arr :["#ee7959","#1c9464","#a46244","#a9be7b","#007175","#bec2b3","#6e9bc5","#68945c","#a8a19c","#9e8358","#d9883d","#ed6d46","#06436f","#ab1d22"],
				dbData:[],
			}
		},
		onShow() {
			this.getDbData()
		},
		//分享
		onShareAppMessage(res) {
			return {}
		},
		//分享到朋友圈
		onShareTimeline(res) {
			return {}
		},
		methods: {
			// 获取数据库数据
			getDbData(){
				dbJoinList({}).then(res=>{
					let dbData = res.data.data
					if(dbData.length){
						let num = 0
						for (const item of dbData) {
							// let num = Math.floor(Math.random() * (this.color_arr.length-1));
							item["bgColor"] = this.color_arr[num];
							num++
						}
						this.dbData = dbData;
					}
				})
			},
			// 跳转数据库表
			open_db(database,db_id){
				uni.navigateTo({
					url: `/pages/dbTableList/dbTableList?database=${database}&db_id=${db_id}`
				});
			},
			// 设置
			dbSet(item){
				uni.navigateTo({
					url: `/pages/addDb/addDb?id=${item.id}&type=${item.type}&hostname=${item.hostname}&database=${item.database}&username=${item.username}&password=${item.password}&hostport=${item.hostport}`
				});
			},
		}
	}
</script>

<style lang="less" scoped>

	.index{
		padding: 25rpx;
		.db_box{
			border: 1px solid #2a6f6f;
			border-radius: 15px;
			padding:10rpx 25rpx;
			.db_item{
				display: flex;
				// justify-content: space-between;
				align-items: center;
				// margin: 25rpx 0;
				padding: 22rpx 15rpx 22rpx 10rpx;
				border-bottom: 1px solid #2a6f6f;
				&:last-child {
					border-bottom: none;
				}
				&:active{
					background-color: #1b4747;
				}
				.db_icon{
					border-radius: 15rpx;
					width: 90rpx;
					height: 80rpx;
					margin-right: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					.db_img{
						width: 45rpx;
						height: 45rpx;
					}
				}
				.db_content{
					width: 80%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					color: #fff;
					.name{
						font-size: 36rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						max-width: 100%;
					}
					.bottom{
						color: #dedede;
						font-size: 26rpx;
						margin-top: 10rpx;
						margin-bottom: 10rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;
						.dbTable{
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							max-width: 46%;
						}
					}
				}
				.db_set{
					padding-left:20rpx;
    				height: 100%;
					&:active{
						background-color: #1b4747;
					}
				}
			}
		}
		.footer{
			width: 100%;
			height: 140rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			padding-bottom: 5rpx;
			padding-bottom: 30rpx;
			border-top: 1px solid #1a4c4c;
			.create{
				background-color: #1c9464;
				border-radius: 20rpx;
				text-align: center;
				padding: 25rpx 0;
				font-weight: 600;
				width: 70%;
				display: flex;
				align-items: center;
				justify-content: center;
				// margin-right: 25rpx;
				letter-spacing: 2px;
				color: #fff;
				&:active{
					background-color: #187f56;
				}
				.icon{
					margin-right: 10rpx;
				}
			}
		}
	}
	

</style>
