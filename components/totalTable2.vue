<template>
	<view class="content_trend">
		<!-- 后两位总表 -->
		<div class="qxc-flex m-top" id="content">
			<div id="left_div" class="qxc-left">
				<div id="left_div1" class="l-tops">
					<publicT1></publicT1>
				</div>
				<div id="left_div2s" class="l-bots">
					<div>
						<table id="left_table2s" class="table-pl3" cellpadding="0" cellspacing="0" border="0">
							<tr v-for="(item,index) in leftData1" :key='index'>
								<td>{{item.periodno}}</td>
								<td>{{item.twoend}}</td>
							</tr> 
						</table>
						<publicT2></publicT2>
					</div>
				</div>
			</div>
			<!-- 左边部分结束 -->
			<div id="right_div" class="qxc-right">
				<div id="right_div1s" class="r-tops">
					<!-- 右边表头1 -->
					<secTable1 class="rtp2"></secTable1>
				</div>
				<div id="right_div2s" class="r-bots">
					<div style='width:20rem'>
						<table id="right_table2s" cellpadding="0" cellspacing="0" border="0" class="table-pl3">
							<tbody></tbody>
							<!-- <tr v-for="(item,index) in listContent" :key='index'>
								<td v-for="(item2, index2) in item.join(',').split(',')" :key='index2' :class=''>{{item2}}</td>
							</tr> -->
							<tr v-for="(item,index) in newList2" :key='index'>
								<td :colspan="index2==13 || index2==27 ?2:1" v-for="(item2, index2) in item" :key='index2' :class='item2.class'>{{item2.value}}</td>
							</tr>
						</table>
						<!-- 右边 下表头2 -->
						<!-- <secTable2 class="rbt2"></secTable2> -->
						<table id="right_table5s" cellpadding="0" cellspacing="0" border="0" class="table-pl3">
							<tr>
								<td v-for="(item,index) in tableDatar.twoendStatic">{{item.showtimes}}</td>
							</tr>
							<tr>
								<td v-for="(item,index) in tableDatar.twoendStatic">{{item.maxmisstimes}}</td>
							</tr>
							<tr>
								<td v-for="(item,index) in tableDatar.twoendStatic">{{item.maxcontinuetimes}}</td>
							</tr>
							<tr>
								<td v-for="(item,index) in tableDatar.twoendStatic">{{item.permissstimes}}</td>
							</tr>
							<tr>
								<td v-for="(item,index) in tableDatar.twoendStatic">{{item.curmisstimes}}</td>
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
	import secTable1 from '@/components/bt/secTable1.vue';
	import secTable2 from '@/components/bt/secTable2.vue';
		import IScroll from '@/js/iscroll-probe.js'
	//#ifdef H5
	import $ from '@/js/jquery-3.4.1.min.js'
	//#endif 
	export default {
		components: {
			publicT1,
			publicT2,
			secTable1,
			secTable2
		},
		props: {
			tableDatar:{}
		},
		data() {
			return {
				selectedIndexObj2:[],
				listContent:[],
				leftData1:[],
				newList2:[]
			}
		},
		methods: {
			pushData(listdata) {
				this.listContent=[]
				this.selectedIndexObj2=[]
				this.newList2=[]
				this.leftData1=[]
				var that = this
				var arrlist=[]
				var arr1=[that.$t('trendview.big'),that.$t('trendview.small'),
				that.$t('trendview.odd'),that.$t('trendview.even')]
				console.log(listdata[0]) // 201303
				listdata.forEach(function(element, index) {
						that.leftData1.unshift(element)
						var drawResult = element.twoend.split('');
						let jsonTempList = [];
						for (var i = 0; i < drawResult.length; i++) {
							let cbCard = drawResult[i];
							jsonTempList[i] = !jsonTempList[i] ? [] : jsonTempList[i];
							let aryCards = [];
							for (var j = 0; j < 10; j++) {
								that.selectedIndexObj2[i] = that.selectedIndexObj2[i] || [];
								if (cbCard == j) {
									that.selectedIndexObj2[i][j] = index + 1;
									aryCards[j]=j
								} else {
									var num = index + 1 - (that.selectedIndexObj2[i][j] || 0);
									aryCards[j]=num
								}
							}
							jsonTempList[i] = aryCards;
						}
						that.listContent.unshift(jsonTempList);
						that.listContent.forEach((item3,index3)=>{
							item3.splice(1,0,arr1)
							item3.push(arr1)
						})
						// console.log(jsonTempList)
						arrlist=jsonTempList.map((item,idx)=>{
								if(idx==0){
									return item=item.map((item2,index2)=>{
										if(drawResult[0] == item2 && drawResult[0] == index2 ){
											return item2={value:item2,class:'bgred2',id:'lineId',col:1}
										}else{
											return item2={value:item2,class:'',id:'lineId',col:1}
										}
									})
								}else if(idx ==2){
									return item=item.map((item2,index2)=>{
										if(drawResult[1] == item2 && drawResult[1] == index2 ){
											return item2={value:item2,class:'bgred2',id:'lineId',col:1}
										}else{
											return item2={value:item2,class:'',id:'lineId',col:1}
										}
									})
								}
								else{ // 1 或者 3的情况 大 小 奇 偶
									if(idx==1){
										return item=item.map((item2,index2)=>{
											if(index2==0){
												if(drawResult[0]>=5){
													return item[0]={value:that.$t('trendview.big'),class:'bgblue2',id:'lineId',col:1}
												}else{
													return item[0]={value:that.$t('trendview.big'),class:'',id:'lineId',col:1}
												}
											}else if(index2==1){
												if(drawResult[0]<5 ){
													return item[1]={value:that.$t('trendview.small'),class:'bgblue2',id:'lineId',col:1}
												}else{
													return item[1]={value:that.$t('trendview.small'),class:'',id:'lineId',col:1}
												}
											}else if(index2==2){
												if(drawResult[0]%2!=0){
													return item[2]={value:that.$t('trendview.odd'),class:'bgyellow2',id:'lineId',col:1}
												}else{
													return item[2]={value:that.$t('trendview.odd'),class:'',id:'lineId',col:1}
												}
											}else if(index2==3){
												if(drawResult[0]%2==0){
													return item[3]={value:that.$t('trendview.even'),class:'bgyellow2',id:'lineId2',col:2}
												}else{
													return item[3]={value:that.$t('trendview.even'),class:'',id:'lineId2',col:2}
												}
											}
										})
									}else if(idx==3){
										return item=item.map((item2,index2)=>{
											if(index2==0){
												if(drawResult[1]>=5){
													return item[0]={value:that.$t('trendview.big'),class:'bgblue2',id:'lineId',col:1}
												}else{
													return item[0]={value:that.$t('trendview.big'),class:'',id:'lineId',col:1}
												}
											}else if(index2==1){
												if(drawResult[1]<5 ){
													return item[1]={value:that.$t('trendview.small'),class:'bgblue2',id:'lineId',col:1}
												}else{
													return item[1]={value:that.$t('trendview.small'),class:'',id:'lineId',col:1}
												}
											}else if(index2==2){
												if(drawResult[1]%2!=0){
													return item[2]={value:that.$t('trendview.odd'),class:'bgyellow2',id:'lineId',col:1}
												}else{
													return item[2]={value:that.$t('trendview.odd'),class:'',id:'lineId',col:1}
												}
											}else if(index2==3){
												if(drawResult[1]%2==0){
													return item[3]={value:that.$t('trendview.even'),class:'bgyellow2',id:'lineId2',col:2}
												}else{
													return item[3]={value:that.$t('trendview.even'),class:'',id:'lineId2',col:2}
												}
											}
										})
									}
									
									
								}
						})
						while(arrlist.some(item=>Array.isArray(item))) {
						    arrlist = [].concat(...arrlist);
						}
						// console.log(arrlist)
						that.newList2.unshift(arrlist);
				});
				that.listContent.forEach((item,index)=>{
					item.splice(1,0,arr1)
					item.push(arr1)
				})
				// this.initScroll();
			},
			initScroll() {
				//一等奖
				var right_div2 = document.getElementById('right_div2s');
				right_div2.addEventListener('scroll', function() {
					var right_div2_top = this.scrollTop;
					var right_div2_left = this.scrollLeft;
					if (right_div2_top < 0) {
						right_div2_top = 0;
					}
					if (right_div2_left < 0) {
						right_div2_left = 0;
					}
					document.getElementById('left_div2s').scrollTop = right_div2_top;
					document.getElementById('right_div1s').scrollLeft = right_div2_left;
				});
			}
		},
		watch:{
			tableDatar:function(e){
				if(e.listdata&&e.firstStatic){
					var data=e.listdata  //反转让077258 从第一个 变到最后一个
					this.pushData(data) 
				}
				console.log(e) 
			}
		},
		mounted() {
			if(this.tableDatar.listdata&&this.tableDatar.firstStatic){
				var data=this.tableDatar.listdata  // .reverse()反转让077258 从第一个 变到最后一个
				this.pushData(data)
			}
		}
	}
</script>

<style scoped>
	
	
</style>
