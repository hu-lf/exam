// 导入配置项(配置项配置api根路径)
import config from '@/common/config.js'

export function requestApi(options) {
	if (!options.url) {
		return
	}
	
	const headers = {
		...options.headers
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: config.apiUrl + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: headers,
			success(res) {
				resolve(res.data)
			},
			fail(error) {
				reject(error)
			}
		})
	})
}

