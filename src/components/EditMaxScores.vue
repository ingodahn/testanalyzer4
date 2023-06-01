<template>
  <div id="maxScores">
    <h3>{{ $t("EditScores.h3") }}</h3>
    <p>
      {{ $t("EditScores.p0") }}
    </p>
    <p v-if="TotalScore != CalcMaxScore">
      {{ $t("EditScores.p1", [CalcMaxScore, TotalScore]) }}
    </p>
    <p>
      {{ $t("EditScores.p2") }}
    </p>
    <table id="maxScoreList">
      <tr>
        <th>{{ $t("EditScores.th1") }}</th>
        <th class="scoreCol">{{ $t("EditScores.th2") }}</th>
      </tr>
      <tr v-for="(question, index) in Questions" :key="index">
        <td>{{ question.name }}</td>
        <td class="scoreCol">
          <input type="number" min="0" step="0.1" v-model="question.maxScore" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "EditMaxScores",
  data() {
    return {};
  },
  props: ["Questions", "CalcMaxScore", "TotalScore"]
};
</script>

<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
}
.scoreCol {
  text-align: center;
}
th,
td {
  border-bottom: 1px solid #ddd;
}
input[type="number"] {
  width: 50px;
}
</style>
