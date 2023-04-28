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
  },
  data() {
    return {
      chartOptions: {
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
          /*
          yAxes: [
            {
              ticks: {
                display: true,
                beginAtZero: true,
                suggestedMin: 0,
                //min: 0
              }
            }
          ]
          */
          y: {
            beginAtZero: true
          }
        }
      }
    }
  }

}
</script>
