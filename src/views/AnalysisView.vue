<template>
    <h2>Here comes the AnalysisView</h2>
    <adapt v-if="adaptable" />
    <control-center v-if="layout == 'all'" id="controlCenter" :Mode="mode" v-on:typeselected="setMode"></control-center>
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
    <Less id="less" :Score="score" :Mode="mode" :ComponentStatus="componentStatus" :Layout="layout"></Less>
    <Attempts id="attempts" :Questions="questions" :Mode="mode" :ComponentStatus="componentStatus" :Layout="layout">
    </Attempts>
</template>

<script>
import { Student } from "@/components/Scoring.js";
import Adapt from "@/components/imathas/Adapt.vue"
import ControlCenter from "@/components/ControlCenter.vue";

import ScoreDistribution from "@/components/ScoreDistribution.vue";
import More from "@/components/More.vue";
import Less from "@/components/Less.vue";
import Attempts from "@/components/Attempts.vue";

export default {
    name: "AnalysisView",
    components: {
        Adapt,
        ControlCenter,
        ScoreDistribution,
        More,
        Less,
        Attempts
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
            mode: {
                questionScore: "compulsory",
                // multiLine is true iff at least one student name occurs in more than one line
                multiLine: false,
                // multiQuestion is true iff in at least one line at least one question occurs more than once
                multiQuestion: false,
                //mode.multiLineScore is false if each student has a single line. Otherwise it is one of 'maxQuestion', 'maxLine' or 'single'
                multiLineScore: false
            },
            Test: this.$root.$data.Test,
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
                        if (cnt > 1) this.mode.multiQuestion = true;
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
                this.mode.multiLine = true;
                this.mode.questionScore = "voluntary";
                this.mode.multiLineScore = "maxQuestion";
            }

            this.showUpload = false;
            this.showContext = false;
            // READ FINISHED
        },
        setMode: function (typeval) {
            this.mode[typeval[0]] = typeval[1];
        },
        adaptable() {
            return Object.keys(this.Test.adaptOptions).length
        },
    },
    computed: {
        needsAdapt() {
            return Object.keys(this.adaptOptions).length
        },
        studentsNr: function () {
            if (this.mode.multiLine) return Object.keys(this.students).length;
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
                    if (this.mode.questionScore == "compulsory") {
                        if (q.presentedTo(j)) triedqscores.push(q.scoreOf(j));
                    } else {
                        if (q.attemptedBy(j)) triedqscores.push(q.scoreOf(j));
                    }
                });
                var totals =
                    this.mode.questionScore == "compulsory" ? q.presented : q.attempted;
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

            if (!this.mode.multiLine) {
                nameArray.forEach(sname => {
                    studentScores.push({
                        name: sname,
                        realName: sname,
                        totalScore: this.students[sname].getScore(this.mode, this.questions)
                    });
                });
            } else if (this.mode.multiLine && this.mode.multiLineScore == "single") {
                nameArray.forEach(sname => {
                    {
                        let scoreArray = this.students[sname].getScore(
                            this.mode,
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
            } else if (this.mode.multiLine) {
                nameArray.forEach(sname => {
                    studentScores.push({
                        name: sname,
                        realName: sname,
                        totalScore: this.students[sname].getScore(this.mode, this.questions)
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