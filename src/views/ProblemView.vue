<template>
  <tool-bar :disabled="toolbarOptions.disabled"></tool-bar>
  <v-container>
    <h2>{{ $t('Problem.msg6') }}</h2>
  </v-container>
  <v-container v-if="Error">
    <v-card>
      <v-card-text>
        <pre>{{ Error.message }}</pre>
        <p>{{ $t('Problem.msg2', [system]) }}</p>
      </v-card-text>
    </v-card>
  </v-container>
  <v-container>
    <v-row>
      <p>{{ $t('Problem.msg10') }}</p>
    </v-row>
  </v-container>
  <imathas-anonymizer v-if="system == 'IMathAS' && LineArray && LineArray.length > 0"></imathas-anonymizer>
  <ilias-anonymizer v-if="system == 'ILIAS' && LineArray && LineArray.length > 0"></ilias-anonymizer>
  <olat-anonymizer v-if="system == 'Open OLAT' && LineArray && LineArray.length > 0"></olat-anonymizer>
  <opal-anonymizer v-if="system == 'Open OPAL' && LineArray && LineArray.length > 0"></opal-anonymizer>
  
  <v-container>
    <v-row>
      <v-btn link color="green" :href="contact">{{ $t('Problem.msg8') }}</v-btn>
    </v-row>

  </v-container>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import ToolBar from '@/components/ToolBar.vue'
const ImathasAnonymizer = defineAsyncComponent(
  () => import("@/components/imathas/Anonymizer.vue")
)
const IliasAnonymizer = defineAsyncComponent(
  () => import("@/components/ilias/Anonymizer.vue")
)

const OlatAnonymizer = defineAsyncComponent(
  () => import("@/components/olat/Anonymizer.vue")
)

const OpalAnonymizer = defineAsyncComponent(
  () => import("@/components/opal/Anonymizer.vue")
)

export default {
  name: 'ProblemView',
  data() {
    return {
      toolbarOptions: {
        disabled: {
          drawer: true,
          file: false,
          settings: true,
          analysis: true,
          allLayout: true,
          hintsLayout: true,
          printLayout: true,
          grouping: true,
          report: true
        },
      },
      Error: this.$root.$data.Error,
      LineArray: this.$root.$data.lineArray,
      contact: 'mailto://' + this.$root.$data.Config.contact,
    }
  },
  components: {
    ToolBar,
    ImathasAnonymizer,
    IliasAnonymizer,
    OlatAnonymizer,
    OpalAnonymizer
  },
  methods: {
  },
  computed: {

    system() {
      const test = this.$root.$data.Test;
      console.log("system", test.system)
      return (test) ? test.system : 'xxx';
    },
  }
}
</script>