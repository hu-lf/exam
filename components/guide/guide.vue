<template>
	<view class="guide-page">
		<view class="mask"></view>
		
		<view class="guide-items">
			
			<!-- 滑动提示项 -->
			<view class="slide-guide-item"> 
				<view class="info-box flex-space-bewteen" >
					<view class="pre">
						<view>上一题</view>
						<i class="iconfont icon-bhjrigthslide"></i>
					</view>
					<view class="next">
						<view>下一题</view>
						<i class="iconfont icon-bhjleftslide"></i>
					</view>	
				</view>
			</view>
			
			<!-- 按钮操作提示项 -->
			<view class="btn-guide-item">
				<view class="info-box flex-space-bewteen">
					<view class="submit">
						<view class="text">点击这里提交答案</view>
						<i class="iconfont icon-xuxianjiantou"></i>
					</view>
					
					<view class="pop">
						<view class="text">点击这里切换题目</view>
						<i class="iconfont icon-xuxianjiantou"></i>
					</view>
				</view>
				
				<view class="img-box">
					<image src="../../static/img/buttom-bar.jpg"></image>
				</view>	
			</view>
		
			<view class="btn-box center-box" @click="iKnow">我知道了。</view>
		
		</view>
		
	</view>
	
</template>

<script>
	export default {
		name:"guide",
		data() {
			return {
				
			};
		},
		methods: {
			iKnow(){
				this.$emit("iKnow")
			}
		}
	}
</script>

<style lang="scss">
	// 遮罩层
	.mask {
		height: 100vh;
		position: absolute;
		top: 0;
		width: 100%;
		background-color: rgb(0,0,0);
		opacity: .6;
		z-index: 1;
	}
	
	// 提示项
	.guide-items {
		color: #FFFFFF;
		
		.slide-guide-item,
		.btn-guide-item,
		.btn-box {
			position: absolute;
			width: 100%;
			z-index: 2;
		}
		
		// 取消按钮
		.btn-box {
			margin: 0 auto;
			width: 200rpx;
			padding: 20rpx 0;
			font-size: 40rpx;
			border-bottom: 6rpx solid #FFFFFF;
		}
		
		// 滑动提示项
		.slide-guide-item {
			top: 35%;
			
			.pre,
			.next {
				opacity: .8;
				
				.icon-bhjleftslide,
				.icon-bhjrigthslide{
					font-size: 5em;
				}
			}
		}
		
		// 按钮操作提示项
		.btn-guide-item {
			bottom: 0;
			
			.info-box {
				
				.text {
					border: 4rpx dotted #FFFFFF;
					padding: 22rpx;
					border-radius: 20rpx;
					
					display: inline-block;
					width: 140rpx;
				}
				
				.submit {
					i {
						transform: rotateX(22deg) rotateY(172deg);
					}
				}
				.pop {
					i {
						transform: rotateX(45deg);
					}
				}
				
				.icon-xuxianjiantou {
					font-size: 3em;
				}
			}
			
			.img-box {
				height: 100rpx;
				
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
</style>
