<template>
  <h1>Admin</h1>
  <div id="chart" :style="{width: '100%', height: '400px'}"></div>
</template>

<script>
import * as echarts from 'echarts';
import { ref, reactive, onMounted } from 'vue';
import * as QUERY from '@/plugins/query';

export default {
  setup() {
    const Bills = reactive({});
    const current_tag = ref('bad');
    const current_location = ref('北京市，海淀区');

    onMounted(async () => {
      const data = await QUERY.post('/api/admin/query/bill', {
        tag: current_tag.value,
        location: current_location.value
      });

      data.data.forEach(item => {
        Bills[item.id] = item;
      });

      const sortedBills = Object.values(Bills).sort((a, b) => {
        return a.year < b.year || (a.year === b.year && a.month < b.month) ? -1 : 1;
      });

      Object.keys(Bills).forEach(key => {
        delete Bills[key];
      });

      sortedBills.forEach(item => {
        Bills[item.id] = item;
      });

      const myChart = echarts.init(document.getElementById('chart'));
      const option = {
        title: {
          text: '账目总览'
        },
        tooltip: {},
        legend: {
          data:['盈利']
        },
        xAxis: {
          data: sortedBills.map(item => {
            return item.year + '-' + item.month;
          })
        },
        yAxis: {
          axisLabel: {
            formatter: '{value} 元'
          }
        },
        series: [{
          name: '盈利',
          type: 'line',
          smooth: true,
          data: sortedBills.map(item => item.profit)
        }]
      };
      myChart.setOption(option);
    });

    return { Bills };
  }
};
</script>
