<template>
  <v-container v-if="playerType == 'player'">
    <v-card class="chart-container" elevation="20">
      <v-card-title class="text-center">
        <span>{{ $t("Player.q") }} {{ curGroupStart + 1 }} -
          {{ curGroupEnd }}</span>
      </v-card-title>
      <v-card-actions class="justify-center" v-if="ChartGroups.length > 1">
        <!-- Go to first -->
        <v-btn icon color="primary" v-on:click="curGroup = 0" :disabled="curGroup == 0"
          v-if="ChartGroups.length > 2"><v-icon>mdi-skip-backward</v-icon>
        </v-btn>
        <v-btn icon color="primary" v-on:click="curGroup--" :disabled="curGroup == 0"><v-icon>mdi-step-backward</v-icon>
        </v-btn>
        <v-btn icon color="primary" v-on:click="curGroup++"
          :disabled="curGroup == ChartGroups.length - 1"><v-icon>mdi-step-forward</v-icon>
        </v-btn>
        <v-btn icon color="primary" v-on:click="curGroup = ChartGroups.length - 1"
          :disabled="curGroup == ChartGroups.length - 1" v-if="ChartGroups.length > 2"><v-icon>mdi-skip-forward</v-icon>
        </v-btn>
      </v-card-actions>
      <LineChart :chartData="ThisChart(curGroupStart, curGroupEnd)"></LineChart>
    </v-card>
  </v-container>
  <v-container v-else style="align: center; max-width: 650px;">
    <v-card class="chart-containerx" elevation="20">
      <v-card-title class="text-center">{{ $t("Player.q") }}</v-card-title>
      <LineChart :chartData="ThisChart(0, Chart.labels.length)"></LineChart>
    </v-card>
  </v-container>
</template>

<script>
import LineChart from "./Graphics/LineChart.vue";
export default {
  components: {
    LineChart
  },
  props: {
    Chart: {
      type: Object,
      default: () => {
        return {
          labels: [],
          datasets: []
        };
      }
    },
    Layout: {
      type: String,
      default: "all"
    }
  },
  data() {
    return {
      curGroup: 0
    };
  },
  methods: {
    ThisChart: function (start, end) {
      var chart = {
        labels: [],
        datasets: []
      };
      if (this.Chart.labels.length == 0) {
        return {
          data: [chart]
        };
      }

      chart.labels = this.Chart.labels
        .slice(start, end)
        .map(t => (t.length < 40 ? t : t.substring(0, 40) + "..."));
      this.Chart.datasets.forEach(d => {
        var chartData = {
          label: d.label,
          data: d.data.slice(start, end),
          borderColor: d.borderColor
        };
        chart.datasets.push(chartData);
      });
      return chart;
    },
    ResetCurGroup: function () {
      this.curGroup = 0;
    }
  },
  computed: {
    // Chart-Funktionen
    ShowChart: function () {
      return this.Chart.labels.length;
    },
    ChartGroups: function () {
      var ar1 = [];
      var n = 20;
      var start = 0;
      var ln = this.Chart.labels.length;
      do {
        if (start + 2 * n <= ln) {
          ar1.push([start, start + n]);
          start = start + n;
        } else if (start + (3 * n) / 2 >= ln) {
          if (start + n <= ln) {
            ar1.push([start, start + n]);
            if (start + n < ln) ar1.push([start + n, ln]);
          } else {
            ar1.push([start, ln]);
          }
          start = ln;
        } else {
          ar1.push([start, start + n / 2]);
          ar1.push([start + n / 2, ln]);
          start = ln;
        }
      } while (start < ln);
      return ar1;
    },
    curGroupStart: function () {
      if (this.curGroup >= this.ChartGroups.length) this.ResetCurGroup();
      return this.ChartGroups.length ? this.ChartGroups[this.curGroup][0] : 0;
    },
    curGroupEnd: function () {
      if (this.curGroup >= this.ChartGroups.length) this.ResetCurGroup();
      return this.ChartGroups.length ? this.ChartGroups[this.curGroup][1] : 0;
    },
    playerType: function() {
      return (this.Layout == "print")?"showAll":"player";
    }
  }
};
</script>

<style scoped>
.chart-container {
  border: 1px solid hsl(198, 65%, 40%);
  border-radius: 10px;
  box-shadow: -10px 19px 15px silver;
  max-width: 100%;
}
</style>
