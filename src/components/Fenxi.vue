<template>
  <div class="data-analysis">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据分析</el-breadcrumb-item>
      <el-breadcrumb-item>分析列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 图表区域 -->
      <div class="chart-row">
        <!-- 第一个图表：交易量趋势 -->
        <div class="chart-container">
          <div id="transaction-trend-chart" class="echarts-chart"></div>
        </div>

        <!-- 第二个图表：订单来源分布 -->
        <div class="chart-container">
          <div id="order-source-chart" class="echarts-chart"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  data() {
    return {
      transactionTrendData: [],
      orderSourceData: [],
    };
  },
  mounted() {
    this.fetchTransactionTrendData();
    this.fetchOrderSourceData();
  },
  methods: {
    fetchTransactionTrendData() {
      axios.get('http://localhost:8088/transaction-trend')
        .then(response => {
          this.transactionTrendData = response.data;
          this.initTransactionTrendChart();
        })
        .catch(error => {
          console.error('获取交易趋势数据时出错：', error);
        });
    },
    fetchOrderSourceData() {
      axios.get('http://localhost:8088/order-source')
        .then(response => {
          this.orderSourceData = response.data;
          this.initOrderSourceChart();
        })
        .catch(error => {
          console.error('获取订单源数据时出错：', error);
        });
    },
    initTransactionTrendChart() {
      const transactionTrendChart = echarts.init(document.getElementById('transaction-trend-chart'));
      const xAxisData = this.transactionTrendData.map(item => item.day);
      const seriesData = this.transactionTrendData.map(item => item.sales);

      const option = {
        title: {
          text: '交易量趋势',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [{
          name: '销量',
          type: 'line',
          data: seriesData,
        }],
      };
      transactionTrendChart.setOption(option);
    },
    initOrderSourceChart() {
      const orderSourceChart = echarts.init(document.getElementById('order-source-chart'));
      const seriesData = this.orderSourceData.map(item => ({
        value: item.count,
        name: item.source,
      }));

      const option = {
        title: {
          text: '订单来源分布',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: seriesData.map(item => item.name),
        },
        series: [{
          name: '订单来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        }],
      };
      orderSourceChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.data-analysis {
  padding: 20px;
}

.chart-row {
  display: flex;
  justify-content: space-between;
}

.chart-container {
  width: 48%;
  margin-bottom: 30px;
}

.echarts-chart {
  width: 100%;
  height: 400px;
}
</style>
