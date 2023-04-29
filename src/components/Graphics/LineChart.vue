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
        tension: 0.4,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  }

}
</script>
