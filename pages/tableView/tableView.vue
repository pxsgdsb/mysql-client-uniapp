<template>
	<view class="tableView">
		<view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control :current="current" :values="items" style-type="button" :active-color="activeColor" @clickItem="onClickItem" />
		</view>
		<view class="pass"></view>
		<view class="content">
			<view v-if="current === 0" class="content_item">
				<uni-table border stripe emptyText="暂无更多数据" :loading="false">
					<uni-tr>
						<uni-th>字段名称</uni-th>
						<uni-th width="100">数据类型</uni-th>
						<uni-th width="50">索引</uni-th>
						<uni-th width="100">允许NULL</uni-th>
						<uni-th>默认值</uni-th>
						<uni-th>备注</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in structure_list" :key="index">
						<uni-td>{{item.Field}}</uni-td>
						<uni-td>{{item.Type}}</uni-td>
						<uni-td>{{item.Key}}</uni-td>
						<uni-td>{{item.Null}}</uni-td>
						<uni-td>{{item.default}}</uni-td>
						<uni-td>{{item.Comment}}</uni-td>
					</uni-tr>
				</uni-table>
			</view>
			<view v-if="current === 1" class="content_item">
				<view class="sql_show">
					<view class="sql_content">{{ data_sql }}</view>
					<uni-icons type="eye" size="25" color="#fff" class="icon" @click="current=2"></uni-icons>
				</view>
				<view class="refresh" @click="refresh"><uni-icons type="reload" size="17" color="#fff"></uni-icons>刷新</view>
				<uni-table border stripe emptyText="暂无更多数据" :loading="false">
					<!-- 表头行 -->
					<uni-tr>
						<uni-th v-for="(item,index) in tb_header" :key="index">{{item}}</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr v-for="(item,index) in tb_data" :key="index">
						<uni-td v-for="(e,i) in tb_header.length" :key="i">{{item[tb_header[i]]}}</uni-td>
					</uni-tr>
				</uni-table>
				<view class="px-pagination" v-show="pagination_view">
					<uni-pagination :current="pageIndex" :total="total" title="标题文字" prev-text="上一页" next-text="下一页" @change="paginationChange" />
				</view>
			</view>
			<view v-if="current === 2" class="content_item">
				<view class="textarea_box">
					<textarea placeholder-style="color:#e4e4e4" placeholder="输入需要执行的sql语句" v-model="data_sql" :maxlength="-1" :class="textarea_height?'textarea_height':''" :auto-height="!textarea_height" />
					<uni-icons :type="textarea_height?'up':'down'" size="20" color="#c3c3c3" class="icon" @click="textarea_height=!textarea_height"></uni-icons>
				</view>
				<view class="footer_btn">
					<view class="common" @click="commonSql">常用sql</view>
					<view class="clear" @click="data_sql=''">清空</view>
					<view class="running" @click="running"><uni-icons type="paperplane" size="17" color="#fff"></uni-icons>执行</view>
				</view>
			</view>
		</view>

		
	</view>
</template>

