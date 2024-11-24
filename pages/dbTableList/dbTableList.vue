<template>
	<view class="dbTableList">
		<view class="hearder">{{hearder_msg}}</view>
		<view class="db_box">
			<view class="db_item" v-for="(item,index) in tableData" :key="index" @click="openTable(item.TABLE_NAME)">
				<view class="tb_content">
					<view class="name">{{item.TABLE_NAME}}</view>
					<view class="bottom">{{item.TABLE_COMMENT}}</view>
				</view>
                <view class="tb_size">
                    <view class="rows">{{item.TABLE_ROWS}} 行</view>
                    <view>{{ convertBytes(item.DATA_LENGTH) }}</view>
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
				tableData:[],
                hearder_msg:"",
                database:"",
                db_id:null
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
        onLoad(options){
            if(options["db_id"]){
				this.db_id = options["db_id"];
			}
            if(options["database"]){
				this.hearder_msg = options["database"]+"的数据表";
                this.database = options["database"];
			}
            this.getTableList();
        },
        methods: {
            // 渲染表格列表
            getTableList(){
                let sql = `SELECT TABLE_NAME, TABLE_COMMENT, TABLE_ROWS, DATA_LENGTH FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`;
                let base64_sql = Buffer.from(sql).toString('base64');
                executeSql({db_id:this.db_id,base64_sql}).then(res=>{
                    let data = res.data
                    if(data.length){
                        this.tableData = data;
                    }
                })  
            },
			openTable(TABLE_NAME){
				uni.navigateTo({
					url: `/pages/tableView/tableView?db_id=${this.db_id}&tb_name=${TABLE_NAME}`
				});
			},
            // 转换字节为合适的单位
            convertBytes(bytes) {
                const KB = 1024;
                const MB = KB * 1024;

                if (bytes < KB) {
                    return bytes + ' bytes';
                } else if (bytes < MB) {
                    return (bytes / KB).toFixed(2) + ' KB';
                } else {
                    return (bytes / MB).toFixed(2) + ' MB';
                }
            }
		}
	}
</script>

<style lang="less">

.dbTableList{
    padding: 25rpx;
    .hearder{
        font-size: 35rpx;
    }
    .db_box{
        border-radius: 15px;
        // padding:25rpx 25rpx;
        .db_item{
            display: flex;
            align-items: center;
            margin-bottom: 25rpx;
            background: #24504d;
            // border-radius: 15px;
            overflow: hidden;
            &:active{
                background-color: #1d4e4e;
            }
            .tb_content{
                padding:20rpx 25rpx;
                // border-top-right-radius: 25px;
                // border-bottom-right-radius: 25px;
                background-color: #1b4747;
                box-shadow: 1px 1px 5px #123131;
                width: 68%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                &:active{
                    background-color: #1d4e4e;
                }
                .name{
                    font-size: 36rpx;
                    color: #fff;
                    font-weight: 600;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }
                .bottom{
                    color: #d1d1d1;
                    font-size: 26rpx;
                    margin-top: 10rpx;
                    margin-bottom: 10rpx;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }
            }
            .tb_size{
                border-radius: 15rpx;
                font-size: 26rpx;
                color: #fff;
                width: 26%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .rows{
                    margin-bottom: 10rpx;
                }
            }
        }
    }
}
</style>
