<template>
    <v-container
      id="more"
      :class="warnLevel"
      v-if="Layout == 'all' || warnLevel == 'warn_1'"
    >
      <h2>{{ $t("More.h2") }}</h2>
      <div v-if="Score.length != 0">
        <div v-if="questionSuccess.length == 0">
          <p>{{ $t("More.p1", [tp]) }}</p>
        </div>
        <div v-else>
          <p>{{ $t("More.p2N", questionSuccess.length) }}</p>
          <v-container>
            <ul>
            <li v-for="item in questionSuccess" :key="item">{{ item }}</li>
          </ul>
          </v-container>
          <p>{{ $t("More.p3", [tp]) }}</p>
        </div>
        <b>{{ $t("More.hint") }}</b> <span v-html="hint"></span>
      </div>
    </v-container>
  </template>
  
  <script>
  function avg(q) {
    var avgScore = 0;
    var scores = q.scores;
    var len = scores.length;
    for (var i = 0; i < len; i++) {
      avgScore += scores[i];
    }
    avgScore = avgScore / q.total;
    return avgScore;
  }
  export default {
    name: "more",
    data() {
      return {
        threshold: 0.8
      };
    },
    props: ["Score", "ComponentStatus", "Layout"],
    computed: {
      questionSuccess: function() {
        var threshold = 0.8;
        var questions = this.Score;
        var questionsNr = questions.length;
        var qs = [];
        for (var i = 0; i < questionsNr; i++) {
          var qi = questions[i];
          if (avg(qi) / qi.maxScore > threshold) {
            qs.push(qi.name);
          }
        }
        return qs;
      },
      warnLevel: function() {
        var s = this.ComponentStatus;
        switch (this.questionSuccess.length) {
          case 0: {
            s["more"] = "warn_0";
            return "warn_0";
          }
          default: {
            s["more"] = "warn_1";
            return "warn_1";
          }
        }
      },
      hint: function() {
        if (this.warnLevel == "warn_1") {
          let n = this.questionSuccess.length;
          return this.$t("More.hintText", [
            this.$t("More.qq", n),
            this.$t("More.qt", n),
            this.$t("More.qValue", n)
          ]);
        } else {
          return this.$t("More.hintText2");
        }
      },
      tp: function() {
        return this.threshold * 100 + this.$t("More.percent");
      }
    }
  };
  </script>
  