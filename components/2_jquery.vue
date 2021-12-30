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
						<tbody></tbody>
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
						<tbody></tbody>
					</table>
					<!-- 右边 下表头2 -->
					<firTable2 class="rbt1"></firTable2>
					<table id="right_table5" cellpadding="0" cellspacing="0" border="0" class="table-pl3">
						<tbody></tbody>
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
				selectedIndexObj:[]
			}
		},
		methods: {
			pushData(data) {
				var str = '',
					str2 = '',
					str3 = '',
					str4 = '',
					str5 = '',
					str6 = '',
					str7 = '';
				console.log(data)
				var that = this
				data.listdata.forEach(function(element, index) {
						str += '<tr>';
						str2 += '<tr><td class="itm-qih">' + element.periodno + '</td><td class="itm-qih">' + element
							.firstprize + '</td></tr>'
						var drawResult = element.firstprize.split('');
						for (var i = 0; i < 6; i++) {
							for (var y = 0; y < 10; y++) {
								that.selectedIndexObj[i] = that.selectedIndexObj[i] || [];
								if (drawResult[i] == y) {
									that.selectedIndexObj[i][y] = index + 1;
									// str += '<td class="red"' +  "id=T" + i + "_" + y + ">" + y + '</td>';
									str += `<td class="red" id="T${i}_${y}">${y}</td>`;
								} else {
									var num = index + 1 - (that.selectedIndexObj[i][y] || 0);
									// var num = '空'
									str += '<td>' + num + '</td>';
								}
							}
						}
						str += '</tr>';
						if(index+1==1){
							console.log(1,that.selectedIndexObj)
						}
				});
				
					str3 += '<tr>'
					str4 += '<tr>'
					str5 += '<tr>'
					str6 += '<tr>'
					str7 += '<tr>'
					data.firstStatic.forEach(function(item) {
						str3 += '<td>' + item.showtimes + '</td>' //出现次数
						str4 += '<td>' + item.maxmisstimes + '</td>' //最大遗漏期数
						str5 += '<td>' + item.maxcontinuetimes + '</td>' //最大连出期数
						str6 += '<td>' + item.permissstimes + '</td>' //平均遗漏值 
						str7 += '<td>' + item.curmisstimes + '</td>' //当前遗漏期数 
					})
					str3 += '</tr>'
					str4 += '</tr>'
					str5 += '</tr>'
					str6 += '</tr>'
					str7 += '</tr>'
				var strTotal = str3 + str4 + str5 + str6 + str7
				$('#left_table2 tbody').html(str2);
				$('#right_table2 tbody').html(str);
				$('#right_table5 tbody').html(strTotal);
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
			scroll2() {
				var startPos={},endPos ={}
				var isScrolling=0   //这个参数判断是垂直滚动还是水平滚动
				var dom= document.getElementById('right_div2')
				dom.addEventListener('touchstart', function(event) { // do touchstart
				console.log(event)
					var touch = event.targetTouches[0]; //touches数组对象获得屏幕上所有的touch，取第一个touch
					startPos = {
						x: touch.pageX,
						y: touch.pageY,
						time: +new Date
					}; //取第一个touch的坐标值  滑动起点位置
					console.log(startPos,'开始滑动的点')
				});
				dom.addEventListener('touchmove', function(event) { // do touchmove
					// event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
					if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;  //当屏幕有多个touch或者页面被缩放过，就不执行move操作
					var touch = event.targetTouches[0];
					endPos = {
						x: touch.pageX - startPos.x,
						y: touch.pageY - startPos.y
					};
					// 滑动结束的时候获取最后一个坐标
					isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 :0;  //isScrolling为1时，表示纵向滑动，0为横向滑动
					if (isScrolling === 0) {
						console.log(endPos.x,dom.timeStamp,'横向滚动')
						document.getElementById('right_div1').scrollLeft  = dom.scrollLeft;
					}else{
						console.log(endPos.y,dom.timeStamp,'纵向滚动')
						document.getElementById('left_div2').scrollTop = dom.scrollTop;
					}
				});
				dom.addEventListener('touchend', function(e) {
				    // do touchend
					console.log(endPos,'滑动结束的点')
					var duration = +new Date - startPos.time; //滑动的持续时间
					if (isScrolling == 0) { //当为水平滚动时
						document.getElementById('right_div1').scrollLeft = dom.scrollLeft;
						console.log(dom.scrollLeft,'横向距离')
					}else{
						document.getElementById('left_div2').scrollTop = dom.scrollTop;
						console.log(dom.scrollTop,'纵向距离')
					}
					//解绑事件
					dom.removeEventListener('touchmove', this, false);
					dom.removeEventListener('touchend', this, false);
				});
				// 禁止鼠标滑轮
				dom.onmousewheel = function(event) {
				event = event || window.event;
				return false;
				};
			}
			
		},
		watch:{
			tableData:function(e){
				this.pushData(e)
			}
		},
		mounted() {
			// console.log(this.tableData,'table1')
			if(this.tableData.listdata&&this.tableData.firstStatic){
				this.pushData(this.tableData)
			}
		}
	}
</script>

<style scoped>
	

</style>
