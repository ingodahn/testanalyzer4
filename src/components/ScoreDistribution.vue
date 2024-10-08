<template>
    <v-container id="diagram" :class="warnLevel" v-if="Layout != 'hints' || warnLevel == 'warn_1'">
        <h2 id="scoreDistribution">{{ $t("Score.h2") }}</h2>
    </v-container>
    <v-container :class="warnLevel">
        <v-card elevation="20">
            <BarChart :chartData="studentScoreChart" :layout="Layout"></BarChart>
        </v-card>
    </v-container>
    <v-container v-if="hint" :class="warnLevel">
        <b>{{ $t("Score.p1") }}</b>
        {{ hint }}
    </v-container>
    <v-container v-if="hintDetails != ''" :class="warnLevel">
        <p>{{ hintDetails }}</p>
        <v-container>
            <ul>
                <li>{{ $t("Score.li1") }}</li>
                <li>{{ $t("Score.li2") }}</li>
                <li>{{ $t("Score.li3") }}</li>
            </ul>
        </v-container>
    </v-container>

    <v-container :class="warnLevel">
        <Race id="trackComponent" :ScoredSorted="ScoredSorted" :TotalScore="TotalScore" :Questions="Questions"
            v-if="Layout != 'hints'"></Race>
        <to-top></to-top>
    </v-container>
</template>

