<template>
  <div id="attempts" v-if="Layout != 'hints' || warnLevel == 'warn_1'">
    <v-container :class="warnLevel">
    <h2>
      {{ $t("Less.h2") }}
    </h2>
    </v-container>
    <div v-if="Score.length != 0">
      <v-container :class="warnLevel1" v-if="Layout != 'hints' || warnLevel1 == 'warn_1'">
        <div v-if="questionSuccess.length == 0">
          <p>
            {{ $t("Less.p0", [tp]) }}
          </p>
        </div>
        <div v-if="questionSuccess.length == 1">
          <p>{{ $t("Less.p11") }}</p>
          <ul>
            <li>{{ questionSuccess[0] }}</li>
          </ul>
          {{ $t("Less.p2", [tp]) }}
        </div>
        <div v-if="questionSuccess.length > 1">
          <p>{{ $t("Less.p12") }}</p>
          <v-container>
            <ul>
              <li v-for="item in questionSuccess" :key="item">{{ item }}</li>
            </ul>
          </v-container>
          <p>{{ $t("Less.p2", [tp]) }}</p>
        </div>
        <div v-html="hint"></div>
      </v-container>
      <v-container :class="warnLevel2" v-if="Layout != 'hints' || warnLevel2 == 'warn_1'">
        <p>{{ start50 }}</p>
        <v-container>
          <ul>
            <li v-for="item in less50" :key="item">{{ item }}</li>
          </ul>
        </v-container>
        <p>{{ end50 }}</p>
        <div v-html="hint50"></div>
      </v-container>
    </div>
    <to-top></to-top>
  </div>
</template>

<script>
import ToTop from "@/components/ToTop.vue";
function avg(qScore) {
  var avgScore = 0;
  var scores = qScore.scores;
  var len = scores.length;
  for (var i = 0; i < len; i++) {
    avgScore += scores[i];
  }
  avgScore = avgScore / qScore.total;
  return avgScore;
}
export default {
  name: "Less",
  props: ["Score", "ComponentStatus", "Layout"],
  data() {
    return {
      threshold: 0.2,
      Mode: this.$root.$data.Test.Mode
    };
  },
  components: {
    ToTop
  },
  emits: ["warnLevel"],
  mounted () {
        this.$emit("warnLevel", 'less',this.warnLevel);
    },
  computed: {
    questionSuccess: function () {
      var threshold = 0.2;
      var questions = this.Score;
      var questionsNr = questions.length;
      var qs = [];
      for (var i = 0; i < questionsNr; i++) {
        var qi = questions[i];
        if (avg(qi) / qi.maxScore < threshold) {
          qs.push(qi.name);
        }
      }
      return qs;
    },
    less50: function () {
      var fewFull = [];
      for (var qn = 0; qn < this.Score.length; qn++) {
        var qMax = this.Score[qn].maxScore;
        var qs = this.Score[qn].scores.filter(x => x < qMax);
        if (2 * qs.length > this.Score[qn].scores.length) {
          fewFull.push(this.Score[qn].name);
        }
      }
      var fewFullRest = fewFull.filter(
        n => this.questionSuccess.indexOf(n) < 0
      );
      return fewFullRest;
    },
    warnLevel: function () {
      var s = this.ComponentStatus;
      var ss =
        this.warnLevel1 == "warn_1" || this.warnLevel2 == "warn_1"
          ? "warn_1"
          : "warn_0";
      s["less"] = ss;
      return ss;
    },
    warnLevel1: function () {
      return this.questionSuccess.length ? "warn_1" : "warn_0";
    },
    warnLevel2: function () {
      return this.less50.length ? "warn_1" : "warn_0";
    },
    hint: function () {
      if (this.questionSuccess.length) {
        var hint = "";
        var frage = this.$t("Less.question", this.questionSuccess.length);
        var ist = this.$t("Less.is", this.questionSuccess.length);
        hint = this.$t("Less.hint", [ist, frage]);
      } else {
        hint = this.$t("Less.hint2");
      }
      return "<p><b>" + this.$t("Less.hint0") + "</b> " + hint + "</p>";
    },
    start50: function () {
      if (this.less50.length == 0) {
        return (
          this.$t("Less.qsuccess", this.questionSuccess.length) +
          " " +
          this.$t("Less.qsuccess2")
        );
      }
      const start501 =
        this.$t("Less.start501", this.questionSuccess.length) + " ";
      const start502 = this.$t("Less.start502", this.less50.length);
      return start501 + start502;
    },
    end50: function () {
      if (this.less50.length == 0) {
        return "";
      }
      let multiTxt =
        this.Mode.multiLine || this.Mode.multiQuestion
          ? this.$t("Less.multi")
          : "";
      return multiTxt + this.$t("Less.notfull");
    },
    hint50: function () {
      const qsl = this.questionSuccess.length,
        l50l = this.less50.length;
      if (qsl == 0 && l50l == 0) {
        return this.$t("Less.hint50");
      }
      var hint50 = "<p><b>" + this.$t("Less.hint0") + ":</b> ";
      if (qsl > 0 && l50l == 0) {
        const frage = this.$tc("Less.question1", qsl);
        hint50 += this.$t("hint50x", [frage]);
        return hint50;
      }
      const question2 = this.$t("Less.question2", qsl + l50l);
      hint50 += this.$t("Less.hint50y", [question2]);
      return hint50;
    },
    tp: function () {
      return this.threshold * 100 + this.$t("Less.tp");
    }
  }
};
</script>
