<template>
  <v-container :style="chartStyle">
  <Bar :data="chartData" :options="chartOptions"/>
  </v-container>
</template>
  
<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  data() {
    return {
      height: 400,
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    layout: {
      type: String,
      default: "all"}
  },
  computed: {
    chartStyle () {
      return this.layout == "print" ? "align: center; max-width: 650px;" : "align: center; max.width: 100%;"
    }
  },
}
</script>