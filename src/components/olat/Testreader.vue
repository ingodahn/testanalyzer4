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
                        Datei mit der Endung ,xlsx vorfinden. Überschreiben Sie diese
                        Datei
                        <u>nicht</u> mit einem anderen Programm, wie etwa einer
                        Tabellenkalkulation! Ziehen Sie diese xlsx-Datei mit der Maus
                        in diese Webseite auf die Fläche unten.
                    </p>
                </template>
            </collapsed-text>
        </div>
        <v-container>
            Ziehen Sie die xlsx-Datei mit Ihren Daten mit der Maus in diese Webseite auf die Fläche unten.
        </v-container>
        <reader @dataRead="handleData" :data="data" type="xlsx" :key="data.length"></reader>
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
            type: 'xlsx',
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
            this.gotType = type
            const Test = this.table2Test();
            this.$emit("testRead", Test);
            this.loading = false;
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
                // Test.setMaxScore Maximum score if all atempted in a row got maxScore
                Test.setMaxScore = 0;
                for (var q1 = 0; q1 < Test.questionsNr; q1++)
                    Test.questions[q1].getMaxScore()
                while (rowNr <= tl) {
                    var line = table[rowNr - 1],
                        lineItems = new Line();
                    rowName = Test.isSelfTest ? line[1] : line[1] + " " + line[2];
                    lineItems.lineName = rowName;
                    lineItems.lineNr = rowNr;
                    let rowMaxScore = 0;
                    for (var q1 = 0; q1 < Test.questionsNr; q1++) {
                        var qq = Test.questions[q1];
                        let rowAnswer = new Object();
                        // In xlsx-Dateien erkennt man unversuchte Aufgaben an einem leeren Punkteeintrag
                        let scoreVal = Number(line[qPkt[q1]]);
                        rowAnswer =
                            line[qPkt[q1]].length == 0
                                ? { attempted: false, score: 0 }
                                : { attempted: true, score: scoreVal };
                        if (rowAnswer.attempted) rowMaxScore += Test.questions[q1].maxScore;
                        if (typeof rowMaxScore != "number") throw { name: "processError", message: "No maxScore found-String:"+Test.questions[q1].maxScore };
                        rowAnswer["name"] = qq.name;
                        lineItems.lineAnswers.push(rowAnswer);
                    }
                    Test.setMaxScore = Math.max(Test.setMaxScore, rowMaxScore);
                    Test.studentNameLines.push(lineItems);
                    rowNr++;
                }
                return Test;
            } catch (err) {
                console.log("ProcessError in OLAT-Testreader:", err.message);
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