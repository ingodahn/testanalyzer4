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
  <anonymizer v-if="LineArray && LineArray.length > 0"></anonymizer>
  <v-container>
    <v-row>
      <v-btn link color="green" :href="contact">{{ $t('Problem.msg8') }}</v-btn>
    </v-row>

  </v-container>
</template>

<script>
import ToolBar from '@/components/ToolBar.vue'
import Anonymizer from '@/components/imathas/Anonymizer.vue'

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
          layout: true,
          report: true
        },
      },
      Error: this.$root.$data.Error,
      LineArray: this.$root.$data.lineArray,
      contact: 'mailto://'+this.$root.$data.Config.contact,
    }
  },
  components: {
    ToolBar,
    Anonymizer
  },
  methods: {
  },
  computed: {

    system() {
      const test = this.$root.$data.Test;
      return (test) ? test.system : 'xxx';
    },
  }
}
</script>