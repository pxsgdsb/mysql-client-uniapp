<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	page{
		background-color: #143434;
	}
	.hearder{
		padding:0rpx 0 35rpx 6rpx;
		color: #fff;
		font-size: 45rpx;
		font-weight: 700;
		overflow: hidden;
	}
	// 表单
	.px-input{
		/* border: 1px solid #a7a7a7; */
		padding: 30rpx;
		border-radius: 35rpx;
		color:#fff;
		background: #24544c;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.title{
			font-size: 30rpx;
			flex: 1;
			color: #e2e2e2;
		}
		.uni-input{
			flex: 2.8;
			text-align: right;
		}
		.placeholder{
			color: #c0c0c0;
			font-size: 30rpx;
		}
	}
	/* 协议 */
	.protocol{
		font-size: 14px;
		color: #9e9e9e;
		margin: 30px 0 10px 0;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		.protocol_link{
			color: #3c9cff;
		}
	} 
	// 表格
	.uni-table {
		border-radius: 10px !important;
		background-color: transparent !important;
	}
	.uni-table-th {
		color: #f3f3f3 !important;
		border-bottom: 1px #2a6f6f solid !important;
	}
	.uni-table-td{
		color: #f3f3f3 !important;
		border-bottom: 1px #2a6f6f solid !important;
	}
	.table--border {
		border: 1px #2a6f6f solid !important;
	}
	.empty-border {
		border-right: 1px #2a6f6f solid !important;
	}
	// 分页
	.uni-pagination__btn{
		padding:3rpx 45rpx !important;
		background-color: #2a6f6f !important;
		text{
			color:#fff !important;
		}
	}
	.current-index-text{
		color:#2a6f6f !important;
	}
</style>
