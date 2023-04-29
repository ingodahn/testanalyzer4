<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
  <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>
  
<script>
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar, Line },
  data() {
    return {
      chartData: {
        labels: ['January', 'February', 'March'],
        datasets: [{ data: [40, 20, 30] }]
      },
      chartOptions: {
        responsive: true,
        scales: {
          /*
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
                //display: true,
                beginAtZero: true,
                //suggestedMin: 0,
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