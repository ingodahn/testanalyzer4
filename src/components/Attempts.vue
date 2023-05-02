<template>
  <v-container
    id="less"
    :class="warnLevel"
    v-if="Layout == 'all' || warnLevel == 'warn_1'"
  >
    <h2>{{ $t("Attempts.h2") }}</h2>
    <div style="text-align: center;" v-if="Layout == 'all'">
      <ChartPlayer
        :Chart="attemptChart"
        v-if="Questions.length > 0"
      ></ChartPlayer>
    </div>
    <div v-if="Questions.length != 0">
      <p>{{ msg }}</p>
      <ul>
        <li v-for="item in attemptsNrs" :key="item">
          {{ qName(item) }}, {{ $t("Attempts.li") }}
          <ListPlayer
            :ListData="unattemptedList(item)"
            PlayerType="selector"
          ></ListPlayer>
        </li>
      </ul>
      <b>{{ $t("Attempts.hint") }} </b>
      <div v-html="hint"></div>
    </div>
  </v-container>
</template>

<script>
import ChartPlayer from "./ChartPlayer.vue";
import ListPlayer from "./ListPlayer.vue";
export default {
  name: "Attempts",
  props: ["Questions", "ComponentStatus", "Layout"],
  data() {
    return {
      curGroup: 0,
      Mode: this.$root.$data.Test.Mode,
    };
  },
  components: {
    ChartPlayer,
    ListPlayer
  },
  methods: {
    unattemptedList: function(i) {
      // Find names of students that have seen but not attempted question i
      let ss = this.Questions[i].studentScores;
      return Object.keys(ss).filter(
        sName => ss[sName].presented && !ss[sName].attempted
      );
      //return ["a","b","c","d"];
    },
    qName: function(i) {
      return this.Questions[i].name;
    }
  },

  computed: {
    attemptChart: function() {
      let chart = {
        labels: [],
        datasets: []
      };
      if (this.Questions.length == 0) {
        return chart;
      }
      chart.labels = this.QNames;
      chart.datasets[0] = {
        label: this.$t("Attempts.label"),
        data: this.Questions.map(x => (x.attempted / x.presented) * 100),
        borderColor: "blue"
      };
      return chart;
    },
    QNames: function() {
      return this.Questions.map(x => x.name);
    },
    attemptsNrs: function() {
      var attemptsNrs = [];
      var threshold = 0.2;

      for (var i = 0; i < this.Questions.length; i++) {
        var q = this.Questions[i];

        if (q.attempted / q.presented < threshold) {
          attemptsNrs.push(i);
        }
      }
      return attemptsNrs;
    },
    attempts: function() {
      return this.attemptsNrs.map(qi => this.Questions[qi].name);
    },
    msg: function() {
      var msg = "";
      var threshold = 0.2;
      var tp = threshold * 100 + this.$t("Attempts.r1");
      if (this.Questions.length == 0) {
        return msg;
      }

      switch (this.attempts.length) {
        case 0: {
          return this.$t("Attempts.r2") + " " + tp;
        }
        case 1: {
          return this.$t("Attempts.r3") + " " + tp;
        }
        default: {
          return this.$t("Attempts.r4") + " " + tp;
        }
      }
    },
    warnLevel: function() {
      var s = this.ComponentStatus;
      switch (this.attempts.length) {
        case 0: {
          s["attempts"] = "warn_0";
          return "warn_0";
        }
        default: {
          s["attempts"] = "warn_1";
          return "warn_1";
        }
      }
    },
    hint: function() {
      if (this.warnLevel == "warn_1") {
        var frage = this.$t("Attempts.question", this.attempts.length);
        return this.$t("Attempts.hintText1", [frage]);
      } else {
        return this.$t("Attempts.hintText2");
      }
    }
  }
};
</script>
