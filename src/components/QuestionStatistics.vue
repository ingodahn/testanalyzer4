<template>
  <v-container id="questionStatistics">
    <h2>{{ $t("Stat.h2") }}</h2>
    <div v-if="Questions.length > 0" style="margin-top: 25px;">
      <ChartPlayer :Chart="statChart"></ChartPlayer>
      <b>{{ $t("Stat.hint") }}:</b>
      <div v-if="Mode.multiLine || Mode.multiQuestion">
        <span v-html="multiLineHint"></span>
        <img src="/info.png" width="20" :title="$t('Stat.info')" />
      </div>

      <div>{{ $t("Stat.div1") }}</div>
      <p>
        {{ $t("Stat.p1") }}:
        <img src="/info.png" width="20" :title="$t('Stat.img')" />
      </p>
      <v-container>
        <ul>
          <li v-for="item in ScoreAdjust" :key="item">{{ item }}</li>
        </ul>
      </v-container>
      <p>{{ $t("Stat.p2") }}</p>
    </div>
  </v-container>
</template>

<script>
import ChartPlayer from "./ChartPlayer.vue";
export default {
  name: "questionStatistics",
  components: {
    ChartPlayer
  },
  props: [],
  data() {
    return {
      Questions: this.$root.$data.Test.questions,
      multiLineHint: this.$t("Stat.mlhint"),
      Mode: this.$root.$data.Mode,
    };
  },
mounted () {
  console.log('Statistics:',JSON.parse(JSON.stringify(this.Questions)))
},
  computed: {
    statChart: function () {
      let chart = {
        labels: [],
        datasets: []
      };
      if (this.Questions.length == 0) {
        return chart;
      }
      chart.labels = this.QNames;

      chart.datasets[0] = {
        label: this.$t("Stat.label1"),
        data: this.Questions.map(x => x.getMaxScore()),
        borderColor: "green"
      };

      chart.datasets[1] = {
        label: this.$t("Stat.label2"),
        data: this.QAvgs,
        borderColor: "blue"
      };
      console.log('Mode:',JSON.parse(JSON.stringify(this.Mode)))
      if (this.Mode.multiLine || this.Mode.multiQuestion) {
        chart.datasets[2] = {
          label: this.$t("Stat.label3"),
          data: this.QMax,
          borderColor: "red"
        };
      }
      console.log('Chart:',JSON.parse(JSON.stringify(chart)))
      return chart;
    },
    QNames: function () {
      return this.Questions.map(x => x["name"]);
    },
    QAvgs: function () {
      let avgData = [];
      this.Questions.forEach(q => {
        avgData.push(q.getStudentScoreAvg(this.Mode.questionScore));
      });
      return avgData;
    },
    QMax: function () {
      let maxData = [];
      this.Questions.forEach(q => {
        maxData.push(q.getMaxStudentScoreAvg(this.Mode.questionScore));
      });
      return maxData;
    },
    ScoreAdjust: function () {
      var sMaxAdj = [];
      let sMax = Math.round(6 / Math.min(...this.QAvgs.filter(a => a > 0)));
      for (var qi = 0; qi < this.Questions.length; qi++) {
        var si = 5;
        if (this.QAvgs[qi] > 0) {
          si = Math.round(
            this.Questions[qi].getMaxScore() * (5 / this.QAvgs[qi])
          );
        } else si = sMax; // no student knows the answer
        sMaxAdj[qi] = this.QNames[qi] + ": " + si + " " + this.$t("Stat.pts");
      }
      return sMaxAdj;
    }
  }
};
</script>
