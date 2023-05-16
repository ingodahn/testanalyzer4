<template>
  <v-container
    id="discriminator"
    v-if="Layout != 'hints' || warnLevel == 'warn_1'"
    :class="warnLevel"
  >
    <h2>{{ $t("Disc.h2") }}</h2>
    <div v-if="Questions.length > 0">
      <p v-html="$t('Disc.p1')"></p>
      <div
        style="text-align: center;"
        v-if="showDiscriminator && Layout == 'all'"
      >
        <ChartPlayer :Chart="discriminatorChart" :Layout="Layout"></ChartPlayer>
      </div>

      <p v-if="!showDiscriminator" v-html="$t('Disc.p2')"></p>
      <div v-if="showDiscriminator">
        <h4>{{ $t("Disc.h4") }}</h4>
        <p>
          {{ $t("Disc.ul") }}
        </p>
        <ul>
          <!--
            <li v-html="$t('Disc.li1')">
            {{ $t("Disc.li1") }}
          </li>
          -->
          <li>
            {{ $t("Disc.li1") }}
          </li>
          <li>
            {{ $t("Disc.li2") }}
          </li>
          <li v-if="nanHint">
            {{ $t("Disc.li3") }}
          </li>
        </ul>
        <div v-if="hintQuestionNames.low.length">
          <p>{{ lowPhrase }} {{ $t("Disc.p3") }}</p>
          <ul>
            <li v-for="item in hintQuestionNames.low" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
        <div v-if="hintQuestionNames.zero.length">
          <p>
            {{ zeroPhrase }}
          </p>
          <ul>
            <li v-for="item in hintQuestionNames.zero" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
        <div v-if="hintQuestionNames.negative.length">
          <p>
            {{ negativePhrase }}
          </p>
          <ul>
            <li v-for="item in hintQuestionNames.negative" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <to-top></to-top>
  </v-container>
</template>

<script>
import ToTop from "@/components/ToTop.vue";
import ChartPlayer from "./ChartPlayer.vue";
export default {
  components: {
    ToTop,
    ChartPlayer
  },
  props: ["ScoredSorted", "Questions", "ComponentStatus", "Layout"],
  data() {
    return {
      curGroup: 0,
      Mode: this.$root.$data.Test.Mode,
    };
  },
  emits: ["warnLevel"],
  mounted () {
        this.$emit("warnLevel", 'discriminator',this.warnLevel);
    },
  computed: {
    discriminatorChart: function() {
      var chart = {
        labels: [],
        datasets: []
      };
      if (this.Questions.length == 0) {
        return {
          data: [chart]
        };
      }

      chart.labels = this.QNames;
      var discData = {
        label: this.$t("Disc.h2"),
        data: this.Cors,
        borderColor: "green"
      };
      chart.datasets[0] = discData;
      return chart;
    },
    QNames: function() {
      return this.Questions.map(x => x["name"]);
    },
    Cors: function() {
      if (!this.Questions.length) return 300;
      let sAll = [],
        sQ = [];
      for (let i = 0; i < this.Questions.length; i++) {
        sQ[i] = [];
      }
      this.ScoredSorted.forEach(stud => {
        sAll.push(stud.totalScore);
        this.Questions.forEach(function(q, i) {
          if (q.answers[stud.realName] == undefined) {
            sQ[i].push(0);
          } else {
            sQ[i].push(Object.values(q.answers[stud.realName])[0][0].score);
          }
        });
      });
      let cors = [];
      for (let i = 0; i < sQ.length; i++) {
        cors.push(correlation(sAll, sQ[i]));
      }
      return cors;
    },
    nanHint: function() {
      let cors = this.Cors,
        ch = false;
      for (let i = 0; i < cors.length; i++) {
        if (isNaN(cors[i])) {
          ch = true;
          break;
        }
      }
      return ch;
    },
    hintQuestionNames: function() {
      let lowC = [],
        zerC = [],
        negC = [];
      let cl = this.Cors;
      this.QNames.forEach(function(qn, i) {
        let c = cl[i];
        if (isNaN(c)) return;
        if (c >= 0.29) return;
        if (c >= 0.1) {
          lowC.push(qn);
          return;
        }
        if (c >= -0.1) {
          zerC.push(qn);
          return;
        }
        negC.push(qn);
      });
      return { low: lowC, zero: zerC, negative: negC };
    },
    lowPhrase: function() {
      return this.$t("Disc.low", this.hintQuestionNames.low.length);
    },
    zeroPhrase: function() {
      return this.$t("Disc.zero", this.hintQuestionNames.zero.length);
    },
    negativePhrase: function() {
      return this.$t("Disc.neg", this.hintQuestionNames.negative.length);
    },
    warnLevel: function() {
      let h = this.hintQuestionNames;
      var s = this.ComponentStatus;
      var ss =
        this.showDiscriminator &&
        (h.low.length || h.zero.length || h.negative.length)
          ? "warn_1"
          : "warn_0";
      s["discriminator"] = ss;
      return ss;
    },
    // Chart-Funktionen
    showDiscriminator: function() {
      return this.Mode.questionScore != "compulsory" || this.Mode.multiLine
        ? false
        : true;
    }
  }
};

function correlation(x, y) {
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;
  const minLength = (x.length = y.length = Math.min(x.length, y.length)),
    reduce = (xi, idx) => {
      const yi = y[idx];
      sumX += xi;
      sumY += yi;
      sumXY += xi * yi;
      sumX2 += xi * xi;
      sumY2 += yi * yi;
    };
  x.forEach(reduce);
  return (
    (minLength * sumXY - sumX * sumY) /
    Math.sqrt(
      (minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY)
    )
  );
}
</script>
