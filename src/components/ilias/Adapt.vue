<template>
    <v-container>
        <edit-max-scores :Questions="Test.questions" :CalcMaxScore="calcMaxScore" :TotalScore="totalScore">
        </edit-max-scores>
    </v-container>
</template>

<script>
import EditMaxScores from '@/components/EditMaxScores.vue'
export default {
    name: "IliasAdapt",
    components: {
        EditMaxScores
    },
    data() {
        return {
            Test: this.$root.$data.Test
        }
    },
    computed: {
        totalScore: function() {
      var tScore = 0;
      for (var i = 0; i < this.Test.questionsNr; i++) {
        tScore += this.Test.questions[i].getMaxScore();
      }
      return tScore;
    },
        calcMaxScore() {
            if (isNaN(this.Test.setMaxScore)) return this.totalScore;
            return this.Test.setMaxScore;
        }
    }
};
</script>