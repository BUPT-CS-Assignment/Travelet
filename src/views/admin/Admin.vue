<template>
  <div class="main-container">
    <div class="container">
      <el-date-picker class="element" v-model="start_month" type="month" @change="handleChange" value-format="YYYY-MM"></el-date-picker>
      <div class="element">~</div>
      <el-date-picker class="element" v-model="end_month" type="month" @change="handleChange" value-format="YYYY-MM"></el-date-picker>
      <div class="tag-location-picker ml-auto">
        <el-select v-model="current_tag" placeholder="标签" class="combo-box" @change="handleChange">
          <el-option v-for="tag in tagOptions" :key="tag" :label="tag" :value="tag"></el-option>
        </el-select>
        <div style="width: 20px;"></div>
        <el-select v-model="current_location" placeholder="地点" class="combo-box"  @change="handleChange">
          <el-option v-for="item in cities" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
    </div>
    <div id="chart" :style="{ width: '80%', height: '400px' }" class="charts"></div>
    <v-data-table :headers="headers" :items="filteredBills" :items-per-page="10"></v-data-table>
  </div>
</template>

<style>
.main-container {
  display: flex;
  margin-top: 50px;
  flex-direction: column;
  align-items: center;
}

.container {
  width: 70%;
  display: flex;
  flex-direction: row;
}

.month-picker {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.tag-location-picker {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 400px;
  max-width: 1000px;
}

.charts {
  margin-top: 20px;
}

.element {
  margin-right: 20px;
}
</style>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import * as echarts from 'echarts'
import * as QUERY from '@/plugins/query'
import CITIES from '@/plugins/cities'
import {assert} from '@/plugins/query'

const fetchandProcessBillData = async (currentTag, currentLocation, startTime, endTime) => {
  // Fetch bill data
  const billData = await QUERY.post('/api/admin/query/bill', {
    tag: currentTag,
    location: currentLocation,
    start_time: startTime,
    end_time: endTime,
  });

  // Process bill data
  const Bills = billData.data.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const sortedBills = Object.values(Bills).sort((a, b) => {
    return a.year < b.year || (a.year === b.year && a.month < b.month) ? -1 : 1;
  });
  return sortedBills;
};

export default {
  setup() {
    // Reactive properties
    const Router = useRouter();
    const current_tag = ref('bad');
    const current_location = ref('北京市，海淀区');
    const start_month = ref('2023-09');
    const end_month = ref('2023-12');
    const tagOptions = ref([]);
    const cities = ref([]);
    const filteredBills = ref([]);
    const headers = ref([
      { title: 'Id', value: 'id' },
      { title: 'Year', value: 'year' },
      { title: 'Month', value: 'month' },
      { title: 'Amount', value: 'amount' },
      { title: 'Profit', value: 'profit' }
    ]);
    
    Object.keys(CITIES).forEach((province) => {
      CITIES[province].forEach((city) => {
        cities.value.push(province + '，' + city);
      });
    });

    // On mounted lifecycle hook
    onMounted(async () => {
      if(!assert()) {
        Router.push('/login');
        return;
      }
      // Fetch tag options
      const tagData = await QUERY.post('/api/common/query/tags');
      tagOptions.value = tagData.data;

      const sortedBills = await fetchandProcessBillData(
        current_tag.value,
        current_location.value,
        start_month.value,
        end_month.value
      );
      
      filteredBills.value = sortedBills.map(item => {
        const filteredItem = {};
        headers.value.forEach(header => {
          const field = header.title.toLowerCase();
          filteredItem[field] = item[field];
        });
        return filteredItem;
      });
      console.log(filteredBills);
      // Initialize and configure echarts
      const myChart = echarts.init(document.getElementById('chart'));
      const option = {
        tooltip: {},
        legend: {
          data: ['盈利'],
        },
        xAxis: {
          data: sortedBills.map(item => {
            return item.year + '-' + item.month;
          }),
        },
        yAxis: {
          axisLabel: {
            formatter: '{value} 元',
          },
        },
        series: [
          {
            name: '盈利',
            type: 'line',
            smooth: true,
            data: sortedBills.map(item => item.profit),
          },
        ],
      };
      myChart.setOption(option);
    });

    return {
      headers,
      filteredBills,
      current_tag,
      current_location,
      start_month,
      end_month,
      tagOptions,
      cities,
      fetchandProcessBillData
    };
  },
  methods: {
    async handleChange() {
      const sortedBills = await this.fetchandProcessBillData(
        this.current_tag,
        this.current_location,
        this.start_month,
        this.end_month
      );

      // Update filteredBills
      this.filteredBills = sortedBills.map(item => {
        const filteredItem = {};
        this.headers.forEach(header => {
          const field = header.title.toLowerCase();
          filteredItem[field] = item[field];
        });
        return filteredItem;
      });
    },
  }
};
</script>
