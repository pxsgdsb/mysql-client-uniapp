import { request,uploadFile } from './tool.js'; //导入封装好的js文件

// 数据库连接列表
export const dbJoinList = (data)=>{
	return request({
		url:'dbbox/dbJoinList', 
		method:'POST',
		data:data
	})
}

// 添加数据库连接
export const addDbJoin = (data)=>{
	return request({
		url:'dbbox/addDbJoin', 
		method:'POST',
		data:data
	})
}

// 编辑数据库连接
export const editDbJoin = (data)=>{
	return request({
		url:'dbbox/editDbJoin', 
		method:'POST',
		data:data
	})
}

// 删除数据库连接
export const delDbJoin = (data)=>{
	return request({
		url:'dbbox/delDbJoin', 
		method:'POST',
		data:data
	})
}

// 执行SQL语句
export const executeSql = (data)=>{
	return request({
		url:'dbbox/executeSql', 
		method:'POST',
		data:data
	})
}





