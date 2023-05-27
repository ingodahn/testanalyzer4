<template>
  <v-toolbar app dense>
    <v-app-bar-nav-icon id="drawer" :disabled="disabled['drawer']" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-btn icon :disabled="disabled['file']" :title="$t('Toolbar.file')" :to="systemPath">
      <v-icon icon="mdi-file-import" />
    </v-btn>
    <v-btn icon :disabled="disabled['settings']" :title="$t('Toolbar.settings')" :to="systemPath + '/settings'">
      <v-icon icon="mdi-cog" />
    </v-btn>
    <v-btn icon :disabled="disabled['analysis']" :title="$t('Toolbar.analysis')" :to="systemPath + '/analysis'">
      <v-icon icon="mdi-file-chart" />
    </v-btn>
    <v-btn icon :disabled="disabled['layout']" :title="layoutTitle" @click="toggleLayout">
      <v-icon :icon="layoutIcon" :color="layoutColor" />
    </v-btn>
    <v-btn icon :disabled="disabled['grouping']" :title="groupingTitle" :to="systemPath + '/grouping'">
      <v-icon icon="mdi-account-multiple" />
    </v-btn>
    <v-btn icon :disabled="disabled['report']" :to="systemPath + '/problem'" :title="$t('Toolbar.report')">
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
        layout: true,
        grouping: true,
        report: true
      }
    }
  },
  emits: ['toggleLayout'],
  data() {
    return {
      drawer: false,
      layout: 'all',
      hints: true
    }
  },
  methods: {
    toggleLayout() {
      switch (this.layout) {
        case 'all':
          this.layout = 'hints'
          break;
        case 'hints':
          this.layout = 'print'
          break;
        case 'print':
          this.layout = 'all'
          break;
        default:
          this.layout = 'all'
          break;
      }
      this.$emit('toggleLayout', this.layout)
    },
  },
  computed: {
    system() {
      const test = this.$root.$data.Test;
      return (test) ? test.system : '';
    },
    systemPath() {
      return '/' + this.$route.params.system;
    },
    layoutTitle() {
      switch (this.layout) {
        case 'all':
          return this.$t('Toolbar.hints');
        case 'hints':
          return this.$t('Toolbar.print');
        case 'print':
          return this.$t('Toolbar.all');
        default:
          return this.$t('Toolbar.hints');
      }
    },
    layoutIcon() {
      switch (this.layout) {
        case 'all':
          return 'mdi-tooltip-text';
        case 'hints':
          return 'mdi-printer';
        case 'print':
          return 'mdi-tooltip-text-outline';
        default:
          return 'mdi-tooltip-text';
      }
    },
    layoutColor() {
      switch (this.layout) {
        case 'all':
          return 'warning';
        case 'hints':
          return 'black';
        case 'print':
          return 'black';
        default:
          return 'warning';
      }
    },
    groupingTitle () {
      return this.$t('Toolbar.grouping');
    },
  }
}
</script>
