import {baseUrl} from "@/components/tool/tool.js"

/**
 * 微信sdk
 */
import md5 from 'js-md5';
export const wxLogin = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin', //使用微信登录
			success: function(res) {
				if (res.code) {
					let options = {
						code: res.code,
					}
					let time = Math.floor(Date.now() / 1000); // 当前时间戳
					options["timestamp"] = time;
					options["key"] = md5("myapi" + time); 
					// 请求登录api
					uni.showLoading({title: '登录中',mask: true});
					uni.request({
						url: baseUrl+"dbbox/login", // 请求路径
						method: 'POST',
						header: {'X-Requested-With': 'XMLHttpRequest'},
						data: options,
						success: result => {
							uni.hideLoading();
							let data = result.data
							if (data.status != 1) {
								uni.showToast({
									title: '登录失败',
									duration: 2000,
									icon: 'error'
								});
								reject(data.info)
								return
							}
							resolve(data)
						},
						fail: (err) => {
							uni.hideLoading();
							uni.showToast({
								title: '登录失败',
								duration: 2000,
								icon: 'error'
							});
							reject(err)
						}
					});

				}
			},
			fail: function(error) {
				uni.showToast({
					title: '登录失败',
					duration: 2000,
					icon: 'error'
				});
				reject(error)
			}
		});
	});
}
