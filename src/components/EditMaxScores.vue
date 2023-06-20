<template>
  <div id="maxScores">
    <h3>{{ $t("EditScores.h3") }}:
      <v-input style="width: 6em;">
        <v-text-field type="number" step="0.1" min="0" v-model="Test.setMaxScore"></v-text-field>
      </v-input>
    </h3>

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
          <v-input style="width: 6em;">
            <v-text-field type="number" step="0.1" min="0" v-model="question.maxScore"></v-text-field>
          </v-input>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "EditMaxScores",
  data() {
    return {
      testval: 2,
      Test: this.$root.$data.Test,
    };
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
  text-align: left;
  padding: 1em;
}

input[type="number"] {
  width: 50px;
}
</style>
