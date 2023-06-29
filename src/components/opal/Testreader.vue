<template>
    <v-container>
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
                    Open OPAL in eine
                    <i>.csv-Datei</i>.
                    <v-btn icon="true" elevation="8" size="medium" variant="outlined" @click="showExport = !showExport">
                        <v-icon size="large">{{ showExport ? "mdi-chevron-up" : "mdi-chevron-down"
                        }}</v-icon>
                    </v-btn>


                    <Export v-if="showExport"></Export>


                </p>
                <p>
                    Ziehen Sie diese Datei mit der Maus in diese Webseite auf die Fläche
                    unten.
                </p>
            </template>
        </collapsed-text>
        <reader @dataRead="handleData" :data="data" type="csv" delimiter="\t" key="data.length"></reader>
        <v-container>
            <v-btn color="primary"
                onclick="location.href='https://dahn-research.eu/TestAnalyzerSampleData/TestdatenOpal.csv'"
                class="hvr-grow">
                Demo-Daten
            </v-btn>
        </v-container>
    </v-container>
</template>

<script>
import Export from "@/components/opal/Export.vue";
import CollapsedText from "@/components/CollapsedText.vue";
import Context from "@/components/Context.vue"
import Reader from "@/components/Reader.vue"
import { TestObject, Question, Line } from "@/util/Reader";
import ReaderErrors from "@/util/ReaderErrors";

export default {
    name: "OpalTestreader",
    emits: ["testRead"],
    mixins: [ReaderErrors],
    data() {
        return {
            showExport: false,
            data: ""
        }
    },
    components: {
        Context,
        Reader,
        CollapsedText,
        Export
    },
    methods: {
        handleData() {
            try {
                const Test = this.table2Test();
                this.$emit("testRead", Test);
                this.loading = false;
            }
            catch (er) {
                this.handleProcessError(er);
            }
        },
        table2Test() {
            const Test = new TestObject("Open OPAL");
            Test.adaptOptions = {}
            const table = this.$root.$data.lineArray;
            var qPkt = this.getQuestions(Test);
            var rowNr = 3,
                tl = table.length;
            while (rowNr < tl - 3) {
                let line = table[rowNr - 1],
                    lineItems = new Line(),
                    firstName = line[2] ? line[2] : "",
                    givenName = line[1],
                    rowName = firstName + " " + givenName;
                lineItems.lineName = rowName;
                lineItems.lineNr = rowNr;
                for (let q1 = 0; q1 < Test.questionsNr; q1++) {
                    let qq = Test.questions[q1];
                    let rowAnswer = new Object();
                    let s = line[qPkt[q1].scoreCol];
                    let at = false;
                    qPkt[q1].responseCols.forEach((cc) => {
                        if (line[cc]) at = true;
                    });
                    if (at && typeof s == "string") s = s.replace(",", ".");
                    rowAnswer = {
                        name: qq.name,
                        attempted: at,
                        score: at ? Number(s) : 0,
                    };
                    lineItems.lineAnswers.push(rowAnswer);
                }
                Test.studentNameLines.push(lineItems);
                rowNr++;
            }
            return Test;
        },
        getQuestions(Test) {

            let table = this.$root.$data.lineArray;
            let qTitleRow = table[0],
                qResponseRow = table[1],
                qNr = 0;
            let cols = qTitleRow.length;
            // qPkt: Array hat collects the indices of columns with scores (heading contains 'Pkt')
            // Array qPkt contains objects {name: String, scoreCol: Int, responseCols: Array of Int}
            let qPkt = [],
                qTitles = [],
                regex = /^Max\.\sPunkte:\s(\d+)/,
                regExResponse = /^Antwort \(RESPONSE/,
                qPktItem = { name: "none", scoreCol: 0, responseCols: [] };
            for (let c = 0; c < cols; c++) {
                let qs = qTitleRow[c];
                // We ignore questions with 0 points
                if (qs && qs.match(regex) && parseInt(regex.exec(qs)[1])) {
                    if (qNr > 0) {
                        if (qNr > 1) {
                            if (qPktItem.responseCols.length === 0) {
                                throw { type: "processError", message: "Keine Antwortspalten für Frage " + qNr.toString() + " gefunden." };
                            }
                            qPkt.push(qPktItem);
                        }
                        let qT = qTitleRow[c - 1];
                        if (!qT) qT = "Frage " + qNr.toString();
                        if (qTitles.includes(qT)) {
                            throw { type: "processError", message: "Frage " + qNr.toString() + " hat denselben Titel wie Frage " + qTitles.indexOf(qT).toString() + "." };
                        }
                        qPktItem = { name: qT, scoreCol: c, responseCols: [] };
                        //Test.questions[qNr - 1] = new Question("Frage " + qNr.toString());
                        Test.questions[qNr - 1] = new Question(qT);
                        qTitles.push(qT);
                        Test.questions[qNr - 1].maxScore = parseInt(regex.exec(qs)[1]);
                        qNr++;
                    } else {
                        Test.setMaxScore = parseInt(regex.exec(qs)[1]);
                        qNr = 1;
                    }
                } else {
                    if (qResponseRow[c] && qResponseRow[c].match(regExResponse))
                        qPktItem.responseCols.push(c);
                }
            }
            if (qPktItem.responseCols.length === 0) {
                throw { type: 'processError', message: "Keine Antwortspalten für Frage " + qNr.toString() + " gefunden." };
            } else {
                qPkt.push(qPktItem);
            }

            Test.questionsNr = qNr - 1;
            if (qNr < 2) {
                throw {type: "processError", message: "Keine Fragen gefunden."};
            }
            return qPkt;
        }
    }
}
</script>