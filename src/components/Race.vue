<template>
    <v-container id="race">
      <h2>{{ $t("Race.h2") }}</h2>
      <div style="text-align: center;">
        <svg
          v-if="ScoredSorted.length > 0"
          id="racetrack"
          :width="width"
          :height="height + 10"
          style="display: inline-block;"
        >
          <line
            :x1="width - left"
            :y1="top"
            :x2="width - right"
            :y2="top"
            stroke="black"
            stroke-width="1px"
          ></line>
          <line
            :x1="width - left"
            :y1="bottom"
            :x2="width - right"
            :y2="bottom"
            stroke="black"
            stroke-width="1px"
          ></line>
          <line
            :x1="width - left"
            :y1="top"
            :x2="width - left"
            :y2="bottom"
            stroke="black"
            stroke-dasharray="5 5"
            stroke-width="1px"
          ></line>
          <linearGradient id="background" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFC107"></stop>
            <stop offset="100%" stop-color="white"></stop>
          </linearGradient>
          <rect
            :x="0"
            :y="top"
            :width="width - left"
            :height="bottom - top"
            fill="url(#background)"
          ></rect>
          <image
            xlink:href="/flag.svg"
            :x="width - 70"
            y="100"
            width="70"
            height="70"
          ></image>
          <text
            :x="width - right + (right - left) * 0.2 - 20"
            :y="bottom + 15"
            fill="black"
          >
            20 %
          </text>
          <text
            :x="width - right + (right - left) * 0.4 - 20"
            :y="bottom + 15"
            fill="black"
          >
            40 %
          </text>
          <text
            :x="width - right + (right - left) * 0.6 - 20"
            :y="bottom + 15"
            fill="black"
          >
            60 %
          </text>
          <text
            :x="width - right + (right - left) * 0.8 - 20"
            :y="bottom + 15"
            fill="black"
          >
            80 %
          </text>
          <text :x="width - left - 30" :y="bottom + 15" fill="black">100 %</text>
          <text
            id="trackMsg"
            :x="width - right + (right - left) * 0.5 - curStudent.length * 5"
            :y="bottom + 40"
            fill="hsl(198, 65%, 40%)"
          >
            {{ trackMsg }}
          </text>
          <text :x="width - right - 10" :y="bottom + 15" fill="black">0 %</text>
          <circle
            v-for="item in studentScores"
            :key="item.name"
            @mouseover="curStudent = item.name"
            :cx="item.x"
            :cy="item.y"
            :r="diameter"
            stroke="blue"
            fill="white"
          ></circle>
        </svg>
      </div>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "Race",
    props: ["ScoredSorted", "TotalScore"],
    data() {
      return {
        width: 700,
        height: 300,
        left: 60,
        right: 690,
        top: 10,
        bottom: 250,
        diameter: 5,
        curStudent: "none"
      };
    },
    computed: {
      studentScores: function() {
        var studentScores = [];
        var diff = this.right - this.left;
        for (var i = 0; i < this.ScoredSorted.length; i++) {
          var s = this.ScoredSorted[i];
          studentScores.push({
            name: s.name,
            x: this.width - this.right + (diff * s.totalScore) / this.TotalScore,
            y:
              this.top +
              this.diameter +
              Math.random() * (this.bottom - this.top - 2 * this.diameter)
          });
        }
        return studentScores;
      },
      trackMsg: function() {
        if (this.curStudent == "none") {
          return this.ScoredSorted.length + " " + this.$t("Race.track");
        } else {
          return this.curStudent;
        }
      }
    }
  };
  </script>
  <style>
  #racetrack {
    border: 1px solid hsl(198, 65%, 40%);
    border-radius: 10px;
    box-shadow: -10px 19px 15px silver;
    padding-left: 20px;
    padding-top: 10px;
  }
  circle:hover {
    fill: hsl(198, 65%, 40%);
  }
  </style>
  