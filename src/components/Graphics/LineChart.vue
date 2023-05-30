<template>
  <Line :data="chartData" :options="chartOptions" :style="myStyles"/>
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
      },
      width: "1ß00"
    }
  },
  computed: {
    myStyles: function () {
      return {
        width: "100%",
        //width: "50%",
        position: 'relative'
      }
    }
  }

}
</script>
