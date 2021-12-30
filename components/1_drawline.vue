<template>
	<view class="content_trend">
		<!-- 一等奖总表 -->
		<div class="qxc-flex m-top" id="content">
			<div id="left_div" class="qxc-left">
				<div id="left_div1" class="l-top">
					<publicT1></publicT1>
				</div>
				<div id="left_div2" class="l-bot">
					<table id="left_table2" class="table-pl3" cellpadding="0" cellspacing="0" border="0">
						<tr v-for="(item,index) in leftData0" :key='index'>
							<td>{{item.periodno}}</td>
							<td>{{item.firstprize}}</td>
						</tr> 
					</table>
					<publicT2></publicT2>
				</div>
			</div>
			<!-- 左边部分结束 -->
			<div id="right_div" class="qxc-right" style="width: 335px;">
				<div id="right_div1" class="r-top">
					<!-- 右边表头1 -->
					<firTable1 ></firTable1>
				</div>
				<div id="right_div2" style="position: relative;" class="r-bot">
					<table id="right_table2" cellpadding="0" cellspacing="0" border="0" class="table-pl3">
						<!-- <tr v-for="(item,index) in aryTotalStatistics" :key='index'>
							<td v-for="(item2, index2) in item.join(',').split(',')" :key='index2' :class='getActive(item,item2)'>{{item2}}</td>
						</tr> -->
						<tr v-for="(item,index) in newList" :key='index'>
							<td v-for="(item2, index2) in item" :key='index2' :class='item2.class'>{{item2.value}}</td>
						</tr>
						<div id="canvasBox"></div>
					</table>
					<!-- 右边 下表头2 -->
					<firTable2 class="rbt1"></firTable2>
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
	</view>
</template>

<script>
	import publicT1 from '@/components/bt/publicT1.vue';
	import publicT2 from '@/components/bt/publicT2.vue';
	import firTable1 from '@/components/bt/firTable1.vue';
	import firTable2 from '@/components/bt/firTable2.vue';
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
		props:['tableData'],
		data() {
			return {
				selectedIndexObj:[],
				aryTotalStatistics:[],
				newList:[],
				leftData0:[]
			}
		},
		methods: {
			getActive(item,item2){
				
			},
			pushData(listdata) {
				this.aryTotalStatistics=[]
				this.leftData0=[]
				var that = this
				var arrlist=[]
				// console.log(listdata[0]) // 201303
				listdata.forEach(function(element, index) {
						that.leftData0.unshift(element) //标题反转放入201303放最后，  077258放在最前面
						// console.log(element.firstprize.split('')) 201303
						var numArr = element.firstprize.split(''); //遍历  201303
						let jsonTempList = [];   //创造一行数据出来 例如201303
						for (let i = 0; i < numArr.length; i++) { //遍历 201303  numArr[i]=2,0,1,3,0,3
						  let cbCard = numArr[i];
						  jsonTempList[i] = jsonTempList[i] || []; //24个数组（数组长度为6） 6个空数组
						  let aryCards = [];
						  for (let j = 0; j < 10; j++) { //从0-9 循环10次
						    let m = that.aryTotalStatistics.length;
						    let dwCount = 0;
						    if (m > 0) {
						      dwCount = that.aryTotalStatistics[0][i][j] || 0; //应该
						    }
						    aryCards[j] = cbCard == j ? j :  dwCount + 1; //0-9的那个数组   里面的值
						  }
						  // console.log(aryCards,i)
						  jsonTempList[i] = aryCards
						}
						// console.log(jsonTempList,index) //24个数组（数组长度为6）
						that.aryTotalStatistics.unshift(jsonTempList);
						arrlist=jsonTempList.map((item,idx)=>{
							return item=item.map((item2,index2)=>{
								if(numArr[idx]==item2){
									return item2={value:item2,class:'bgred',id:'lineId'}
								}else{
									return item2={value:item2,class:'bggreen',id:'lineId'}
								}
							})
						})
						while(arrlist.some(item=>Array.isArray(item))) {
						    arrlist = [].concat(...arrlist);
						}
						// console.log(arrlist)
						that.newList.unshift(arrlist);
				});
				// console.log("this.aryTotalStatistics:", that.aryTotalStatistics);
				// console.log("that.leftData0[0]:", that.leftData0[0]); //077258放在最前面没错
				this.initScroll();
			},
			initScroll() {
				//一等奖
				var right_div2 = document.getElementById('right_div2');
				right_div2.addEventListener('scroll', function() {
					var right_div2_top = this.scrollTop;
					var right_div2_left = this.scrollLeft;
					if (right_div2_top < 0) {
						right_div2_top = 0;
					}
					if (right_div2_left < 0) {
						right_div2_left = 0;
					}
					document.getElementById('left_div2').scrollTop = right_div2_top;
					document.getElementById('right_div1').scrollLeft = right_div2_left;
				});
			},
			drawLine() {
				let ids = '';
				for (let i = 0; i < this.listData.listdata.length; i++) {
					ids += 'T' + i + '_,';
				}
				console.log(ids)
				ids = ids.substring(0, ids.length - 1);
				console.log(ids)
				this.createLine(ids, 20, '#dcbd85', 'canvasdiv', '#dcbd85');
			},
			createLine(ids, w, c, div, bg) {
				let list = ids.split(',');
				console.log(list)
				for (let y = list.length - 1; y > 0; y--) {
					let tid = $('#' + list[y] + y);
					console.log(list[y] + y)
					let fid = $('#' + list[y - 1] + y);
					console.log(list[y - 1] + y)
					let f_width = fid.outerWidth();
					let f_height = fid.outerHeight();
					let f_position = fid.position();
					let f_top = f_position.top;
					let f_left = f_position.left;
					let t_position = tid.position();
					let t_top = t_position.top;
					let t_left = t_position.left;
					let cvs_left = Math.min(f_left, t_left);
					let cvs_top = Math.min(f_top, t_top);
					let cvs = document.createElement('canvas');
					let cvsWidth =
						Math.abs(f_left - t_left) < w ?
						w :
						Math.abs(f_left - t_left);
					let cvsHeight = Math.abs(f_top - t_top);
					cvs.width = cvsWidth;
					cvs.height = cvsHeight;
					cvs.style.top = cvs_top + parseInt(f_height / 2) + 'px';
					cvs.style.left = cvs_left + parseInt(f_width / 2) + 'px';
					cvs.style.position = 'absolute';
					let cxt = cvs.getContext('2d');
					cxt.save();
					cxt.strokeStyle = c;
					cxt.lineWidth = 1;
					cxt.lineJoin = 'round';
					cxt.beginPath();
					cxt.moveTo(f_left - cvs_left, f_top - cvs_top);
					cxt.lineTo(t_left - cvs_left, t_top - cvs_top);
					cxt.closePath();
					cxt.stroke();
					cxt.restore();
					$('#' + div).append(cvs);
				}
			}
		},
		// watch:{
		// 	tableData:function(e){
		// 		this.pushData(e)
		// 	}
		// },
		mounted() {
			// console.log(this.tableData,'table1')
			if(this.tableData.listdata&&this.tableData.firstStatic){
				var data=this.tableData.listdata.reverse()  //反转让077258 从第一个 变到最后一个
				// console.log(this.tableData.listdata)
				this.pushData(data)
				// this.OnAnalysisHistoryData(this.tableData)
			}
		}
	}
</script>

<style scoped>
	

</style>
