
//import { saveAs } from "file-saver";


// Path: src/util/Question.js
export class Question {
  constructor(name) {
    this.name = name;
    this.maxScore = "none";
    this.studentScoreAvg = { compulsory: "none", voluntary: "none" };
    this.maxStudentScoreAvg = { compulsory: "none", voluntary: "none" };
    /*
     * answers is the object of scores achieved by students. Keys of scores are student names.
     * answers[studentName] is an object, the keys of which are line numbers.
     * answers[studentName][lineNr] is an array of objects {attempted: true|false, score: scoreValue}
     */
    this.answers = {};
    this.studentScores = new Object();
  }

  getMaxScore() {
    if (this.maxScore == "none") {
      this.maxScore = Object.values(this.studentScores).reduce(
        (a, b) => Math.max(a, b.maxScore),
        0
      );
    }
    // If no student has score > 0 we assume maxScore=1
    if (this.maxScore === 0) this.maxScore = 1;
    // maxScore can be string if modified by input
    return Number(this.maxScore);
  }

  // Question has been presented to student in that line that many times
  presentedToInLine(studentName, lineNr) {
    if (
      Object.prototype.hasOwnProperty.call(this.answers, studentName) &&
      Object.prototype.hasOwnProperty.call(this.answers[studentName], lineNr)
    )
      return this.answers[studentName][lineNr].length;
    return 0;
  }

  // Question has been presented to student that many times
  presentedTo(studentName) {
    return Object.prototype.hasOwnProperty.call(this.studentScores, studentName)
      ? this.studentScores[studentName].presented
      : 0;
  }

  // Question has been presented that many times
  get presented() {
    var studentNames = Object.keys(this.answers);
    return studentNames.reduce((a, b) => a + this.presentedTo(b), 0);
  }

  // Question attemptedBy(studentNr): Student with nr studentNr has attempted question that often
  attemptedByInLine(studentName, lineNr) {
    if (
      Object.prototype.hasOwnProperty.call(this.answers, studentName) &&
      Object.prototype.hasOwnProperty.call(this.answers[studentName], lineNr)
    )
      return this.answers[studentName][lineNr].filter(a => a.attempted).length;
    return 0;
  }
  // Question attemptedBy(studentNr): Student with name studentName has attempted question that often
  attemptedBy(studentName) {
    return Object.prototype.hasOwnProperty.call(this.studentScores, studentName)
      ? this.studentScores[studentName].attempted
      : 0;
  }

  get attempted() {
    var studentNames = Object.keys(this.answers);
    return studentNames.reduce((a, b) => a + this.attemptedBy(b), 0);
  }

  scoreOfInLine(studentName, lineNr) {
    if (
      Object.prototype.hasOwnProperty.call(this.answers, studentName) &&
      Object.prototype.hasOwnProperty.call(this.answers[studentName], lineNr)
    )
      return this.answers[studentName][lineNr].reduce((a, b) => b.score, 0);
    return 0;
  }

  scoreOf(studentName) {
    return Object.prototype.hasOwnProperty.call(this.studentScores, studentName)
      ? this.studentScores[studentName].totalScore
      : 0;
  }

  scoreAttemptsOf(studentName, method) {
    //if (this.answers.hasOwnProperty(studentName)) {
    if (Object.prototype.hasOwnProperty.call(this.studentScores, studentName)) {
      let ss = this.studentScores[studentName];
      return {
        attempts: ss.attempts,
        totalScore: method == "max" ? ss.maxScore : ss.totalScore
      };
    }
    return { attempts: 0, totalScore: 0 };
  }
  //We take for each student the average score of all attempts under consideration
  // and then the average of these averages -
  //this prevents individual students with many attempts from dominating the statistics
  getStudentScoreAvg(questionScore) {
    if (this.studentScoreAvg[questionScore] == "none") {
      let ssa = Object.values(this.studentScores);
      let sz = 0,
        sn = 0,
        m = questionScore == "voluntary" ? "attempted" : "presented";
      ssa.forEach(s => {
        if (s[m]) {
          sz += s.totalScore / s[m];
          sn++;
        }
      });
      this.studentScoreAvg[questionScore] = sn ? sz / sn : 0;
    }
    return this.studentScoreAvg[questionScore];
  }
  getMaxStudentScoreAvg(questionScore) {
    if (this.maxStudentScoreAvg[questionScore] == "none") {
      let ssa = Object.values(this.studentScores);
      let sz = 0,
        sn = 0,
        vol = questionScore == "voluntary";
      ssa.forEach(s => {
        sz += s.maxScore;
        if (vol) {
          sn += s.attempted ? 1 : 0;
        } else {
          sn += s.presented ? 1 : 0;
        }
      });
      this.maxStudentScoreAvg[questionScore] = sn ? sz / sn : 0;
    }
    return this.maxStudentScoreAvg[questionScore];
  }

