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
				<view class="font_title">{{actLabel}}：</view>
			</view>
			<view class="nav_list" >
				<view v-for="(item,index) in intList" :key='index' @click="getactNum(item,index)">
					<view :class="actIndex==item.id?'activeNumber':'nor_number'">{{item.label}}</view>
				</view>
			</view>
		</view>
		<!-- 头部结束 -->
		<view>
		<!-- <view v-show="isHasData"> -->
			<totalTable1 v-show="idx==0" :tableData='listData'  ref='navr'></totalTable1>
			<totalTable2 v-show="idx==1" :tableDatar='listData' ref='navl'></totalTable2>
		</view>
		<view v-show="isHasData" class="compute_text">
			<div style="margin-top: 3rem;">
				{{ this.$t('trendview.computed') }}
			</div> 
		</view>
	</view>
</template>

<script>
	import totalTable1 from '@/components/totalTable1.vue';
	import totalTable2 from '@/components/totalTable2.vue';
	import IScroll from '@/js/iscroll-probe.js'
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
				hide0:false,
				hide1:false,
				isHasData:false,
				actLabel: this.$t('trendview.firstTrendView'),
				listData: {},
				show: false,
				prizeList: [{
						label: this.$t('trendview.navtitle0'),
						value: 1
					},
					{
						label: this.$t('trendview.navtitle1'),
						value: 2
					}
				],
				intList: [
					{
						label: this.$t('trendview.lastIssues0'),
						id: 24
					}, {
						label: this.$t('trendview.lastIssues1'),
						id: 48
					}, {
						label: this.$t('trendview.lastIssues2'),
						id: 72
					}, {
						label: this.$t('trendview.lastIssues3'),
						id: 96
					}
				],
				actIndex: 24,
				selectedIndexObj: [],
				myScroll1:'',
				myScroll2:'',
				myScroll3:'',
				myScroll4:'',
				myScroll5:'',
				myScroll6:'',
				nowitem:'',
				nowindex:''
			}
		},
		methods: {
			getactNum(item,index) {
				this.actIndex = item.id
				this.isHasData = true  // 数据计算中
				this.getData()
				// this.getIdx(this.nowitem, this.nowindex)
			},
			getIdx(item, index) {
				this.hide0 = index== 0 ?  true :false
				this.actLabel = item.value == 1? this.$t('trendview.firstTrendView') : this.$t('trendview.lastTwotrend')
				this.idx = index
				this.getData()
			},
			refresh(){
				if(this.idx==0){
					if(this.myScroll1){
						this.myScroll1.refresh()
						this.myScroll2.refresh()
						this.myScroll3.refresh()
					}
					this.initScroll()
				}else{
					if(this.myScroll4){
						this.myScroll4.refresh()
						this.myScroll5.refresh()
						this.myScroll6.refresh()
					}
					this.initScroll2()
				}
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
							res.data.listdata.reverse()
							this.listData = res.data
								this.$nextTick(() => {     // dom更新结束后延迟回调，一定要写不然获取不到元素的高，无法滑动
									this.refresh()
									// this.calFoodsHeight()    // 计算商品各个分类高度
								})
							this.isHasData = false
						}
					}
				});
				// $.getJSON('./static/msg.json', data => {
				// 	 this.listData = data
				// 	 this.isHasData=true
				// 	 console.log(data)
				// })
			},
			getQueryString(name){
				const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
				const search = window.location.search.split('?')[1] || '';
				const r = search.match(reg) || [];
				return r[2];
			},
			initScroll(){
				this.myScroll1 = new IScroll('#right_div2', {
					scrollX: true, // 允许横向滑动
					scrollT: true, // 允许纵向滑动
					startX : 0,             //滚动条开始的位置（横坐标）
					startY : 0,             //滚动条开始的位置（纵坐标）
					mouseWheel: false, //鼠标滚动事件
					bounce:false, //滚动回弹ios
					scrollbars: false, //滚动条
					probeType: 3,
				});
				console.log(this.myScroll1)
				// console.log(this.myScroll1,'滚动开始')
				this.myScroll2 = new IScroll('#left_div2', {
					scrollT: true,
					mouseWheel: false, //鼠标滚动事件
					bounce:false, //滚动回弹ios
					scrollbars: false, //滚动条
				});
				
				this.myScroll3 = new IScroll('#right_div1', {
					scrollX: true,
					mouseWheel: false, //鼠标滚动事件
					bounce:false, //滚动回弹ios
					scrollbars: false, //滚动条
					probeType: 3,
				});
				
				// 横着滚动
				// myScroll3.on('scroll', function(){
				// 	console.log(myScroll3.x,'滚动开始')
				// 	myScroll.scrollTo(myScroll3.x, 0);
				// });
				var that=this
				this.myScroll1.on('scroll', function(){
					if(Math.abs(that.myScroll1.directionX)==1){
						// console.log(myScroll.x,'横向滚动开始')
						that.myScroll3.scrollTo(that.myScroll1.x, 0);
					}else if(Math.abs(that.myScroll1.directionY)==1){
						// console.log(myScroll.y,'纵向滚动开始')
						that.myScroll2.scrollTo(0, that.myScroll1.y);
					}
				});
			},
			initScroll2(){
				this.myScroll4 = new IScroll('#right_div2s', {
					scrollX: true,
					scrollT: true,
					startX : 0,             //滚动条开始的位置（横坐标）
					startY : 0,             //滚动条开始的位置（纵坐标）
					mouseWheel: false, //鼠标滚动事件
					bounce:false, //滚动回弹ios
					scrollbars: false, //滚动条
					probeType: 3,
				});
				console.log(this.myScroll4,'滚动开始')
				this.myScroll5 = new IScroll('#left_div2s', {
					scrollT: true,
					mouseWheel: false, //鼠标滚动事件
					bounce:false, //滚动回弹ios
					scrollbars: false, //滚动条
				});
				
				this.myScroll6 = new IScroll('#right_div1s', {
					scrollX: true,
					mouseWheel: false, //鼠标滚动事件
					bounce:false, //滚动回弹ios
					scrollbars: false, //滚动条
					probeType: 3,
				});
				// 横着滚动
				// myScroll3.on('scroll', function(){
				// 	console.log(myScroll3.x,'滚动开始')
				// 	myScroll.scrollTo(myScroll3.x, 0);
				// });
				var that=this
				this.myScroll4.on('scroll', function(){
					if(Math.abs(that.myScroll4.directionX)==1){  // console.log(myScroll.x,'横向滚动开始')
						that.myScroll6.scrollTo(that.myScroll4.x, 0);
					}else if(Math.abs(that.myScroll4.directionY)==1){  // console.log(myScroll.y,'纵向滚动开始')
						that.myScroll5.scrollTo(0, that.myScroll4.y);
					}
				});
			}
		},
		mounted() {
			let params = this.getQueryString('curLang')
			// let params = 'th'
			if(params=='th'){ // 泰文
				this._i18n.locale = 'th';
				uni.setStorageSync('lang', 'th');
			}else if(params=='zh'){ // 中文
				this._i18n.locale = 'zh';
				uni.setStorageSync('lang', 'zh');
			}
			this.getData()
		}
	}
</script>

<style scoped>
	.compute_text{
		text-align: center;
		margin-top: 2.3rem;
		z-index: 999;
		background-color: #FFFFFF;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.font_title{
		font-size: 0.32rem;
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
		width: 1.8rem;
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
	}

</style>
