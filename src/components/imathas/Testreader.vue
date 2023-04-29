<template>
    <context></context>
    <v-container>

        <div v-if="ShowUpload">
            <h2>
                {{ $t("IMathAS.data") }}

                <v-btn color="primary"
                    onclick="location.href='https://dahn-research.eu/TestAnalyzerSampleData/TestdatenIMathAS.csv'"
                    class="hvr-grow">
                    {{ $t("IMathAS.demo") }}
                </v-btn>
            </h2>
            <p v-html="$t('IMathAS.p1')"></p>
            <img class="center" src="./assets/csvEinstellung.png" />
            <p>
                {{ $t("IMathAS.p2") }}
            </p>
        </div>
        <reader @dataRead="handleData"></reader>
    </v-container>
</template>

<script>
import Context from "@/components/Context.vue"
import Reader from "@/components/Reader.vue"
import { Question, Line, ReaderErrors } from "@/util/Reader";

export default {
    name: "IMathASTestreader",
    emits: ["testRead"],
    data() {
        return {
            ShowUpload: true,
        }
    },
    components: {
        Context,
        Reader,
    },
    methods: {
        handleData() {
            //this.lineArray = data;
            try {
                // 5. table2test
                //var test = this.table2Test();
                this.table2Test();
                //  6. Emit signal (or modify Test object's parts?)
                this.$emit("testRead");
                //console.log('Testreader emitted testRead at', JSON.parse(JSON.stringify(this.$root.$data.Test)))
                this.loading = false;
                this.Error.type = "loaded";
            } catch (er) {
                //if (er == "loadError") component.handleLoadError();
                if (er == "processError") component.handleProcessError();
            }
        },
        table2Test() {
            try {
                this.$root.$data.Test = {
                    system: "IMathAS",
                    info: "",
                    questionsNr: 0,
                    studentsNr: 0,
                    setMaxScore: "none",
                    questions: [],
                    studentNameLines: [],
                    adaptOptions: {
                        groups: [],
                        attempts: 1,
                        best: 1,
                        discriminator: 0.3,
                        less: 0.3,
                        more: 0.7
                    }
                };
                let Test = this.$root.$data.Test;
                //const table=this.lineArray;
                const table = this.$root.$data.lineArray;
                const headings = table[0];
                // Making up Test.questions
                // getQuestions returns the array of column nrs for the questionscores
                let qCols = this.getQuestions(headings);
                if (qCols.length == 0) throw "processError";
                Test.setMaxScore = this.getMaxScore();
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
                //return Test;
                //this.$root.$data.Test = Test;
            } catch (err) {
                //throw "processError";
                console.log('TR-70:', err)
            }
        },
        makeQuestion(cNr) {
            try {
                let table = this.$root.$data.lineArray,
                    Test = this.$root.$data.Test,
                    qTitle = table[0][cNr],
                    regexP = /Points \((\d+) possible\)/;
                let qq = new Question(qTitle);
                var ms = regexP.exec(table[1][cNr])[1];
                qq.maxScore = parseInt(ms);
                Test.questions.push(qq);
                return qq;
            } catch (err) {
                throw "processError";
            }

        },
        getQuestions(headings) {
            try {
                let table = this.$root.$data.lineArray,
                    Test = this.$root.$data.Test,
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
                        let qq = this.makeQuestion(cNr);
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
                //throw "processError";
                console.log('TR-109:', er)
            }
        },
        groupData(qRoot, headings) {
            let qData = { name: qRoot, nrQuestions: 0, nrSelected: 0, groupMaxScore: 0, achievedScore: 0 }, table = this.$root.$data.lineArray, groupColumns = new Array()
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
                groupScores.push(parseInt(ms));
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
        getMaxScore() {
            let Test = this.$root.$data.Test,
                maxScore = 0;
            Test.questions.forEach(q => {
                maxScore += q.maxScore;
            });
            return maxScore;
        },
    }
}
/*
function table2Test(table) {
  try {
    var Test = {
      system: "IMathAS",
      info: "",
      questionsNr: 0,
      studentsNr: 0,
      setMaxScore: "none",
      questions: [],
      studentNameLines: []
    };
    const headings = table[0];
    console.log("headings:", headings);
    let qCols = getQuestions1();
    console.log('getQuestions:', qCols)
    
  } catch (err){
    //throw "processError";
    console.log('TR-70:',err)
  }
  // getQuestions returns the array of column nrs for the questionscores
  function getQuestions() {
    try {
      let qPkt = new Array(),
        questionsNr = 0,
        cNr = 0,
        regex = /Points \((\d+) possible\)/;
      while (cNr < headings.length) {
        if (headings[cNr].match(/^Question/)) {
          let qq = new Question(headings[cNr]);
          var ms = regex.exec(table[1][cNr])[1];
          qq.maxScore = parseInt(ms);
          qPkt.push(cNr);
          Test.questions.push(qq);
          questionsNr++;
          cNr = cNr + 2;
        } else {
          cNr++;
        }
      }
      Test.questionsNr = questionsNr;
      return qPkt;
    } catch (er) {
      //throw "processError";
      console.log('TR-96:',er)
    }
  }

  function getMaxScore() {
    let maxScore = 0,
      rex = /(Question\s\d+)-/,
      root = "",
      ssq = 0;
    Test.questions.forEach(q => {
      let qnParts = rex.exec(q.name);
      if (qnParts) {
        if (qnParts[1] != root) {
          maxScore += ssq;
          root = qnParts[1];
          ssq = q.maxScore;
        } else {
          ssq = Math.max(ssq, q.maxScore);
        }
      } else {
        maxScore += ssq;
        maxScore += q.maxScore;
      }
    });
    maxScore += ssq;
    return maxScore;
  }
}
*/
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