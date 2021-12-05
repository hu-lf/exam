<template>
	<view>
		<view class="background">
			<image class="background-img" src="../../static/img/bg1.jpg"></image>
		</view>
				
		<view class="login-box center-box">
			<view class="account-box">
				<input type="number" maxlength="8" v-model="cardId" class="cardId-box mimicry-box" placeholder="一卡通账号" />
				<input type="number" password="true" v-model="password" class="password-box mimicry-box" placeholder="密码"
					placeholder-style="font-size: 30rpx" />
			</view>
			<view class="btn-box mimicry-box btn large-btn" @click="login">
				<view>进入</view>
				<view>测试</view>
			</view>
		</view>

	</view>
	
</template>

<script>
	import {
		login
	} from '@/api/user.js'

	export default {
		data() {
			return {
				cardId: '',
				password: '',
				errorMsg: ''
			}
		},
		onLoad() {
			let studentInfo = uni.getStorageSync('studentInfo')
			if(studentInfo) {
				// 直接进入考场
				uni.redirectTo({
				    url: '/pages/index/examRoom'
				})
			}
		},
		methods: {
			validate(){
				if(!this.cardId) {
					uni.showToast({
						title: '请输入一卡通',
						icon: 'error'
					})
					return false
				} if(!this.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'error'
					})
					return false
				}
				return true
			},
			login() {
				if(!this.validate()) return 
				
				uni.showLoading({
					title: "请稍后...",
				})
				
				let data = {
					cardId: this.cardId,
					password: this.password
				}
				login(data).then(studentInfo => {
					console.log(studentInfo)
					
					uni.setStorageSync('studentInfo', studentInfo)
					uni.setStorageSync('newUser', 1)
					
					// 进入考场
					uni.redirectTo({
					    url: '/pages/index/examRoom'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.background {
		height: 100vh;
		
		.background-img {
			height: 100%;
			width: 100%;
			opacity: .4;
		}
	}
	
	.login-box {
		display: flex;
		padding: 30rpx;
		justify-content: center;

		.account-box {
			flex: 4;

			.cardId-box,
			.password-box {
				margin-right: 20rpx;
				padding: 20rpx;
				border-radius: 20rpx;
			}

			.cardId-box {
				margin-bottom: 20rpx;
			}

			.password-box {
				font-size: 8rpx;
			}
		}

		.btn-box {
			flex: 1;
			
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			font-size: 40rpx;
			background: $topic-pure-color;

			&.mimicry-box {
				box-shadow: 2rpx 6rpx 16rpx 0rpx rgba(0, 0, 0, .5), 
							-10rpx -10rpx 26rpx #ffffff;
			}
			
			&.mimicry-box:hover {
				box-shadow: none;
			}
		}
	}
	
	.error-msg-box {
		
	}
</style>
