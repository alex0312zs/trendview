<template>
	<view>
		<table id="left_table3" class="table-pl4" cellpadding="0" cellspacing="0" border="0">
			<tbody>
				<!-- <tr>
					<th>一等奖综合统计数据</th>
				</tr> -->
				<tr>
					<td>{{this.$t('trendview.occurrenceNumber')}}</td>
				</tr>
				<tr>
					<td>{{this.$t('trendview.maxOmission')}}</td>
				</tr>
				<tr>
					<td>{{this.$t('trendview.maxConnectout')}}</td>
				</tr>
				<tr>
					<td>{{this.$t('trendview.averageMiss')}}</td>
				</tr>
				<tr>
					<td>{{this.$t('trendview.currentMiss')}}</td>
				</tr>
			</tbody>
		</table>
	</view>
</template>

<script>
	export default {
		name:"leftTable",
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