  // Adds student answers to question, returns, how often the student has asnwered this question in this line
  addStudentLineAnswer(studentName, lineNr, att, sco) {
    if (!Object.prototype.hasOwnProperty.call(this.answers, studentName)) {
      this.answers[studentName] = new Object();
      this.studentScores[studentName] = new StudentScores();
    }
    let sScore = this.studentScores[studentName];
    sScore.presented++;
    if (att) sScore.attempted++;
    sScore.totalScore += sco;
    if (sco > sScore.maxScore) sScore.maxScore = sco;

    if (
      !Object.prototype.hasOwnProperty.call(this.answers[studentName], lineNr)
    )
      this.answers[studentName][lineNr] = [];
    this.answers[studentName][lineNr].push({ attempted: att, score: sco });

    return this.answers[studentName][lineNr].length;
  }

  // Number of times this question has been attempted
  get attempts() {
    //return this.answers.filter(this.attempted).length;
    return Object.keys(this.answers).reduce(
      (a, b) => a + this.attemptedBy(b),
      0
    );
  }
}

/*
 StudentScores objects have keys
    * totalScore (sum of all scores achieved)
    * maxScore (maximum score achieved)
    * presented (how often was this question presented to this student)
    * attempted (how often was this question attempted by this student)
    * */
export class StudentScores {
  constructor() {
    this.totalScore = 0;
    this.maxScore = 0;
    this.presented = 0;
    this.attempted = 0;
  }
}

export class Line {
  constructor(nr) {
    this.lineNr = nr;
    this.lineName = "";
    // lineAnswers should contain objects {name, score,attempted}
    this.lineAnswers = [];
  }

  get participated() {
    return this.lineAnswers.filter(a => a.attempted).length;
  }

  get lineScore() {
    return this.lineAnswers.reduce((a, b) => a + b["score"], 0);
  }
}

import { Student } from "@/components/Scoring.js";

export class TestObject {
  constructor(system) {
    this.system = system;
    this.reportingProblem = false;
    this.questionsNr = 0;
    this.studentsDataNr = 0;
    this.questions = [];
    this.students = {};
    this.studentsNr = 0;
    this.Mode = {
      questionScore: "compulsory",
      // multiLine is true iff at least one student name occurs in more than one line
      multiLine: false,
      // multiQuestion is true iff in at least one line at least one question occurs more than once
      multiQuestion: false,
      //mode.multiLineScore is false if each student has a single line. Otherwise it is one of 'maxQuestion', 'maxLine' or 'single'
      multiLineScore: false
    };
    this.adaptOptions = null;
    this.error = {
      type: "none",
      status: "start"
    };
    this.studentLinesNr = 0;
    this.studentNameLines = [];
    this.showContext = true;
    this.showUpload = true;
    this.layout = "all";
    this.setMaxScore = "none";
    this.loading = false;
  }
  update() {
    this.questionsNr = this.questions.length;
    let qIndex = new Object();
    this.questions.forEach(function (v, a) {
      qIndex[v.name] = a;
    });
    this.studentsDataNr = this.studentsNr;
    var snlThis = new Object();
    this.studentLinesNr = 0;
    var snlThat = this.studentNameLines;
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
    this.studentsNr = (this.Mode.multiLine) ? Object.keys(this.students).length : this.studentLinesNr;
    this.showUpload = false;
    this.showContext = false;
    // Update FINISHED
  }

}