<script>
import ToTop from "@/components/ToTop.vue";
import Testgraph from "@/components/Graphics/Testgraph.vue";
import BarChart from "@/components/Graphics/BarChart.vue";
import Race from "@/components/Race.vue"
export default {
    data() {
        return {
            diagrams: {
                scoreDistribution: {
                    title: this.$t("Score.title")
                }
            },
            chartOptions: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            },
            bucketsNr: 5,
            multilineScore: "maxQuestion"
        };
    },
    props: [
        "ScoredSorted",
        "TotalScore",
        "Questions",
        "ComponentStatus",
        "Layout"
    ],
    emits: ["warnLevel"],
    components: {
        ToTop,
        Testgraph,
        BarChart,
        Race
    },
    mounted() {
        this.$emit("warnLevel", 'ScoreDistribution', this.warnLevel);
    },
    computed: {
        scoreClasses: function () {
            // Return list of numbers of students in n groups by score
            const n = this.bucketsNr;
            var scoreClasses = Array(n).fill(0);
            var studentsNr = this.ScoredSorted.length;
            const maxScore = this.TotalScore;
            var i = 0;
            var lim = maxScore / n;
            for (var s = 0; s < studentsNr; s++) {
                var score = this.ScoredSorted[s].totalScore;
                if (score <= lim) {
                    scoreClasses[i]++;
                } else {
                    while (score > lim) {
                        i++;
                        lim = lim + maxScore / n;
                    }
                    scoreClasses[i]++;
                }
            }
            return scoreClasses;
        },
        chartLabels: function () {
            const n = this.bucketsNr;
            const maxScore = this.TotalScore;
            var chartLabels = [];
            for (var j = 0; j < n; j++) {
                chartLabels[j] =
                    ((maxScore * j) / n).toString() +
                    " - " +
                    ((maxScore * (j + 1)) / n).toString();
            }
            return chartLabels;
        },

        studentScoreChart: function () {
            if (this.ScoredSorted.length == 0) {
                return {};
            }
            var chart = {
                labels: [],
                datasets: []
            };
            const n = this.bucketsNr;
            var backgroundColor = Array(n).fill("hsl(198, 65%, 40%)");

            chart.labels = this.chartLabels;
            var chartData = {
                label: this.$t("Score.chartLabel"),
                data: this.scoreClasses,
                backgroundColor: backgroundColor
            };
            chart.datasets[0] = chartData;
            return chart;
        },
        warnLevel: function () {
            var s = this.ComponentStatus;
            switch (this.gaps.length) {
                case 0: {
                    s["scoreDistribution"] = "warn_0";
                    return "warn_0";
                }
                default: {
                    s["scoreDistribution"] = "warn_1";
                    return "warn_1";
                }
            }
        },
        gaps: function () {
            const scores = this.scoreClasses;
            if (this.ScoredSorted.length == 0) {
                return [];
            }
            const n = this.bucketsNr;
            var gaps = [];
            var i = 0;
            while (i < n - 1) {
                if (scores[i + 1] < scores[i] * 0.3) {
                    gaps.push(i);
                }
                i++;
            }
            return gaps;
        },
        // Hints:
        hintDetails: function () {
            // No gaps - no hints...
            if (this.gaps.length == 0) {
                return "";
            }
            var gap = this.gaps[0];
            let sss = this.ScoredSorted;
            // Calculate number of students before gap
            var snr = sum(this.scoreClasses, 0, gap);
            // We selct maximum 10 students before the gap...
            const weakStudents = sss.slice(Math.max(0, snr - 10), snr);
            //... and maximum 10 students after the gap
            const goodStudents = sss.slice(snr, Math.min(snr + 10, sss.length));
            var lgood = goodStudents.length;
            const lweak = weakStudents.length;

            let weakStudentsQ = new Object();
            this.Questions.forEach(q => {
                weakStudentsQ[q.name] = 0;
            });

            // How scored the weak students per question? weakStudentsQ sums up scores of weak students per question
            weakStudents.forEach(s => {
                s["scores"] = new Object();
                this.Questions.forEach(q => {
                    let sc = q.scoreAttemptsOf(s.realName, "max").totalScore;
                    weakStudentsQ[q.name] += sc;
                    s.scores[q.name] = sc;
                });
            });
            // How scored the good students per question? goodStudentsQ sums up scores of good students per question
            // We start with the maxScores if the gap is the top class
            let goodStudentsQ = new Object();
            if (lgood == 0) {
                this.Questions.forEach(q => {
                    goodStudentsQ[q.name] = q.getMaxScore();
                });
                lgood = 1;
            } else {
                // Otherwise we initialize goodStudentsQ with 0 for all questions
                this.Questions.forEach(q => {
                    goodStudentsQ[q.name] = 0;
                });
            }

            // Now we sum up the cores of the good students
            goodStudents.forEach(s => {
                this.Questions.forEach(q => {
                    goodStudentsQ[q.name] += q.scoreAttemptsOf(
                        s.realName,
                        "max"
                    ).totalScore;
                });
            });

            // Calculate the diference in average score between good and weak students
            var diffScores = {};
            for (var name2 in goodStudentsQ) {
                diffScores[name2] =
                    goodStudentsQ[name2] / lgood - weakStudentsQ[name2] / lweak;
            }

            var maxDiff = 0;
            var maxDiffName = "";
            for (var name3 in diffScores) {
                if (diffScores[name3] > maxDiff) {
                    maxDiff = diffScores[name3];
                    maxDiffName = name3;
                }
            }

            var maxDiffMaxScore = 0;
            for (var q2 = 0; q2 < this.Questions.length; q2++) {
                if (this.Questions[q2].name == maxDiffName) {
                    maxDiffMaxScore = this.Questions[q2].getMaxScore();
                    break;
                }
            }
            // we need the score of weakStudents[wi] for question with name maxDiffName
            var wsi = 0;
            for (var wi = lweak - 1; wi >= 0; wi--) {
                if (weakStudents[wi].scores[maxDiffName] < maxDiffMaxScore) {
                    wsi = wi;
                    break;
                }
            }
            var ws = weakStudents[wsi].name;
            return this.$t("Score.hint1", [this.chartLabels[gap], maxDiffName, ws]);
        },
        hint: function () {
            if (this.gaps.length == 0) {
                return "";
            } else {
                return this.$t("Score.hint2", [this.chartLabels[this.gaps[0] + 1]]);
            }
        }
    }
}

function sum(array, start, end) {
    if (array.length == 0) {
        return 0;
    }
    start = Math.max(start, 0);
    end = Math.min(end, array.length - 1);
    var tmpArray = array.slice(start, end + 1);
    return tmpArray.reduce((a, b) => a + b, 0);
}
</script>
