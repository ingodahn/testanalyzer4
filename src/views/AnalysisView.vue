<template>
   <tool-bar :disabled="toolbarOptions.disabled"></tool-bar>
    <v-container v-if="layout == 'all' && questionsNr != 0">
        <h2>{{ $t("Test.h21") }}</h2>
        <p>
            {{
                $t("Test.p5", [questionsNr, Test.studentsNr, Test.setMaxScore])
            }}
        </p>
    </v-container>
    <score-distribution :ScoredSorted="scoredSorted" :TotalScore="Test.setMaxScore" :Questions="questions"
        :ComponentStatus="componentStatus" :Layout="layout">
    </score-distribution>
    <to-top></to-top>
    <More id="more" :Score="score" :ComponentStatus="componentStatus" :Layout="layout"></More>
    <to-top></to-top>
    <Less id="less" :Score="score" :ComponentStatus="componentStatus" :Layout="layout"></Less>
    <to-top></to-top>
    <Attempts id="attempts" :Questions="questions" :ComponentStatus="componentStatus" :Layout="layout">
    </Attempts>
    <to-top></to-top>
    <BestStudents id="best" :ScoredSorted="scoredSorted" :Questions="questions" :ComponentStatus="componentStatus"
        :Layout="layout"></BestStudents>
    <to-top></to-top>
    <QuestionStatistics id="questionStatistics" v-if="layout == 'all'">
    </QuestionStatistics>
    <to-top></to-top>
    <Discriminator :ScoredSorted="scoredSorted" :Questions="questions" :ComponentStatus="componentStatus"
        :Layout="layout"></Discriminator>
    <to-top></to-top>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
import ToTop from "@/components/ToTop.vue";
import ScoreDistribution from "@/components/ScoreDistribution.vue";
import More from "@/components/More.vue";
import Less from "@/components/Less.vue";
import Attempts from "@/components/Attempts.vue";
import BestStudents from "@/components/BestStudents.vue";
import QuestionStatistics from "@/components/QuestionStatistics.vue";
import Discriminator from "@/components/Discriminator.vue";

export default {
    name: "AnalysisView",
    components: {
        ToolBar,
        ToTop,
        ScoreDistribution,
        More,
        Less,
        Attempts,
        BestStudents,
        QuestionStatistics,
        Discriminator
    },
    data() {
        return {
            Test: this.$root.$data.Test,
            Mode: this.$root.$data.Test.Mode,
            fab: false,
            drawer: null,
            system: "",
            type: "compulsory",
            reportingProblem: false,
            questionsNr: this.$root.$data.Test.questionsNr,
            studentsDataNr: 0,
            questions: this.$root.$data.Test.questions,
            students: this.$root.$data.Test.students,
            studentLinesNr: 0,
            error: {
                type: "empty",
                status: "start"
            },
            componentStatus: {
                ScoreDistribution: "warn_0",
                less: "warn_0",
                more: "warn_0",
                attempts: "warn_0",
                best: "warn_0",
                discriminator: "warn_0"
            },
            toolbarOptions: {
                disabled: {
                    drawer: false,
                    file: false,
                    settings: false,
                    analysis: true,
                    hints: false,
                    print: false,
                    report: false
                }
            },
            showContext: true,
            showUpload: true,
            layout: "all",
            loading: false
        };
    },
    
    methods: {
        toTop() {
            window.scrollTo(0, 0);
        },
    },
    computed: {
        
        score: function () {
            var scores = [];
            for (var i = 0; i < this.questionsNr; i++) {
                var q = this.questions[i];
                //var qscores = q.scores;
                var triedqscores = [];
                Object.keys(this.students).forEach(j => {
                    if (this.Mode.questionScore == "compulsory") {
                        if (q.presentedTo(j)) triedqscores.push(q.scoreOf(j));
                    } else {
                        if (q.attemptedBy(j)) triedqscores.push(q.scoreOf(j));
                    }
                });
                var totals =
                    this.Mode.questionScore == "compulsory" ? q.presented : q.attempted;
                scores.push({
                    name: q.name,
                    maxScore: q.getMaxScore(),
                    scores: triedqscores,
                    total: totals
                });
            }
            return scores;
        },
        totalScore: function () {
            var tScore = 0;
            for (var i = 0; i < this.questionsNr; i++) {
                tScore += this.questions[i].getMaxScore();
            }
            return tScore;
        },
        
        testStudentScores: function () {
            let studentScores = [];
            let nameArray = Object.keys(this.students);

            if (!this.Mode.multiLine) {
                nameArray.forEach(sname => {
                    studentScores.push({
                        name: sname,
                        realName: sname,
                        totalScore: this.students[sname].getScore(this.Mode, this.questions)
                    });
                });
            } else if (this.Mode.multiLine && this.Mode.multiLineScore == "single") {
                nameArray.forEach(sname => {
                    {
                        let scoreArray = this.students[sname].getScore(
                            this.Mode,
                            this.questions
                        );
                        scoreArray.forEach(ll => {
                            studentScores.push({
                                name: sname + " (" + ll.lineNr + ")",
                                realName: sname,
                                lineNr: ll.lineNr,
                                totalScore: ll.lineScore
                            });
                        });
                    }
                });
            } else if (this.Mode.multiLine) {
                nameArray.forEach(sname => {
                    studentScores.push({
                        name: sname,
                        realName: sname,
                        totalScore: this.students[sname].getScore(this.Mode, this.questions)
                    });
                });
            }
            return studentScores;
        },
        scoredSorted: function () {
            var ss = this.testStudentScores.slice(0);
            var scoredSorted = ss.sort(function (a, b) {
                return a.totalScore - b.totalScore;
            });
            return scoredSorted;
        },
    }
}
</script>