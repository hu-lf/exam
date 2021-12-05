<template>
	<view class="main">
		<!-- 试卷题目 -->
		<view class="exam-paper-title"> 
			<i class="iconfont icon-gangbi"></i>
			<!-- <i class="iconfont icon-kaoshi"></i> -->
			{{ title }} 	
		</view>
		<view class="cover-box"></view>

		<!-- 试卷问题 -->
		<view class="exam-paper-questions">
			<view class="question" v-for="(question, i) in questions" :key="i"
				:style="{ zIndex: question.zIndex,transform: `translateX(${question.translateX})`}"
				@touchstart="playerTouchStart" @touchmove="playerTouchMove" @touchend="playerTouchEnd">

				<!-- 题干 -->
				<view class="question-title">
					<text class="question-type label small-label">
						{{ question.type }}
					</text>
					{{ question.sterm }}
				</view>

				<!-- 选项 -->
				<view class="question-options">
					<view v-for="(option, index) in question.choices" :key="index" 
					:class="{
						isChoosed: question.type != '多选题' && question.choosedItem == index,
						isChoosedMultiple: option.isChoosed,
						option:true,
						isAnswer: hasFinished && question.answer == letterArray[index],
						isAnswer: hasFinished && question.answer == boolArray[index],
						isAnswer: hasFinished && question.answer.includes(index)
					}" 
						@click="choose(question, index)">

						<view class="option-icon">
							{{ letterArray[index] }}
						</view>
						<view class="option-icon">
							{{ option.name }}
						</view>
					</view>
				</view>

			</view>
		</view>

		<!-- 试卷信息 -->
		<view class="exam-paper-info" :style="{transform:`translateY(${hideHeight})`}">
			<view class="row1" @click="toggleDrawer">
				<view class="btn large-btn" v-if="!hasFinished" @click.stop="submit">交卷</view>
				<view class="order-number-box">
					<i class="iconfont icon-liebiao"></i>
					<text>{{ currentIndex + 1 }} / {{ questions.length }}题</text>
				</view>
			</view>
			
			<view class="row2" v-if="hasFinished">
				<view  class="question-number" v-for="(question, index) in questions" :key="index"
					:class="{correct: question.isCorrect, error: !question.isCorrect}" @click="changeCurrentQuestion(index)">
					{{ index + 1 }}
				</view>
			</view>
			
			<view class="row2" v-else >
				<view class="question-number" v-for="(question, index) in questions" :key="index"
					:class="{current: index == currentIndex, done: question.done}" @click="changeCurrentQuestion(index)">
					{{ index + 1 }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "exam-paper",
		props: {
			title: {
				type: String,
				default: ''
			},
			data: {
				type: Object,
				default: {}
			},
			hasFinished: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				windowWidth: 0,
				boxHeight: '',
				hideHeight: '',

				questions: [],
				currentIndex: 0,
				moveMent: {
					startX: 0, // 开始位置
					endX: 0, // 结束位置
					type: '', // 左移还是右移
					flag: false // 判断时候是滑动还是点击
				},
				letterArray: ['A', 'B', 'C', 'D'],
				boolArray: ['true', 'false']
			}
		},
		watch: {
			boxHeight(val) {
				this.hideHeight = val
			},
			data(val) {
				// 获取屏幕宽度  不能获取宽度，先在这里加上这一句，之后再改
				const res = uni.getSystemInfoSync()
				this.windowWidth = res.windowWidth + 50
				
				// 初始化父组件传进来的数据
				if(!this.hasFinished) {
					this.initQuestions()
				}else {
					this.questions = val
					this.questions = this.questions.map((item, index) => {
						let question = {
							...item
						}
						question.translateX = -this.windowWidth + 'px'
						if (index == 0) {
							question.translateX = ''
						} 
						return question
					})
				}
			}
		},
		updated() {
			// 动态获取底部抽屉的高度
			const query = uni.createSelectorQuery()
			query.in(this).select('.row2').boundingClientRect(data => {
				this.boxHeight = data.height + 'px'
			}).exec()
		},
		onReady() {
			// 获取屏幕宽度
			const res = uni.getSystemInfoSync()
			this.windowWidth = res.windowWidth + 50
		},
		methods: {
			// 初始化一些参数
			initQuestions() {
				if (Object.keys(this.data).length == 0) return

				// 题目类型 和 分数
				let questionTypes = this.data.questionTypes
				// 初始化
				let typeIndex = 0
				let range = questionTypes[typeIndex].count * 1

				this.questions = this.data.questions.map((item, index) => {
					let question = {
						...item
					}

					// z-index
					question.zIndex = -100

					// translateX，利用 题目的移动距离 来决定是否显示试题
					if (index != 0) {
						question.translateX = -this.windowWidth + 'px'
					} else {
						question.translateX = ''
					}

					// type，score
					question.type = questionTypes[typeIndex].name
					question.score = questionTypes[typeIndex].score
					// 如果下一题超出了
					if (index + 1 >= range && index + 1 != this.data.questions.length) {
						typeIndex += 1
						range += (questionTypes[typeIndex].count * 1)
					}

					// option对象化
					if(question.type == '判断题') {
						question.choices = ['对', '错']
					}
					question.choices = question.choices.map(option => {
						let optionObj = {}
						optionObj.name = option
						optionObj.isChoosed = false
						return optionObj
					})
				
					return question
				})
			},

			playerTouchStart(e) {
				if (e.touches.length === 1) {
					// 记录开始移动的位置
					this.moveMent.startX = e.touches[0].clientX

					// 抽屉打开的话，先关上
					this.toggleDrawer('hide')	
				}
			},
			playerTouchMove(e) {
				if (e.touches.length === 1) {
					// 记录移动的位置
					this.moveMent.endX = e.touches[0].clientX;
					// 判断移动的类型
					this.moveMent.type = this.moveMent.endX - this.moveMent.startX < 0 ? 'next' : 'previous'
					// 记录该moveMent是移动而不是点击
					this.moveMent.flag = true
				}
			},
			playerTouchEnd(e) {
				if (!this.moveMent.flag) {
					return
				}
				this.moveMent.flag = false

				// 移动的距离
				let distance = Math.abs(this.moveMent.endX - this.moveMent.startX)

				// 如果是左移 
				if (this.moveMent.type == 'next') {
					// 则操纵当前元素
					let currentItem = this.questions[this.currentIndex]
					let nextItem = this.questions[this.currentIndex + 1]

					if (distance >= this.windowWidth * 1 / 5) {
						// 如果是最后一项
						if (this.currentIndex + 1 == this.questions.length) {
							uni.showToast({
								icon: 'none',
								title: '没有题目了'
							})
							return
						}
						this.toggleQuestion(currentItem)
						this.toggleQuestion(nextItem)
						this.currentIndex += 1
					}
					// 如果是右移 
				} else {
					// 则操纵上一个元素
					let preItem = this.questions[this.currentIndex - 1]
					let currentItem = this.questions[this.currentIndex]

					if (distance >= this.windowWidth * 1 / 5) {
						// 如果是第一项
						if (this.currentIndex == 0) {
							uni.showToast({
								icon: 'none',
								title: '没有题目了'
							})
							return
						}
						this.toggleQuestion(preItem)
						this.toggleQuestion(currentItem)
						this.currentIndex -= 1
					}
				}
			},

			// 显示和隐藏抽屉
			toggleDrawer(type) {
				// 指定显示
				if(type == 'show') {
					this.hideHeight = '0px'
				// 指定隐藏
				}else if(type == 'hide') {
					this.hideHeight = this.boxHeight
				// 切换状态
				}else {	
					this.hideHeight = this.hideHeight == '' ? this.boxHeight : ''
				}
				
			},
			// 显示和隐藏试题
			toggleQuestion(question) {
				question.translateX = question.translateX == '' ? -this.windowWidth + 'px' : ''
			},
			// 切换题目
			changeCurrentQuestion(index) {
				// 获取当前题目 和 需要切换的题目
				let preQuestion = this.questions[this.currentIndex]
				let currentQuestion = this.questions[index]

				// 分别操作这两个题目
				this.toggleQuestion(preQuestion)
				this.toggleQuestion(currentQuestion)

				// 更新
				this.currentIndex = index

				this.toggleDrawer()
			},

			// 选择
			choose(question, index) {
				/* 
				  先选 => 再算分数
				*/
				if(this.hasFinished) {
					return
				}

				// 单选题
				if (question.type == '单选题') {
					question.choosedItem = index

					// 多选题
				} else if (question.type == '多选题') {
					let choosed = question.choosedItem || []

					// 该选项是否已经被选，删除该项
					for (let i = 0; i <= choosed.length; i++) {
						if (choosed[i] == index) {
							choosed.splice(i, 1)
							question.choices[index].isChoosed = false
							
							// 清除选项后，改题被选的选项个数为0，则改题没有做
							if(question.choosedItem.length == 0) {
								question.done = false
							}
							// 直接返回
							return
						}
					}
					choosed.push(index)
					question.choosedItem = choosed.slice()
					question.choices[index].isChoosed = true

					// 判断题
				} else {
					question.choosedItem = index
				}
				this.$forceUpdate()
				question.done = true
			},
			submit() {
				let totalScore = 0

				for(let question of this.questions) {
					
					// 如果有 没有做好的题目 
					if(!question.done) {
						uni.showToast({
							icon: 'error',
							title: '请检查完成情况',
						})
						this.toggleDrawer('show')
						return
					}
					
					if(question.type == '单选题') {
						// 如果正确
						if(this.letterArray[question.choosedItem] == question.answer) {
							totalScore += question.score * 1
							question.isCorrect = true
						} 
					}else if(question.type == '判断题') {
						// 如果正确
						if(this.boolArray[question.choosedItem] == question.answer) {
							totalScore += question.score * 1
							question.isCorrect = true
						}
					}else {
						// 如果正确
						if(question.choosedItem.sort().toString() == question.answer.sort().toString()) {
							totalScore += question.score * 1
							question.isCorrect = true
						}
					}
				}
				this.$emit('submitScore', totalScore, this.questions)
				// console.log(totalScore)
			},
			
		}
	}
