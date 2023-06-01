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
                    <p>Exportieren Sie Ihre Testdaten aus ILIAS als .csv-Datei.</p>
                    <p>Falls Ihre Daten als Excel-Tabelle vorliegen, so speichern Sie sie in Ihrer Tabellenkalkulation als
                        .csv-Datei als "CSV UTF-8 (Durch Trennzeichen ';' getrennt)".</p>
                </template>
            </collapsed-text>
        </div>
        <p>
            Ziehen Sie die so erstellte csv-Datei mit der Maus in diese Webseite auf die Fläche unten.
        </p>
        <reader @dataRead="handleData" :data="data" :type="type" delimiter=";" key="data.length"></reader>
        <v-btn color="primary" onclick="location.href='https://dahn-research.eu/TestAnalyzerSampleData/TestdatenIlias.csv'"
            class="hvr-grow">
            Demo-Daten
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
    methods: {
        handleData() {
            const component = this;
            //this.lineArray = data;
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
                const Test = new TestObject("ILIAS");
                //???? Test.adaptOptions = { groups: [] };
                const table = this.$root.$data.lineArray;
                console.log('Original table: ', JSON.parse(JSON.stringify(table)))
                var iliasType = "normal";
                if (table[0][0] == table[2][0]) {
                    iliasType = "shuffled";
                }
                console.log('iliasType: ', iliasType)
                /* Anonymous test */
                if (table[0][0] != "Name") this.addNameLogin(table);
                let rowName = "",
                    lastNameUsed = "";

                switch (iliasType) {
                    case "shuffled": {
                        this.table2TestShuffled(table, Test);
                        break;
                    }
                    default: {
                        var headings = table[0].slice(19, table[0].length);
                        var questionsNr = headings.length;
                        Test.questionsNr = questionsNr;
                        Test.setMaxScore = table[1][3];
                        for (let q = 0; q < questionsNr; q++) {
                            let qq = new Question(headings[q]);
                            Test.questions[q] = qq;
                        }
                        Test.studentsNr = table.length - 2;
                        for (let rowNr = 1; rowNr < table.length - 1; rowNr++) {
                            let line = table[rowNr],
                                lineItems = new Line();
                            if (line[2] == "") {
                                rowName = lastNameUsed;
                            } else {
                                rowName = line[0];
                                lastNameUsed = rowName;
                            }
                            lineItems.lineName = rowName;
                            lineItems.lineNr = rowNr;
                            for (let q1 = 0; q1 < questionsNr; q1++) {
                                let qq = Test.questions[q1];
                                let rowAnswer = new Object();
                                rowAnswer.name = qq.name;
                                let score = line[19 + q1];
                                rowAnswer.attempted = score !== "";
                                if (score !== "") {
                                    score = score.replace(",", ".");
                                    var scoreVal = Number(score);
                                    rowAnswer.score = scoreVal;
                                } else {
                                    rowAnswer.score = 0;
                                }
                                lineItems.lineAnswers.push(rowAnswer);
                            }
                            Test.studentNameLines.push(lineItems);
                        }
                    }
                }

                console.log("Test: ", Test)
                return Test;
            } catch (err) {
                throw { name: "processError", message: "Test: " + err.message };
            }
        },
        addNameLogin(table) {
            console.log("addNameLogin");
            if (table[0][0] == "Zähler") {
                table[0][0] = "Benutzername";
            } else {
                table[0][0] = "Login";
            }
            table[0].unshift("Name");
            for (let i = 1; i < table.length; i++) {
                table[i].unshift("Name_" + table[i][0]);
            }
            console.log("table: ", table);
        },
        // In selected tests an random choice of all questions is presented
        table2TestShuffled(table, Test) {
            Test.setMaxScore = table[1][3];
            // Getting question titles sorted
            let qTitlePos = getQuestions();
            Test.studentsNr = table.length / 2;
            let rowName = "",
                lastNameUsed = "";
            for (let i = 0; i < Test.studentsNr; i++) {
                let lineArrayTitle = table[2 * i];
                let rowNr = 2 * i + 1;
                var line = table[2 * i + 1],
                    lineItems = new Line();
                if (Test.setMaxScore < table[1][3]) Test.setMaxScore = table[1][3];
                if (line[2] == "") {
                    rowName = lastNameUsed;
                } else {
                    rowName = line[0];
                    lastNameUsed = rowName;
                }
                lineItems.lineName = rowName;
                lineItems.lineNr = rowNr;
                for (let q1 = 19; q1 < lineArrayTitle.length; q1++) {
                    let score = line[q1],
                        q1n = lineArrayTitle[q1];
                    let qq = Test.questions[qTitlePos[q1n]];
                    let rowAnswer = new Object();
                    rowAnswer.name = qq.name;
                    rowAnswer.attempted = score !== "";
                    if (score === "") {
                        rowAnswer.score = 0;
                    } else {
                        rowAnswer.score = Number(score.replace(",", "."));
                    }
                    lineItems.lineAnswers.push(rowAnswer);
                }
                Test.studentNameLines.push(lineItems);
            }

            function getQuestions() {
                let qTitlesRaw = [];
                for (let s = 0; s < table.length / 2; s++) {
                    let ss = 2 * s,
                        line = table[ss];
                    for (let qq = 19; qq < line.length; qq++) {
                        if (!qTitlesRaw.includes(line[qq])) qTitlesRaw.push(line[qq]);
                    }
                }
                let qTitles = qTitlesRaw.sort();
                let questionsNr = qTitles.length;
                // Initializing Test.questions
                Test.questionsNr = questionsNr;
                if (!Test.questionsNr) throw "processError";
                let qTitlePos = new Object();
                for (let q = 0; q < questionsNr; q++) {
                    let qq = new Question(qTitles[q]);
                    Test.questions[q] = qq;
                    qTitlePos[qTitles[q]] = q;
                }
                return qTitlePos;
            }
        }
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