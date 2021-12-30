<template>
	<view class="content_trend">
		<view>
			<u-picker :show="show" :columns="intList" keyName="label" @confirm="confirm"></u-picker>
			
		</view>
		<!-- 组件区域 -->
		<view class="period_head">
			<view class="normal_list" v-for="(item,index) in prizeList" :key='index' @click="getIdx(item,index)">
				<text :class="idx==index?'activeList':''">{{item.label}}</text>
			</view>
		</view>
		<view class="gray_line"></view>
		<view class="period">
			<view class="head_flex">
				<view class="font_title">{{actLabel}}走势图：</view>
				<!-- <view @click="show = true" class="front_num">
					近{{actIndex}}期 
					<u-icon name="arrow-down"></u-icon>
				</view> -->
			</view>
			<view class="nav_list" >
				<view v-for="(item,index) in intList" :key='index' @click="getactNum(item,index)">
					<view :class="curNow==index?'activeNumber':'nor_number'">{{item.label}}</view>
				</view>
			</view>
		</view>
		<!-- 头部结束 -->
		<view v-if="isHasData">
			<totalTable1 v-if="idx==0" :tableData='listData'></totalTable1>
			<totalTable2 v-if="idx==1" :tableDatar='listData'></totalTable2>
		</view>
		<view v-else class="compute_text">
			计算中....
		</view>
	</view>
</template>

<script>
	import totalTable1 from '@/components/totalTable1.vue';
	import totalTable2 from '@/components/totalTable2.vue';
	//#ifdef H5
	import $ from '@/js/jquery-3.4.1.min.js'
	//#endif 
	export default {
		components: {
			totalTable1,
			totalTable2
		},
		data() {
			return {
				idx: 0,
				curNow:0,
				isHasData:false,
				actLabel: '一等奖',
				listData: {} ,
				show: false,
				prizeList: [{
						label: '一等奖',
						value: 1
					},
					{
						label: '后两位',
						value: 2
					}
				],
				intList: [
					{
						label: '最近24期',
						id: 24
					}, {
						label: '最近48期',
						id: 48
					}, {
						label: '最近72期',
						id: 72
					}, {
						label: '最近96期',
						id: 96
					}
				],
				actIndex: 24,
				selectedIndexObj: []
			}
		},
		methods: {
			getactNum(item,index) {
				console.log(item,index)
				this.curNow = index;
				this.actIndex = item.id
				this.show = false
				this.isHasData = false
				setTimeout(function(){
					this.isHasData = true
				},1500)
				this.getData()
			},
			// 显示隐藏遗漏条
			toggleMiss: function (e) {
				console.log(e)
				e ? [].concat(_toConsumableArray(document.querySelectorAll(".js-miss-num"))).forEach(function (e) {
					return e.style.display = "inline-block"
				}) : [].concat(_toConsumableArray(document.querySelectorAll(".js-miss-num"))).forEach(function (e) {
					return e.style.display = "none"
				})
			},
			getIdx(item, index) {
				this.actLabel = item.label
				this.idx = index
				this.getData()
			},
			confirm(e) {
				console.log('confirm', e.value[0].id)
				this.actIndex = e.value[0].id
				this.show = false
				this.isHasData = false
				setTimeout(function(){
					this.isHasData = true
				},1500)
				this.getData()
			},
			getData() {
				var data = {
					'count': this.actIndex
				}
				uni.request({
					url: 'https://fishhappyweb.feifan-game.com/getticketrewardinfo',
					header: {
						contentType: "application/json;charset=utf-8",
					},
					data: JSON.stringify(data),
					method: 'post',
					success: (res) => {
						if (res.statusCode == 200) {
							this.listData = res.data
							this.isHasData=true
							// console.log(this.listData)
						}
					}
				});
				// $.getJSON('./static/msg.json', data => {
				// 	 this.listData = data
				// 	 this.isHasData=true
				// 	 console.log(data)
				// })
			}
		},
		created() {
			this.getData()
		}
	}
</script>

<style scoped>
	
	.compute_text{
		text-align: center;
		margin-top: 4rem;
	}
	.font_title{
		font-size: 0.27rem;
		color: #353A47;
		height: .5rem;
		line-height: .5rem;
		text-align: left;
	}
	.nav_list{
		display: flex;
		justify-content: space-around;
	}
	.activeNumber{
		background-image: url(../../static/butpre.png);
		background-repeat: no-repeat;
		background-size: cover;
		font-weight: 500;
		font-size: 0.25rem;
		color: #FFFFFF;
		width: 1.7rem;
		height: .56rem;
		line-height: .56rem;
		text-align: center;
	}
	.nor_number{
		width: 1.7rem;
		height: .56rem;
		text-align: center;
		font-size: 0.25rem;
		padding: .1rem;
		color: #6F798D;
		background: #EEF4FF;
		border-radius: .4rem;
		border: 1px solid #D8E4F5;
	}

</style>
