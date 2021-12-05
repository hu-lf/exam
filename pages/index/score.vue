<template>
	<view>
		<score-board :studentInfo="studentInfo" :score="score" @getPaperAgain="getPaperAgain"
		@cheakPaper="cheakPaper"></score-board>
	</view>
</template>

<script>
	import {
		getScore
	} from '@/api/exam.js'
	
	export default {
		data() {
			return {
				studentInfo: {},
				score: '',
				paper: {}
			};
		},
		onLoad(option) {
			this.studentInfo = JSON.parse(decodeURI(option.stuInfo)) 
			this.score = option.score
			this.paper = JSON.parse(decodeURI(option.paper))
		},
		methods: {
			// 再次考试
			getPaperAgain(){
				uni.redirectTo({
					url: '/pages/index/examRoom?again=1'
				})
			},
			// 查看答题情况
			cheakPaper(){
				let paperInfoStr = JSON.stringify(this.paper)
				uni.navigateTo({
					url: `/pages/index/examRoom?paper=${encodeURI(paperInfoStr)}`
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
