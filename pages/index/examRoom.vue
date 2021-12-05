<template>
	<view class="content">

		<!-- 引导页 -->
		<guide v-if="guideShow" @iKnow="hideGuide"></guide>

		<!-- 考试台 -->
		<view class="exam-area">
			<exam-paper :data="questions" :title="title" :hasFinished="hasFinished" @submitScore="submitScore"></exam-paper>
		</view>
	</view>
</template>

<script>
	import {
		getScore,
		getPaper,
		submitScore
	} from '@/api/exam.js'

	export default {
		data() {
			return {
				title: '大学生手册考试',
				questions: {},
				
				studentInfo: {},
				score: NaN,
				
				guideShow: false,
				newUser: 0,
				
				hasFinished: false,
				again: false
			}
		},
		onLoad(option) {
			this.again = option.again
			if(option.paper) {
				this.questions = JSON.parse(decodeURI(option.paper))
				this.hasFinished = true
				// console.log(this.questions)
			}
			
			// 获取考生信息
			this.getInfo()
			
			// 获取考生成绩
			this.getScore().then(res => {
				this.score = res.result
				
				// 检查当前状态
				this.checkStatus()
			})
		},
		methods: {
			// 获取考生信息
			getInfo() {
				this.studentInfo = uni.getStorageSync('studentInfo')
			},
			// 获取分数
			getScore() {
				uni.showLoading({
					title: "获取分数中..."
				})

				let data = {
					studentNo: this.studentInfo.studentNo
				}
				
				return new Promise((success, fail) => {
					getScore(data).then(res => {
						success(res)
						uni.hideLoading()
					})
				})
			},
			
			// 获取试卷
			getPaper() {
				// 重新获取试卷，初始化属性
				this.score = -1
				this.questions = {}

				uni.showLoading({
					title: "生成试卷中...",
				})

				getPaper().then(res => {
					this.questions = res
					setTimeout(uni.hideLoading, 400)
				})
			},
			// 跳转成绩页面
			toScorePage() {
				let studentInfoStr = JSON.stringify(this.studentInfo)
				let paperInfoStr = JSON.stringify(this.questions)
				uni.redirectTo({
					url: `/pages/index/score?stuInfo=${encodeURI(studentInfoStr)}&score=${this.score}&paper=${encodeURI(paperInfoStr)}`
				})
			},
			
			checkStatus() {
				// 如果已经考过试, 查看答题情况
				if(this.hasFinished) {
					return 
				}
				
				// 如果没有考过试 || 重考  =>  则获取试卷
				if (this.score == -1 || this.again) {
					this.getPaper()		
				// 如果已经考过试  =>  则跳转成绩页面
				} else {
					this.toScorePage()
				}
				
				// 如果是第一次登陆， 则显示新手引导
				this.newUser = uni.getStorageSync('newUser')
				if (this.newUser) {
					setTimeout(() => {
						this.guideShow = true
					}, 500)
					
				}				
			},
			// 提交分数
			submitScore(score, paper) {
				uni.showLoading({
					title: "批改试卷中..."
				})

				// 需要上传的数据
				let data = {
					// 考生信息
					...this.studentInfo,
					// 考试成绩
					score: score
				}
				console.log("本次考试的分数是：" + score)
				// 返回的答题情况
				this.questions = paper
				
				submitScore(data).then(res => {
					this.score = score
					this.toScorePage()
					uni.hideLoading()
				})
			},

			hideGuide() {
				this.guideShow = false
				uni.setStorageSync('newUser', 0)
			}
		}
	}
</script>

<style lang="scss">

</style>
