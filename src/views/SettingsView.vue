<template>
    <tool-bar :disabled="toolbarOptions.disabled"></tool-bar>
    <v-container>
        <h2>{{ $t("Settings.h2") }}</h2>
        <p>
            {{
                $t("Settings.p1")
            }}
        
        <nav>
            <v-btn class="hvr-grow" color="primary" large @click="gotoAnalysis()">{{ $t("Settings.continue" )}}</v-btn>
        </nav>
        </p>
        <adapt v-if="adaptable" />
        <control-center v-if="layout != 'hints'" id="controlCenter" :Layout="layout"></control-center>
    </v-container>
</template>

<script>
import ToolBar from '@/components/ToolBar.vue'
import Adapt from '@/components/imathas/Adapt.vue'
import ControlCenter from '@/components/ControlCenter.vue'
export default {
    name: 'SettingsView',
    data() {
        return {
            Test: this.$root.$data.Test,
            Mode: this.$root.$data.Test.Mode,
            layout: 'all',
            toolbarOptions: {
                disabled: {
                    drawer: true,
                    file: false,
                    settings: true,
                    analysis: false,
                    layout: true,
                    report: false
                }
            }
        }
    },
    components: {
        ToolBar,
        Adapt,
        ControlCenter
    },
    methods: {
        adaptable() {
            return Object.keys(this.Test.adaptOptions).length
        },
        setMode: function (typeval) {
            this.Mode[typeval[0]] = typeval[1];
        },
        gotoAnalysis() {
            this.$router.push({ name: 'Analysis' })
        }
    },
}
</script>

<style>
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

nav {
  padding: 20px 20px 20px 0;
}

nav a {
  padding: 10px;
  text-decoration: none;
  background: hsl(198, 65%, 40%);
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  margin-right: 15px;
}
</style>