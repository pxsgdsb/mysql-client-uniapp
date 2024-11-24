import { wxLogin } from '@/components/wechat/wechat.js'
import md5 from 'js-md5';
export const baseUrl = 'http://127.0.0.1//'; 
/**
 * 网络请求
 */
export const request = (options = {}) => {
	return new Promise(async (resolve, reject) => {
		// 获取token
		let token = uni.getStorageSync('token');
		if (!token) {
			// 当token不存在时先登录获取
			let res = await wxLogin();
			token = res.data
			// 保存token到缓存
			uni.setStorageSync('token', token);
			// return
		}
		// 发送请求
		if(!options["data"]["notLoading"]){
			uni.showLoading({
				title: '请求中',
				mask: true
			});
		}
		if(options["data"]){
			options["data"]["token"] = token
		}else{
			options["data"] = {"token":token}
		}
		let time = Math.floor(Date.now() / 1000); // 当前时间戳
		options["data"]["timestamp"] = time;
		options["data"]["key"] = md5("myapi" + time); 
		uni.request({
			url: baseUrl + options.url, //接收请求的API
			method: options.method || 'GET', //接收请求的方式,如果不传默认为GET
			data: options.data,
			header: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			success: (result) => {
				uni.hideLoading();
				let data = result.data
				if (data.status) {
					if (data.status != "1") {
						// 后端报错
						uni.showModal({
							title: '提示',
							content: data.info,
							showCancel: false
						});
						reject(data)
						return
					}
				} else {
					// // tp报错
					// let str1 = data.match(/<h1>(.*)<\/h1>/)[1];
					// let str2 = data.match(/<h2>(.*)<\/h2>/)[1];
					// let newstr = str1 + "\r\n" + str2
					// console.log(newstr)
					uni.showModal({
						title: '提示',
						content: "服务器发生错误或超时，请重试！",
						showCancel: false
					});
					reject('')
					return
				}
				resolve(data);
			},
			fail: (error) => {
				uni.hideLoading();
				uni.showModal({
					title: '提示',
					content: "服务器发生错误或超时，请重试！",
					showCancel: false
				});
				// if (typeof error == "object") {
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: error.errMsg,
				// 		showCancel: false
				// 	});
				// } else {
				// 	let str1 = error.match(/<h1>(.*)<\/h1>/)[1];
				// 	let str2 = error.match(/<h2>(.*)<\/h2>/)[1];
				// 	newstr = str1 + "\r\n" + str2
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: newstr,
				// 		showCancel: false
				// 	});
				// }
				reject(error);
			}
		});
	})
}



/**
 * 上传文件
 */
export const uploadFile = (options = {}) => {
	return new Promise(async (resolve, reject) => {
		// 获取token
		let token = uni.getStorageSync('token');
		if (!token) {
			// 当token不存在时先登录获取
			let res = await wxLogin();
			token = res.data
			// 保存token到缓存
			uni.setStorageSync('token', token);
		}
		// 发送请求
		if(!options["data"]["notLoading"]){
			uni.showLoading({
				title: '上传中',
				mask: true
			});
		}
		if(options["data"]){
			options["data"]["token"] = token
		}else{
			options["data"] = {"token":token}
		}
		let time = Math.floor(Date.now() / 1000); // 当前时间戳
		options["data"]["timestamp"] = time;
		options["data"]["key"] = md5("myapi" + time); 
		uni.uploadFile({
			url: baseUrl + options.url, //接收请求的API
			filePath: options.filePath,	
			formData: options.data,
			name: options.fileName,
			header: {
				'content-type': 'multipart/form-data',
				'X-Requested-With': 'XMLHttpRequest'
			},
			success: (result) => {
				uni.hideLoading();
				let data = JSON.parse(result.data)
				if (data.status) {
					if (data.status != "1") {
						// 后端报错
						uni.showModal({
							title: '提示',
							content: data.info,
							showCancel: false
						});
						reject(data)
						return
					}
				} else {
					// tp报错
					let str1 = data.match(/<h1>(.*)<\/h1>/)[1];
					let str2 = data.match(/<h2>(.*)<\/h2>/)[1];
					let newstr = str1 + "\r\n" + str2
					// console.log(newstr)
					uni.showModal({
						title: '提示',
						content: "服务器发生错误或超时，请重试！",
						showCancel: false
					});
					return
				}
				resolve(data);
			},
			fail: (error) => {
				uni.hideLoading();
				uni.showModal({
					title: '提示',
					content: "服务器发生错误或超时，请重试！",
					showCancel: false
				});
				// if (typeof error == "object") {
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: error.errMsg,
				// 		showCancel: false
				// 	});
				// } else {
				// 	let str1 = error.match(/<h1>(.*)<\/h1>/)[1];
				// 	let str2 = error.match(/<h2>(.*)<\/h2>/)[1];
				// 	newstr = str1 + "\r\n" + str2
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: newstr,
				// 		showCancel: false
				// 	});
				// }
				reject(error);
			}
		});
	})
}

/**
 * 时间戳转换为时间 
 */
export const timestampToTime = (timestamp) => {
	timestamp = timestamp ? timestamp : null;
	let date = new Date(timestamp); //时间戳为10位时timestamp 需 *1000，时间戳为13位的话不需乘1000
	let Y = date.getFullYear() + '-';
	let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
	return Y + M + D + h + m + s;
}

/**
 * 获取当前日期时间(补零)
 */
export const getDateTime = function() {
	var date = new Date();
	var year = date.getFullYear();
	var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
	var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	var nowTime = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
	return nowTime;
}

/**
 * 获取当前日期(补零)
 */
export const getDate = function() {
	var date = new Date();
	var year = date.getFullYear();
	var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
	var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	var nowTime = year + "-" + month + "-" + day;
	return nowTime;
}
