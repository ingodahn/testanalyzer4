<template>
    <v-container>
        <p>{{ allGroupsText }}</p>
        <v-list>
            <v-list-item v-for="g in groups" :key="g.name" :title="g.name">{{ groupItemText(g) }} <input type="number" :min="initialMinScores[g.name]" :max="initialMaxScores[g.name]" step="1"
                    v-model="g.groupMaxScore" /> <b v-if="toCheck(g)">&#8592; edit!</b></v-list-item>
        </v-list>
        <p>{{ maxScoreText }}.</p>
    </v-container>
</template>

<script>
export default {
    name: 'Adapt',
    props: {
    },
    data() {
        return {
            initialMaxScores: {},
            initialMinScores: {}
        }
    },
    setup(props, context) {

    },
    computed: {
        groups() {
            return this.$root.$data.Test.adaptOptions.groups
        },
        allGroupsText() {
            return this.$t("IMathAS.adaptGroups", { count: this.groups.length })
        },
        maxScoreText() {
            return this.$t("IMathAS.adaptMaxTestScore", { maxTestScore: this.testMaxScore })
        },
        testMaxScore() {
            let Test = this.$root.$data.Test, maxScore = 0, regexG = /^Question\s(\d+)-\d+/
            for (let i = 0; i < Test.questions.length; i++) {
                if (!Test.questions[i].name.match(regexG)) {
                    maxScore += Test.questions[i].maxScore;
                }
            }
            // Add group scores
            for (let i = 0; i < this.groups.length; i++) {
                maxScore += this.groups[i].groupMaxScore;
            }
            return maxScore;
        }
    },
    methods: {
        groupItemText(g) {
            return this.$t("IMathAS.adaptGroupItem", { nrSelected: g.nrSelected, nrQuestions: g.nrQuestions, achievedScore: g.achievedScore })
        },
        toCheck(group) {
            return group.nrSelected < group.nrQuestions || group.achievedScore < group.groupMaxScore
        },
    },
    mounted() {
        let groups = this.$root.$data.Test.adaptOptions.groups
        for (let i = 0; i < groups.length; i++) {
            this.initialMaxScores[groups[i].name] = groups[i].groupMaxScore;
            this.initialMinScores[groups[i].name] = Math.ceil(groups[i].achievedScore);
        }
    }

}

</script>