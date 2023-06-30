<template>
    <v-container>

        <div v-if="ShowUpload">
            <collapsed-text>
                <template #title>
                    {{ $t('Test.context') }}
                </template>
                <template #default>
                    <context></context>
                </template>
            </collapsed-text>
            <collapsed-text>
                <template #title>
                    {{ $t("Test.data") }}
                </template>
                <template #default>
                    <p v-html="$t('IMathAS.p1')"></p>
                    <img class="center" src="./assets/csvEinstellung.png" />
                </template>
            </collapsed-text>
        </div>
        <p>
            {{ $t("IMathAS.p2") }}
        </p>
        <reader @dataRead="handleData" :data="data" :type="type" :key="data.length"></reader>
        <v-btn color="primary"
            onclick="location.href='https://dahn-research.eu/TestAnalyzerSampleData/TestdatenIMathAS.csv'" class="hvr-grow">
            {{ $t("IMathAS.demo") }}
        </v-btn>
    </v-container>
</template>

<script>
import axios from "axios";
import CollapsedText from "@/components/CollapsedText.vue";
import Context from "@/components/Context.vue"
import Reader from "@/components/Reader.vue"
import { TestObject, Question, Line } from "@/util/Reader";
import ReaderErrors from "@/util/ReaderErrors";

export default {
    name: "IMathASTestreader",
    emits: ["testRead"],
    mixins: [ReaderErrors],
    data() {
        return {
            ShowUpload: true,
            data: "",
            type: 'csv'
        }
    },
    components: {
        CollapsedText,
        Context,
        Reader,
    },

    created: function () {
        let q = this.$route.query,
            component = this,
            callPath = document.referrer.substring(
                0,
                document.referrer.indexOf("course")
            );
        if (
            Object.prototype.hasOwnProperty.call(q, "cid") &&
            Object.prototype.hasOwnProperty.call(q, "aid")
        ) { // We assume the new UI, the testanalyzer isn't linked from the old UI 
            let csvScript = "course/gb-aidexport2.php?aid=";
                //Object.prototype.hasOwnProperty.call(q, "ui") && q.ui == "2"
                //   ? "course/gb-aidexport2.php?aid="
                //    : "course/gb-aidexport.php?aid=";
            var params = new URLSearchParams();
            params.append("options", "Export");
            params.append("pts", "1");
            params.append("ba", "1");
            axios.post(callPath + csvScript + q.aid + "&cid=" + q.cid, params).then(
                result => {
                    this.data = result.data;
                },
                (er) => {
                    component.handleProcessError(er);
                }
            );
        }
    },
    computed: {
        p0test() {
            return this.$t('Test.p1') + "<b>Bold</b> "
        }
    },

    methods: {
        handleData() {
            const component = this;
            try {
                // 5. table2test
                const Test = this.table2Test();
                //  6. Emit signal (or modify Test object's parts?)
                this.$emit("testRead", Test);
                this.loading = false;
                //this.Error.type = "loaded";
            } catch (er) {
                this.handleProcessError(er);
            }
        },
        table2Test() {
            try {
                const Test = new TestObject("IMathAS");
                Test.adaptOptions = { groups: [] };
                const table = this.$root.$data.lineArray;
                const headings = table[0];
                // Making up Test.questions
                // getQuestions returns the array of column nrs for the questionscores
                let qCols = this.getQuestions(Test, headings);
                if (qCols.length == 0) throw { name: "processError", message: "No questions found" };
                Test.setMaxScore = this.getMaxScore(Test);
                Test.studentsNr = table.length - 2;
                for (let i = 2; i < table.length; i++) {
                    let line = table[i];
                    let lineItems = new Line();
                    lineItems.lineName = line[0];
                    lineItems.lineNr = i;
                    for (let qNr = 0; qNr < Test.questionsNr; qNr++) {
                        let rowAnswer = {
                            name: Test.questions[qNr].name,
                            attempted: line[qCols[qNr] + 1].replace(/NA|&|\|/g, "") != "",
                            score: Number(line[qCols[qNr]])
                        };
                        lineItems.lineAnswers.push(rowAnswer);
                    }
                    Test.studentNameLines.push(lineItems);
                }
                return Test;
            } catch (err) {
                //throw { name: "processError", message: "Error making Test: " + err.message };
                throw { name: "processError", message: "Test: " + err.message };
            }
        },
        makeQuestion(Test, cNr) {
            try {
                let table = this.$root.$data.lineArray,
                    qTitle = table[0][cNr],
                    regexP = /Points \((\d+) possible\)/;
                let qq = new Question(qTitle);
                var ms = regexP.exec(table[1][cNr])[1];
                qq.maxScore = parseInt(ms);
                Test.questions.push(qq);
                return qq;
            } catch (err) {
                throw { name: "processError", message: "Error making question in column " + cNr.toString() };
            }

        },
        getQuestions(Test, headings) {
            try {
                let table = this.$root.$data.lineArray,
                    // qPkt gets the column numbers of the questionscores
                    qPkt = new Array(),
                    questionsNr = 0,
                    cNr = 0,
                    // groupOptions ???
                    //groups gets roots of group question names, number of questions of group and number of presented questions from group
                    lastGroup = null,
                    regexQ = /^Question\s(\d+)/,
                    regexG = /^Question\s(\d+)-\d+/ // Question Group
                while (cNr < headings.length) {
                    if (headings[cNr].match(regexQ)) {
                        qPkt.push(cNr);
                        let qq = this.makeQuestion(Test, cNr);
                        let qTitle = qq.name;
                        if (qTitle.match(regexG)) {
                            // getting question number
                            let qNr = regexQ.exec(qTitle)[1];
                            let qRoot = "Question " + qNr.toString();
                            if (lastGroup != qRoot) {
                                Test.adaptOptions.groups.push(this.groupData(qRoot, headings))
                                //Test.adaptOptions.groups.push(qRoot);
                                lastGroup = qRoot;
                            }
                        }
                        cNr = cNr + 2;
                    } else {
                        cNr++;
                    }
                }
                Test.questionsNr = Test.questions.length;
                return qPkt;
            } catch (er) {
                throw { name: "processError", message: "Error getting questions headings: " + er.message };
            }
        },
        groupData(qRoot, headings) {
            let qData = { name: qRoot, nrQuestions: 0, nrSelected: 0, groupMaxScore: 0, groupCalcMaxScore:0, achievedScore: 0 }, table = this.$root.$data.lineArray, groupColumns = new Array()
            //Get all columns relevant for group
            let qi = 0;
            while (qi < headings.length) {
                if (headings[qi].startsWith(qRoot + '-')) {
                    groupColumns.push(qi)
                    qi = qi + 2;
                } else {
                    qi++;
                }
            }
            qData.nrQuestions = groupColumns.length
            let groupScores = new Array(), regexP = /Points \((\d+) possible\)/;
            // Get max score for each question in group
            for (let c = 0; c < groupColumns.length; c++) {
                let cc = groupColumns[c]
                let ms = regexP.exec(table[1][cc])[1];
                let msi=parseInt(ms);
                qData.groupCalcMaxScore += msi;
                groupScores.push(msi);
            }
            // How many questions from group have been presented to students and what is the maximum score achieved?
            for (let row = 2; row < table.length; row++) {
                let rn = 0, rScore = 0, rScoreAchieved = 0;
                for (let c = 0; c < groupColumns.length; c++) {
                    let cc = groupColumns[c]
                    // If there is a score in the column, we count the nr of points of this question and increase the number of questions presented
                    if (table[row][cc] != '') {
                        rScore += groupScores[c]
                        rScoreAchieved += parseFloat(table[row][cc])
                        rn++
                    }
                }
                qData.groupMaxScore = Math.max(rScore, qData.groupMaxScore)
                qData.achievedScore = Math.max(rScoreAchieved, qData.achievedScore)
                qData.nrSelected = Math.max(rn, qData.nrSelected)
            }
            return qData

        },
        // We consider each part of a question group as a separate question
        getMaxScore(Test) {
            let maxScore = 0;
            Test.questions.forEach(q => {
                maxScore += q.maxScore;
            });
            return maxScore;
        },
    }
}
</script>

<style scoped>
/* Grow */
.hvr-grow {
    display: inline-block;
    vertical-align: middle;
    transform: translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    backface-visibility: hidden;
    -moz-osx-font-smoothing: grayscale;
    transition-duration: 0.3s;
    transition-property: transform;
}

.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
    transform: scale(1.1);
}
</style>