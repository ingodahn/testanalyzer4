<template>
    <tool-bar :disabled="toolbarOptions.disabled" @toggleLayout="toggleLayout"></tool-bar>

    <sections-menu :Layout="layout" :ComponentStatus="componentStatus"></sections-menu>

    <v-container v-if="layout != 'hints' && questionsNr != 0" id="basics">
        <h2>{{ $t("Test.h21") }}</h2>
        <p>
            {{
                $t("Test.p5", [questionsNr, Test.studentsNr, Test.setMaxScore])
            }}
        </p>
    </v-container>
    <control-center v-if="layout == 'print'" Layout="print">
    </control-center>
    <score-distribution :ScoredSorted="scoredSorted" :TotalScore="Test.setMaxScore" :Questions="questions"
        :ComponentStatus="componentStatus" :Layout="layout" @warnLevel="setWarnLevel">
    </score-distribution>

    <More id="more" :Score="score" :ComponentStatus="componentStatus" :Layout="layout" @warnLevel="setWarnLevel"></More>
    
    <Less id="less" :Score="score" :ComponentStatus="componentStatus" :Layout="layout" @warnLevel="setWarnLevel"></Less>
    
    <Attempts id="attempts" :Questions="questions" :ComponentStatus="componentStatus" :Layout="layout"
        @warnLevel="setWarnLevel">
    </Attempts>
    
    <BestStudents id="best" :ScoredSorted="scoredSorted" :Questions="questions" :ComponentStatus="componentStatus"
        :Layout="layout" @warnLevel="setWarnLevel"></BestStudents>
    
    <QuestionStatistics id="questionStatistics" v-if="layout != 'hints'" :Layout="layout">
    </QuestionStatistics>
    
    <Discriminator :ScoredSorted="scoredSorted" :Questions="questions" :ComponentStatus="componentStatus" :Layout="layout"
        @warnLevel="setWarnLevel">
    </Discriminator>

    <Grouping id="grouping" :Layout="layout" :ScoredSorted="scoredSorted"></Grouping>
</template>

<script>
import ToolBar from "@/components/ToolBar.vue";
import SectionsMenu from "@/components/SectionsMenu.vue";
import ToTop from "@/components/ToTop.vue";
import ControlCenter from "@/components/ControlCenter.vue";
import ScoreDistribution from "@/components/ScoreDistribution.vue";
import More from "@/components/More.vue";
import Less from "@/components/Less.vue";
import Attempts from "@/components/Attempts.vue";
import BestStudents from "@/components/BestStudents.vue";
import QuestionStatistics from "@/components/QuestionStatistics.vue";
import Discriminator from "@/components/Discriminator.vue";
import Grouping from "@/components/Grouping.vue";

export default {
    name: "AnalysisView",
    components: {
        ToolBar,
        SectionsMenu,
        ToTop,
        ControlCenter,
        ScoreDistribution,
        More,
        Less,
        Attempts,
        BestStudents,
        QuestionStatistics,
        Discriminator,
        Grouping
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
                    layout: false,
                    report: false
                },
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
        warnLevel: function (c) {
            return this.componentStatus[c];
        },
        setWarnLevel(component, level) {
            this.componentStatus[component] = level;
            if (level == "warn_1") this.toolbarOptions.disabled.hints = false;
        },
        warnColor: function (c) {
            return this.warnLevel(c) == "warn_1" ? "warning" : "none";
        },
        
        toggleLayout(layout) {
            this.layout = layout;
        },
    },
    watch: {

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