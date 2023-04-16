<template>
    <h3>IMathAS Testreader</h3>
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
    data() {
        return {
            ShowUpload: true,
            lineArray: []
        }
    },
    components: {
        Context,
        Reader
    },
    methods: {
        handleData(data) {
            this.lineArray = data;
            try {
            // 5. table2test
            var test = this.table2Test();
            //  6. Emit signal (or modify Test object's parts?)
        this.$emit("testRead", test);
        console.log('Testreader emitted test', test)
        this.loading = false;
        this.Error.type = "loaded";
      } catch (er) {
        //if (er == "loadError") component.handleLoadError();
        if (er == "processError") component.handleProcessError();
      }
        },
        table2Test() {
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
                const table=this.lineArray;
                const headings = this.lineArray[0];
                // Making up Test.questions
                // getQuestions returns the array of column nrs for the questionscores
                let qCols = this.getQuestions(Test, headings);
                if (qCols.length == 0) throw "processError";
                Test.setMaxScore = this.getMaxScore(Test);
                console.log('setMaxScore:', Test.setMaxScore)
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
                //throw "processError";
                console.log('TR-70:', err)
            }
        },
        getQuestions(Test, headings) {
            try {
                let table = this.lineArray,
                    qPkt = new Array(),
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
                console.log('TR-96:', er)
            }
        },
        getMaxScore(Test) {
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