<template>
	<view class="score-board center-box">

		<!-- 成绩单背景 -->
		<view class="background">
			<image src="../../static/img/score-board-bg.jpg" mode=""></image>
		</view>

		<!-- 成绩单内容 -->
		<view class="score-board-content flex-column flex-space-space-around">

			<view class="score-board-title">
				成绩单
			</view>
			
			<view class="score-board-info">
				<text class="name">
					姓名 ：{{ studentInfo.name }}
				</text>
				分数 ：
				<text class="score label large-label">
					{{ score }}
				</text>
			</view>

			<!-- 结果 -->
			<view class="score-board-result">
				<view v-if="score >= 60">
					<view>恭喜你！已经通过该考试</view>
				</view>

				<view v-else>
					<view>很遗憾，还未通过该考试</view>
					<view class="btn-box flex flex-center">
						<view class="again">
							<view class="btn large-btn" @click="getPaperAgain">再次考试</view>
						</view>
						<view class="check">
							<view class="btn large-btn" @click="cheakPaper">查看答题情况</view>
						</view>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		name: "score-board",
		props: {
			studentInfo: {
				type: Object,
				default: {}
			},
			score: {
				type: Number
			}
		},
		data() {
			return {
			
			};
		},
		methods: {
			getPaperAgain(){
				this.$emit("getPaperAgain")
			},
			cheakPaper(){
				this.$emit("cheakPaper")
			}
		}
		
	}
</script>

<style lang="scss">	
	@keyframes show {
	  from {top: -700rpx;}
	  to {top: 50%;}
	}
	.score-board {
		width: 70%;
		height: 700rpx;
		margin: 0 auto;
		animation-name: show;
		animation-duration: 1s;

		// 成绩单背景
		.background {
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			opacity: .9;

			image {
				width: 100%;
				height: 100%;
			}
		}

		// 成绩单内容
		.score-board-content {
			height: 100%;

			.score-board-title {
				text-align: center;
				font-size: 60rpx;
				font-weight: bolder;
				letter-spacing: 20rpx;
				transform: translateY(30rpx);
			}

			.score-board-info {
				text-align: center;
				transform: translateY(-70%);

				.name {
					margin-right: 30rpx;
				}
				
				.score {
					background-color: #ffd24a;
				}
			}

			.score-board-result {
				text-align: center;
				transform: translateY(-120rpx);
				
				.again,
				.check {
					margin-top: 30rpx;
					
					.btn {
						background-color: #ffd24a;	
					}
				}
				.again {
					margin-right: 20rpx
				}
			}
		}
	}
</style>
