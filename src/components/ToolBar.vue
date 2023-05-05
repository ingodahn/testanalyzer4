<template>
  <v-toolbar app dense>
    <v-app-bar-nav-icon :disabled="disabled['drawer']" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-btn icon :disabled="disabled['file']" :title="$t('Toolbar.file')" :to="systemPath">
      <v-icon icon="mdi-file-import" />
    </v-btn>
    <v-btn icon :disabled="disabled['settings']" :title="$t('Toolbar.settings')" :to="systemPath+'/settings'">
      <v-icon icon="mdi-cog" />
    </v-btn>
    <v-btn icon :disabled="disabled['analysis']" :title="$t('Toolbar.analysis')" :to="systemPath+'/analysis'">
      <v-icon icon="mdi-file-chart" />
    </v-btn>
    <v-btn icon :disabled="disabled['hints']" :title="$t('Toolbar.hints')">
      <v-icon icon="mdi-exclamation-thick" color="warning" />
    </v-btn>
    <v-btn icon :disabled="disabled['print']" :title="$t('Toolbar.print')">
      <v-icon icon="mdi-printer" />
    </v-btn>
    <v-btn icon :disabled="disabled['report']" :title="$t('Toolbar.report')">
      <v-icon icon="mdi-file-document-alert" />
    </v-btn>
  </v-toolbar>
</template>

<script>

export default {
  components: {},
  props: {
    disabled: {
      type: Object,
      default: {
        drawer: true,
        file: true,
        settings: true,
        analysis: true,
        hints: true,
        print: true,
        report: true}
    }
  },
  data() {
    return {
      drawer: false,
    }
  },
  computed: {
    system() {
      const test = this.$root.$data.Test;
      return (test) ? test.system : '';
    },
    systemPath() {
      return '/'+this.$route.params.system;
    },
    system1() {
      const system = this.$route.params.system
      switch (system) {
        case "imathas":
          return "IMathAS"
        case "ilias":
          return "ILIAS"
        case "olat":
          return "OpenOLAT"
        default:
          return ""
      }
    }
  }
}
</script>