<script>
	import { executeSql } from '@/components/tool/getData.js'
	export default {
		data() {
			return {
				db_id: null, // 数据库id
				tb_name: null, // 表名
				// tab
				items: ['结构', '数据', '执行SQL'],
        		current: 0,
				activeColor:"#2a6f6f",
				// 结构
				structure_list:[],
				// 数据
				data_sql:"",
				tb_header:[], //表头
				tb_data:[], //数据
				pageIndex: 1,
				pageSize: 10,
				total: 0,
				pagination_view:true,
				// 执行sql
				textarea_height:false, //自动高度
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
		async onLoad(options) {
            if(options["db_id"] && options["tb_name"]){
				this.db_id = options["db_id"];
				this.tb_name = options["tb_name"];
				uni.setNavigationBarTitle({
					title: options["tb_name"]
				});
				await this.renderTbStructure();
				await this.getDataList();
			}
		},
		methods: {
			// 切换选项卡
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			// 常用sql
			commonSql(){
				let arr = [
					'insert into ws_user(name) values ("张三");',
					'delete from ws_user where id=1;',
					'update ws_user set name="李四" where id=1;',
					'select * from ws_user where id=1',
					'select * from ws_user',
					'select count(*) from ws_user',
				];
				uni.showActionSheet({
					title: '常用sql',
					itemList:arr ,
					success: (res)=> {
						this.data_sql = arr[res.tapIndex];
					}
				});
			},
			// 刷新
			refresh(){
				this.getDataList();
			},
			// 渲染表结构
			renderTbStructure() {
				let sql = `SHOW FULL COLUMNS FROM ${this.tb_name};`
				let base64_sql = Buffer.from(sql).toString('base64');
                executeSql({db_id:this.db_id,base64_sql}).then(res=>{
                    let data = res.data
                    if(data.length){
                        this.structure_list = data;
						// 获取表头
						this.tb_header = data.map(item=>{
							return item.Field;
						})
                    }
                })  
			},
			// 获取数据
			getDataList(){
				// 获取数据总条数
				let count_sql = `SELECT COUNT(*) as count FROM ${this.tb_name};`
				let base64_count_sql = Buffer.from(count_sql).toString('base64');
                executeSql({db_id:this.db_id,base64_sql:base64_count_sql}).then(res=>{
                    let data = res.data
                    if(data.length){
                        this.total = data[0]["count"];
                    }
					// 获取数据
					this.data_sql = `SELECT * FROM ${this.tb_name} LIMIT ${(this.pageIndex-1)*this.pageSize},${this.pageSize};`
					let base64_sql = Buffer.from(this.data_sql).toString('base64');
					executeSql({db_id:this.db_id,base64_sql}).then(res=>{
						let data = res.data
						if(data.length){
							this.tb_data = data;
						}
					})
                })
			},
			// 分页
			paginationChange(e) {
				this.pageIndex = e.current;
				this.getDataList();
			},
			// 直接执行sql
			running(){
				let base64_sql = Buffer.from(this.data_sql).toString('base64');
				executeSql({db_id:this.db_id,base64_sql}).then(res=>{
					uni.showToast({
						title: "执行成功",
					})
					let data = res.data
					if(data.length){
						this.tb_data = data;
						this.current = 1
					}else{
						// this.current = 1
						// this.refresh()
					}
					this.pagination_view = false
				})
			}
		}
	}
</script>

<style lang="less">
.tableView{
	padding: 25rpx;
	.pass{
		height: 130rpx;
	}
	.uni-padding-wrap{
		margin-bottom: 30rpx;
		padding: 25rpx;
		background: #143434;
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		// border-bottom: 1px solid #2a6f6f;
		box-shadow: 1px 1px 5px #0f1f1f;
	}
	.px-pagination{
		margin-top: 30rpx;
	}
	.content_item{
		margin-bottom: 30rpx;
		.refresh{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin-bottom: 20rpx;
			color: #fff;
			// 文字下划线
			text-decoration: underline;
		}
	}
	.textarea_box{
		width: 100%;
		border: 1px #2a6f6f solid;
		border-radius: 15rpx;
		position: relative;
		textarea{
			padding: 20rpx 3% 70rpx 3%;
			width: 94%;
			border: none;
			background-color: transparent;
			color: #ffffff;
			font-size: 28rpx;
			&::placeholder{
				color: #ffffff;
			}
			line-height: 1.3;
		}
		.textarea_height{
			height: 70vh !important;
		}
		.icon{
			position: absolute;
			right: 0;
			bottom: 0;
			padding: 10rpx;
		}
	}
	.footer_btn{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 50rpx;
		view{
			border-radius: 10rpx;
			text-align: center;
			padding: 13rpx 23rpx;
			letter-spacing: 2px;
			display: flex;
			align-content: center;
			justify-content: center;
			font-size: 25rpx;
		}
		.running{
			background-color: #1c9464;
			border: 1px solid #1c9464;
			color: #fff;
			margin-left: auto;
			&:active{
				background-color: #187f56;
			}
		}
		.common,.clear{
			color: #d4d4d4;
			border: 1px solid #d4d4d4;
			margin-right: auto;
			margin-right: 10rpx;
			&:active{
				background-color: #1e5a4d;
			}
		}
	}
	.sql_show{
		margin: 0 0 25rpx 0;
		color: #fff;
		border-radius: 10rpx;
		background-color: #149B7A;
		position: relative;
		.sql_content{
			font-size: 26rpx;
			white-space: pre-wrap;
			word-wrap: break-word;
			padding: 20rpx 60rpx 20rpx 20rpx;
		}
		.icon{
			position: absolute;
			right: 10rpx;
			bottom: 1%;
			width: 60rpx;
			height: 60rpx;
		}
	}
}
</style>