</script>

<style lang="scss">
	.main {

		// 题目标题
		.exam-paper-title {
			font-size: 42rpx;
			padding: 30rpx;
			text-align: center;
			z-index: 100;
			margin-bottom: 30rpx;
			
			display: flex;
			justify-content: center;
			align-items: center;
			
			.iconfont {
				display: inline-block;
				font-size: 60rpx;
				margin-right: 10rpx;
			}
		}
		
		// 辅助
		.cover-box {
			position: absolute;
			width: 100%;
			height: 55rpx;
			background-color: #FFFFFF;
			top: 95rpx;
			box-shadow: 1px 2px 3px -1px #ccc;
		}

		// 题目
		.question {
			position: absolute;
			width: 100%;
			height: 100vh;
			background-color: #fff;
			box-shadow: -15px 0px 29px 5px rgba(0, 0, 0, 0.2);
			transition: transform 0.2s;

			padding: 40rpx;
			box-sizing: border-box;

			// 题干
			.question-title {
				line-height: 60rpx;
				margin-bottom: 20rpx;

				.question-type {
					display: inline-block;
					margin-right: 20rpx;
				}
			}

			// 题目选项
			.question-options {
				.option {
					display: flex;
					align-items: center;
					margin-bottom: 35rpx;
					
					padding: 30rpx;
					border-radius: 30rpx;
					background: #ffffff;
					box-shadow:  10rpx 10rpx 26rpx #c9c9c9,
					             -10rpx -10rpx 26rpx #ffffff;
					
					// 选项编号
					.option-icon {
						margin-right: 30rpx;
					}
					// 选项内容
					.option-name {
						
					}

					&.isChoosed,
					&.isChoosedMultiple {
						// color: $topic-pure-color;
						background: #ffffff;
						box-shadow: inset 10rpx 10rpx 26rpx #c9c9c9,
						            inset -10rpx -10rpx 26rpx #ffffff;
					}
					
					&.isAnswer {
						color: #67C23A;
						font-weight: bolder;
					}
				}
			}
		}

		// 试卷信息抽屉
		.exam-paper-info {
			position: fixed;
			bottom: 0;
			width: 100%;
			background-color: #fff;
			box-shadow: 0px 10px 20px 4px #ccc;

			transition: transform 0.2s;

			// 第一行
			.row1 {
				display: flex;
				justify-content: space-around;
				align-items: center;
				height: 100rpx;
				
				.order-number-box {
					display: flex;
					justify-content: center;
					align-items: center;
					
					.iconfont {
						font-size: 40rpx;
						margin-right: 10rpx;
					}
				}
			}

			// 第二行
			.row2 {
				display: flex;
				flex-wrap: wrap;
				padding: 32rpx;

				// 题号
				.question-number {
					// 圆形
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					border: 1.5px solid #ccc;
					// 文字居中
					display: flex;
					justify-content: center;
					align-items: center;
					// 布局
					margin: 15rpx;
					box-sizing: border-box;

					&.done {
						background-color: $topic-pure-color-opacity;
						border-color: #FFFFFF;
						color: $topic-color;
					}

					&.current {
						border-color: $topic-pure-color;
					}
					
					&.correct {
						border-color: $correct-color;
					}
					&.error {
						border-color: $error-color;
					}
				}
			}
		}

	}
</style>
