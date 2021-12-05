// 所有关于考试的api

// 导入封装好的请求函数
import {
	requestApi
} from '@/common/request.js'


// 查看成绩
export const getScore = (data) => requestApi({
	url: '/exam',
	method: 'POST',
	data: {
		...data
	}
})


// 获取试题
export const getPaper = () => requestApi({
	url: '/paper',
	method: 'GET'
})


// 上传成绩
export const submitScore = (data) => requestApi({
	url: '/result',
	method: 'POST',
	data: {
		...data
	}
})

