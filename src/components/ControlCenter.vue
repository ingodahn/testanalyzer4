<template>
  <v-container v-if="Layout == 'print'">
    <h2>{{ $t("Control.h3") }}</h2>
    <p></p>
    <div v-html="modeText"></div>
  </v-container>
  <v-container id="controlCenter" v-else>
    <v-card class="ma-auto" raised elevation="0">
      <v-card-title>{{ $t("Control.vct1") }}</v-card-title>
      <v-card-subtitle>{{ $t("Control.vcst1") }}</v-card-subtitle>
      <v-card-text class="ma-auto">
        <v-radio-group v-model="Mode.questionScore" class="ma-auto">
          <v-radio
            value="compulsory"
            @click="typeSelected(['questionScore', 'compulsory'])"
          >
            <template v-slot:label>
              <div>
                {{ $t("Control.vc1") }}
              </div>
            </template>
          </v-radio>
          <v-radio
            value="voluntary"
            @click="typeSelected(['questionScore', 'voluntary'])"
          >
            <template v-slot:label>
              <div>
                {{ $t("Control.vc2") }}
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-text class="ma-auto" v-if="Mode.multiLine">
        <v-card-title>{{ $t("Control.vct3") }}</v-card-title>
        <v-card-subtitle>{{ $t("Control.vcst3") }}</v-card-subtitle>
        <v-radio-group v-model="Mode.multiLineScore" class="ma-auto">
          <v-radio
            value="maxQuestion"
            @click="typeSelected(['multiLineScore', 'maxQuestion'])"
            :label="$t('Control.r1')"
          >
          </v-radio>
          <v-radio
            value="maxLine"
            @click="typeSelected(['multiLineScore', 'maxLine'])"
            :label="$t('Control.r2')"
          >
          </v-radio>
          <v-radio
            value="avgLine"
            @click="typeSelected(['multiLineScore', 'avgLine'])"
            :label="$t('Control.r3')"
          ></v-radio>
          <v-radio
            value="single"
            @click="typeSelected(['multiLineScore', 'single'])"
            :label="$t('Control.r4')"
          ></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ControlCenter",
  data() {
    return {
      Mode: this.$root.$data.Test.Mode
    };
  },
  props: {
    Layout: {
      type: String,
      default: "all"
    }
  },
  methods: {
    typeSelected: function (typeval) {
      this.Mode[typeval[0]] = typeval[1];
    }
  },
  computed: {
    modeText: function () {
      let text = "<p>" + this.$t("Control.t1") + "<br/>";
      switch (this.Mode.questionScore) {
        case "voluntary": {
          text += this.$t("Control.t2");
          break;
        }
        default: {
          text += this.$t("Control.t3");
        }
      }
      if (this.Mode.multiLine) {
        text += "<br/>";
        switch (this.Mode.multiLineScore) {
          case "maxLine": {
            text += this.$t("Control.t4");
            break;
          }
          case "avgLine": {
            text += this.$t("Control.t5");
            break;
          }
          case "single": {
            text += this.$t("Control.t6");
            break;
          }
          default: {
            text += this.$t("Control.t7");
          }
        }
      }
      return text + "</p>";
    }
  }
};
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

.hvr-grow:not(:hover) {
  transform: scale(1);
}

.testButton {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 6px 12px;
  margin-right: 6px;
  cursor: pointer;
  background-color: hsl(198, 65%, 40%);
  color: white;
  border-radius: 10px;
}
</style>
