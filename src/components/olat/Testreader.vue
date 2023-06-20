<template>
    <v-container>

        <div>
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
                    <p>
                        Zur Auswertung der Testergebnisse archivieren Sie zunächst den Test in
                        Open OLAT. Sie finden das Werkzeug zur Datenarchivierung in Ihrem
                        OLAT-Kurs im Menü
                        <i>Administration</i>. Ändern Sie die voreingestellten Download-Optionen
                        nicht.
                    </p>
                    <p>
                        Sie erhalten ein zip-Archiv, in dem Sie nach dem Entpacken u.a. eine
                        Datei mit der Endung .xls oder ,xlsx vorfinden. Überschreiben Sie diese
                        Datei
                        <u>nicht</u> mit einem anderen Programm, wie etwa einer
                        Tabellenkalkulation! Ziehen Sie diese xls- oder xlsx-Datei mit der Maus
                        in diese Webseite auf die Fläche unten.
                    </p>
                </template>
            </collapsed-text>
        </div>
        <v-container>
            Ziehen Sie die xls- bzw. xlsx-Datei mit Ihren Daten mit der Maus in diese Webseite auf die Fläche unten.
        </v-container>
        <reader @dataRead="handleData" :data="data" type="xls|xlsx" :key="data.length"></reader>
        <v-btn color="primary" onclick="location.href='https://dahn-research.eu/TestAnalyzerSampleData/TestdatenOlat.xlsx'"
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
    name: "OlatTestreader",
    emits: ["testRead"],
    mixins: [ReaderErrors],
    data() {
        return {
            ShowUpload: true,
            data: "",
            type: 'xls|xlsx',
            gotType: null,
        }
    },
    components: {
        CollapsedText,
        Context,
        Reader,
    },
    methods: {
        handleData(type) {
            console.log("handleData for Olat of type", type)
            this.gotType = type
            const Test = this.table2Test();
            if (type == "xls") {
                addMaxScores(test.questions, this.legend);
            }
            this.$emit("testRead", Test);
            this.loading = false;
            console.log("Data handled")
        },
        table2Test() {
            try {
                const Test = new TestObject("Open OLAT");
                const table = this.$root.$data.lineArray;
                Test.isSelfTest = false
                Test.adaptOptions = {};
                var qPkt = this.getQuestions(Test, table[0]);
                if (Test.questionsNr == 0) throw { name: "processError", message: "No questions found" };
                Test.isSelfTest = table[1][2] == "Nachname" ? false : true;
                var rowNr = 3,
                    rowName = "",
                    tl = table.length;
                if (this.gotType == "xls") tl--;
                if (this.gotType == "xlsx") Test.setMaxScore=0;
                console.log('Got type', this.gotType, 'tl', tl)
                while (rowNr <= tl) {
                    var line = table[rowNr - 1],
                        lineItems = new Line();
                    rowName = Test.isSelfTest ? line[1] : line[1] + " " + line[2];
                    lineItems.lineName = rowName;
                    lineItems.lineNr = rowNr;
                    if (this.gotType == "xlsx") {
                        Test.setMaxScore = Math.max(Test.setMaxScore, Number(line[4]));
                    }
                    for (var q1 = 0; q1 < Test.questionsNr; q1++) {
                        var qq = Test.questions[q1];
                        let rowAnswer = new Object();
                        switch (this.gotType) {
                            case "xlsx": {
                                // In xlsx-Dateien erkennt man unversuchte Aufgaben an einem leeren Punkteeintrag
                                let scoreVal = Number(line[qPkt[q1]]);
                                rowAnswer =
                                    line[qPkt[q1]].length == 0
                                        ? { attempted: false, score: 0 }
                                        : { attempted: true, score: scoreVal };
                                break;
                            }
                            default: {
                                // in xls-Dateien erkennt man unversuchte Aufgaben an einem "n/a" in der auf die Punktspalte folgenden Spalte für die Startzeit oder 0 für die Dauer
                                let regex = /^n\/a$|^0$/;
                                rowAnswer = {
                                    score: Number(line[qPkt[q1]]),
                                    attempted: line[qPkt[q1] + 1].match(regex) ? false : true
                                };
                            }
                        }
                        rowAnswer["name"] = qq.name;
                        lineItems.lineAnswers.push(rowAnswer);
                    }
                    Test.studentNameLines.push(lineItems);
                    rowNr++;
                }
                console.log("table2Test", JSON.parse(JSON.stringify(Test)))
                return Test;
            } catch (err) {
                throw { name: "processError", message: "Test: " + err.message };
            }

        },
        //getQuestions collects all questions in Test.questions and returns in qPkt for each question number the nr of the column with its score
        getQuestions(Test, qTitleRow) {
            let table = this.$root.$data.lineArray
            var cols = qTitleRow.length;
            // qPkt: Array hat collects the indices of columns with scores (heading contains 'Pkt')
            var qPkt = [];
            for (var c = 0; c < cols; c++) {
                var qs = qTitleRow[c];
                if (qs.length > 0 && !qs.match(/$Sektion/)) {
                    Test.questions[Test.questionsNr] = new Question(qs);
                }
                if (table[1][c].match(/Pkt/)) {
                    qPkt[Test.questionsNr] = c;
                    Test.questionsNr++;
                }
            }
            return qPkt;
        },
        addMaxScores(myQuestions, legend) {
            try {
                const regex = /maxValue\s*([\d.]+)/g;
                var i = 0;
                var match = true;
                do {
                    match = regex.exec(legend);
                    if (match) {
                        myQuestions[i].maxScore = Number(match[1]);
                        i++;
                    }
                } while (match);
                return "ok";
            } catch (err) {
                throw { name: "processError", message: "Test: " + err.message };
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