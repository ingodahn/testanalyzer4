<template>
  <v-container id="best" :class="warnLevel" v-if="Layout != 'hints' || warnLevel == 'warn_1'">
    <h2>{{ $t("Best.h2") }}</h2>
    <div v-html="msg" v-if="ScoredSorted.length"></div>
    <v-container>
      <ul>
        <li v-for="item in qNameStudents['ql']" :key="item">
          {{ item }}:
          <ListPlayer :ListData="qNameStudents['so'][item]" :Layout="Layout"></ListPlayer>
        </li>
      </ul>
    </v-container>

    <div v-if="ScoredSorted.length != 0">
      <b>{{ $t("Best.hint") }}&nbsp;</b>
      <span v-html="hint"></span>
    </div>
    <to-top></to-top>
  </v-container>
</template>

<script>
import ToTop from "@/components/ToTop.vue";
import ListPlayer from "./ListPlayer.vue";
export default {
  name: "BestStudents",
  data() {
    return {};
  },
  props: ["ScoredSorted", "Questions", "ComponentStatus", "Layout"],
  emits: ["warnLevel"],
  components: { ToTop, ListPlayer },
  mounted () {
        this.$emit("warnLevel", 'best',this.warnLevel);
    },
  computed: {
    qNameStudents: function () {
      var best = this.ScoredSorted.slice(0);

      best = best.reverse().slice(0, this.bestLength);
      var qs = { ql: [], so: {} };
      for (var q = 0; q < this.Questions.length; q++) {
        var qq = this.Questions[q];
        let studs = [];
        var qMax = qq.getMaxScore();
        for (var s = 0; s < best.length; s++) {
          if (qq.scoreAttemptsOf(best[s].realName, "max").totalScore < qMax) {
            studs.push(best[s].name);
          }
        }
        if (studs.length) {
          qs.ql.push(qq.name);
          qs.so[qq.name] = studs;
        }
      }
      return qs;
    },

    msgArr: function () {
      var best = this.ScoredSorted.slice(0);

      best = best.reverse().slice(0, this.bestLength);
      var msgArr = [];
      for (var q = 0; q < this.Questions.length; q++) {
        var qq = this.Questions[q];
        var qName = qq.name;
        //var qMax = Number(qq.maxScore);
        var qMax = qq.getMaxScore();
        var qMsgArr = [];
        for (var s = 0; s < best.length; s++) {
          if (qq.scoreAttemptsOf(best[s].realName, "max").totalScore < qMax) {
            qMsgArr.push(best[s].name);
          }
        }
        var qMsg = qMsgArr.slice(0, 2).join(", ");
        if (qMsg != "") {
          msgArr.push(qName + ": " + qMsg);
        }
      }

      return msgArr;
    },
    msg: function () {
      // var threshold = 0.2;
      return this.$t("Best.msg", this.msgArr.length, [this.bestLength]);
      /*
      var tp = this.bestLength + " Studierenden";

      if (this.ScoredSorted.length == 0) {
        return "";
      }
      if (this.msgArr.length == 0) {
        return "Die besten " + tp + " erreichten immer die volle Punktzahl";
      }
      var fr =
        this.msgArr.length == 1
          ? "Bei der folgenden Frage"
          : "Bei den folgenden Fragen";
      return (
        fr +
        " erreichten die besten " +
        tp +
        " nicht immer die volle Punktzahl."
      );
      */
    },
    warnLevel: function () {
      var s = this.ComponentStatus;
      switch (this.msgArr.length) {
        case 0: {
          s["best"] = "warn_0";
          return "warn_0";
        }
        default: {
          s["best"] = "warn_1";
          return "warn_1";
        }
      }
    },
    hint: function () {
      if (this.warnLevel == "warn_1") {
        return this.$t("Best.hint2");
      } else {
        return this.$t("Best.hint3");
      }
    },

    bestLength: function () {
      var threshold = 0.2;
      var bestLength = Math.floor(this.ScoredSorted.length * threshold) + 1;
      if (bestLength > 10) {
        bestLength = 10;
      }
      return bestLength;
    },
  }
};
</script>
