// 所有关于用户的api

// 导入封装好的请求函数
import {
	requestApi
} from '@/common/request.js'


// 登录
export const login = (data) => requestApi({
	url: '/login',
	method: 'POST',
	data: {
		...data
	}
})

