<template>
    <h2>Here comes the AnalysisView</h2>
    <v-container v-if="layout == 'all' && questionsNr != 0">
        <h2>{{ $t("Test.h21") }}</h2>
        <p>
            {{
                $t("Test.p5", [questionsNr, studentsNr, calcMaxScore])
            }}
        </p>
    </v-container>
    <score-distribution :ScoredSorted="scoredSorted" :TotalScore="calcMaxScore" :Questions="questions"
        :ComponentStatus="componentStatus" :Layout="layout">
    </score-distribution>
    <More id="more" :Score="score" :ComponentStatus="componentStatus" :Layout="layout"></More>
    <Less id="less" :Score="score" :ComponentStatus="componentStatus" :Layout="layout"></Less>
    <Attempts id="attempts" :Questions="questions" :ComponentStatus="componentStatus" :Layout="layout">
    </Attempts>
    <BestStudents id="best" :ScoredSorted="scoredSorted" :Questions="questions" :ComponentStatus="componentStatus"
        :Layout="layout"></BestStudents>
    <QuestionStatistics id="questionStatistics" v-if="layout == 'all'">
    </QuestionStatistics>
    <Discriminator :ScoredSorted="scoredSorted" :Questions="questions" :ComponentStatus="componentStatus"
        :Layout="layout"></Discriminator>
</template>

<script>
import { Student } from "@/components/Scoring.js";


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
            fab: false,
            drawer: null,
            system: "",
            type: "compulsory",
            reportingProblem: false,
            questionsNr: 0,
            studentsDataNr: 0,
            setMaxScore: "none",
            questions: [],
            students: {},
            studentLinesNr: 0,
            Test: this.$root.$data.Test,
            Mode: this.$root.$data.Mode,
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
            showContext: true,
            showUpload: true,
            layout: "all",
            loading: false
        };
    },
    mounted() {
        this.testread();
    },
    methods: {
        testread() {
            const test = this.$root.$data.Test;
            console.log("testread: ", JSON.parse(JSON.stringify(test)))
            this.system = test.system;
            this.questionsNr = test.questions.length;
            if (Object.prototype.hasOwnProperty.call(test, "setMaxScore"))
                this.setMaxScore = test.setMaxScore;
            else this.setMaxScore = "none";
            this.questions = test.questions;
            let qIndex = new Object();
            this.questions.forEach(function (v, a) {
                qIndex[v.name] = a;
            });

            this.studentsDataNr = test.studentsNr;
            var snlThis = new Object();
            this.studentLinesNr = 0;
            var snlThat = test.studentNameLines;
            for (var i = 0; i < snlThat.length; i++) {
                let snli = snlThat[i],
                    snlName = snli.lineName,
                    snlScore = snli.lineScore,
                    snlNr = snli.lineNr;
                this.students = snlThis;
                if (snli.participated) {
                    let s;
                    let snlEntry = { lineNr: snlNr, lineScore: snlScore };
                    if (!Object.prototype.hasOwnProperty.call(snlThis, snlName)) {
                        s = new Student(snlName);
                        s.lines = [snlEntry];
                        snlThis[snlName] = s;
                    } else {
                        s = snlThis[snlName];
                        s.lines.push(snlEntry);
                    }
                    let snliAnswers = snli.lineAnswers;
                    snliAnswers.forEach(ans => {
                        let qn = this.questions[qIndex[ans.name]];

                        let cnt = qn.addStudentLineAnswer(
                            snlName,
                            snlNr,
                            ans.attempted,
                            ans.score
                        );
                        if (cnt > 1) this.Mode.multiQuestion = true;
                    });

                    this.studentLinesNr++;
                }
            }

            let sNames = Object.keys(snlThis);

            this.stundentsNr == sNames.length;
            // if a student has more attempts, we sort her lines by lineScore
            if (sNames.length < this.studentLinesNr) {
                sNames.forEach(sn => {
                    snlThis[sn].lines = snlThis[sn].lines.sort(
                        (a, b) => b.lineScore - a.lineScore
                    );
                });
                this.Mode.multiLine = true;
                this.Mode.questionScore = "voluntary";
                this.Mode.multiLineScore = "maxQuestion";
            }

            this.showUpload = false;
            this.showContext = false;
            // READ FINISHED
        },
        setMode: function (typeval) {
            this.Mode[typeval[0]] = typeval[1];
        },
    },
    computed: {
        needsAdapt() {
            return Object.keys(this.adaptOptions).length
        },
        studentsNr: function () {
            if (this.Mode.multiLine) return Object.keys(this.students).length;
            return this.studentLinesNr;
        },
        /* score is an array containing for each question
     * - its name
     * - its maximum score
     *  - an array of student scores for this questions, considering only studentScores who have been presented this question and - in voluntary case only - who have attempted that question
     */
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
        calcMaxScore: function () {
            if (isNaN(this.setMaxScore)) return this.totalScore;
            return this.setMaxScore;
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