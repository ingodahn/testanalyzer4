<template>
    <Line :data="chartData" :options="chartOptions" />
  </template>
<script>
// See vue-charts documentation
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'LineChart',
  components: { Line },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    //return this.chartData
  }
  /*
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, {
      responsive: true,
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: false,
              maxRotation: 90
              //minRotation: 90
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              display: true,
              beginAtZero: true
              //min: 0
            }
          }
        ]
      }
    });
  }
  */
};
</script>
