<template>
	<view class="content_trend">
		<!-- 一等奖总表 -->
		<div class="qxc-flex m-top" id="content">
			<div id="left_div" class="qxc-left">
				<div id="left_div1" class="l-top">
					<publicT1></publicT1>
				</div>
				<div id="left_div2" class="l-bot">
					<div>
						<table id="left_table2" class="table-pl3" cellpadding="0" cellspacing="0" border="0">
							<tr v-for="(item,index) in leftData0" :key='index'>
								<td>{{item.periodno}}</td>
								<td>{{item.firstprize}}</td>
							</tr>
						</table>
						<publicT2></publicT2>
					</div>
				</div>
			</div>
			<!-- 左边部分结束 -->
			<div id="right_div" class="qxc-right">
				<div id="right_div1" class="r-top">
					<!-- 右边表头1 -->
					<firTable1></firTable1>
				</div>
				<div id="right_div2" class="r-bot">
					<div style='width:30rem'>
						<table id="right_table2" cellpadding="0" cellspacing="0" border="0" class="table-pl3">
							<tr v-for="(item,index) in newList" :key='index'>
								<td v-for="(item2, index2) in item" :key='index2' :class='item2.class' :id='item2.id'>
									<!-- {{item2.value}} -->
									<i class="js-selected-num"  :num-index="item2.index2" :pos-index="item2.index2" row="${index}">{{item2.value}}</i>
								</td>
							</tr>
							<!-- <div id="canvasBox"></div> -->
						</table>
						<!-- 右边 下表头2 -->
						<table id="right_table5" cellpadding="0" cellspacing="0" border="0" class="table-pl3">
							<tr>
								<td v-for="(item,index) in tableData.firstStatic">{{item.showtimes}}</td>
							</tr>
							<tr>
								<td v-for="(item,index) in tableData.firstStatic">{{item.maxmisstimes}}</td>
							</tr>
							<tr>
								<td v-for="(item,index) in tableData.firstStatic">{{item.maxcontinuetimes}}</td>
							</tr>
							<tr>
								<td v-for="(item,index) in tableData.firstStatic">{{item.permissstimes}}</td>
							</tr>
							<tr>
								<td v-for="(item,index) in tableData.firstStatic">{{item.curmisstimes}}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	
	import publicT1 from '@/components/bt/publicT1.vue';
	import publicT2 from '@/components/bt/publicT2.vue';
	import firTable1 from '@/components/bt/firTable1.vue';
	import firTable2 from '@/components/bt/firTable2.vue';
	import IScroll from '@/js/iscroll-probe.js'
	
	//#ifdef H5
	import $ from '@/js/jquery-3.4.1.min.js'
	
	//#endif 
	export default {
		components: {
			publicT1,
			publicT2,
			firTable1,
			firTable2,
		},
		props: ['tableData'],
		data() {
			return {
				selectedIndexObj: [],
				aryTotalStatistics: [],
				newList: [],
				leftData0: [],
				myScroll:'',
				missLineColor: '#C84C59',
			}
		},
		methods: {
			pushData(listdata) {
				this.aryTotalStatistics = []
				this.selectedIndexObj = []
				this.newList = []
				this.leftData0 = []
				var that = this
				var arrlist = []
				listdata.forEach(function(element, index) {
					that.leftData0.unshift(element) //标题反转放入201303放最后，  077258放在最前面
					// console.log(element.firstprize.split('')) 201303
					var numArr = element.firstprize.split(''); //遍历  201303
					let jsonTempList = []; //创造一行数据出来 例如201303
					for (let i = 0; i < numArr.length; i++) { //遍历 201303  numArr[i]=2,0,1,3,0,3
						let cbCard = numArr[i];
						jsonTempList[i] = jsonTempList[i] || []; //24个数组（数组长度为6） 6个空数组
						let aryCards = [];
						for (let j = 0; j < 10; j++) { //从0-9 循环10次

							that.selectedIndexObj[i] = that.selectedIndexObj[i] || [];
							if (cbCard == j) {
								that.selectedIndexObj[i][j] = index + 1;
								aryCards[j] = j
							} else {
								var num = index + 1 - (that.selectedIndexObj[i][j] || 0);
								aryCards[j] = num
							}
						}
						jsonTempList[i] = aryCards
					}
					// console.log(jsonTempList,index)  //24个数组（数组长度为6）
					that.aryTotalStatistics.unshift(jsonTempList);
					arrlist = jsonTempList.map((item, idx) => {
						// console.log(item,idx) //0 1 2 3 4 5
						return item = item.map((item2, index2) => {
							if (numArr[idx] == item2 && numArr[idx] == index2) {
								return item2 = {
									value: item2,
									class: 'bgred',
									id: 'lineId'+index2   
								}
							} else {
								return item2 = {
									value: item2,
									class: 'bggreen',
									id: 'lineId'
								}
							}
						})
					})
					while (arrlist.some(item => Array.isArray(item))) {
						arrlist = [].concat(...arrlist);
					}
					that.newList.unshift(arrlist);
				});
				this.drawLine()
				// console.log("this.aryTotalStatistics:", that.aryTotalStatistics);
			},
			createCanvas(id) {
				let canvas;
				let context;
				if (!document.getElementById(id)) {
					canvas = document.createElement('canvas');
					canvas.id = id;
					canvas.width = document.body.scrollWidth;
					canvas.height = document.body.scrollHeight;
					document.body.appendChild(canvas);
					context = canvas.getContext('2d');
				} else {
					canvas = document.getElementById(id);
					context = document.getElementById(id).getContext('2d');
				}
				return (() => {
					return {
						canvas,
						context
					};
				})();
			},
			drawLine(flag) {
				const canvas = this.createCanvas('canvasBox').canvas;
				const context = this.createCanvas('canvasBox').context;
				if (!flag) {
					context.clearRect(0, 0, canvas.width, canvas.height);
					return;
				}
				const selectedNumHeight = document.querySelector('.js-selected-num').offsetHeight;
				context.clearRect(0, 0, canvas.width, canvas.height); //清空了再画                       
				const missCoordinateObj = this.getMissCoordinateObj();
				context.beginPath(); //通过清空子路径列表开始一个新路径
				context.strokeStyle = this.missLineColor;
				for (let posIndex in missCoordinateObj) {
					const arr = missCoordinateObj[posIndex];
					console.log(arr)
					for (let index = 0, length = arr.length; index < length - 1; index++) {
						const xFrom = arr[index].x;
						const yFrom = arr[index].y + selectedNumHeight;
						const xTo = arr[index + 1].x;
						const yTo = arr[index + 1].y;
						context.moveTo(xFrom, yFrom);
						context.lineTo(xTo, yTo);
					}
					context.stroke();
				}
			},
			getMissCoordinateObj() {
				const selectedNumArr = [...document.querySelectorAll('.js-selected-num')];
				const coordinateObj = {};
				selectedNumArr.forEach((element, index) => {
					const posIndex = element.getAttribute('pos-index');
					coordinateObj[posIndex] = coordinateObj[posIndex] || [];
					const elementWidth = element.offsetWidth;
					const x = offsetDis(element).left + elementWidth / 2;
					const y = offsetDis(element).top;
					coordinateObj[posIndex].push({ x, y});
				});
				return coordinateObj;
			},

			
		},
		watch: {
			tableData: function(e) {
				if (e.listdata && e.firstStatic) {
					var data = e.listdata
					this.pushData(data)
				}
			}
		},
		mounted() {
			if (this.tableData.listdata && this.tableData.firstStatic) {
				var data = this.tableData.listdata
				this.pushData(data)
			}

		}
	}
</script>

<style scoped>


</style>
