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
    <v-btn icon :disabled="disabled['allLayout']" :title="layoutTitle('all')" @click="toggleLayout('all')">
      <v-icon icon="mdi-tooltip-text" />
    </v-btn>
    <v-btn icon :disabled="disabled['hintsLayout']" :title="layoutTitle('hints')" @click="toggleLayout('hints')">
      <v-icon icon="mdi-alert" />
    </v-btn>
    <v-btn icon :disabled="disabled['printLayout']" :title="layoutTitle('print')" @click="toggleLayout('print')">
      <v-icon icon="mdi-printer" />
    </v-btn>
    <!--
    <v-btn icon :disabled="disabled['layout']" :title="layoutTitle" @click="toggleLayout">
      <v-icon :icon="layoutIcon" :color="layoutColor" />
    </v-btn>
  -->
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
        allLayout: true,
        hintsLayout: true,
        printLayout: true,
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
    layoutTitle(layout) {
      return this.$t('Toolbar.' + layout);
    },
    toggleLayout(L) {
      this.layout = L;
      this.$emit('toggleLayout', L)
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
    groupingTitle() {
      return this.$t('Toolbar.grouping');
    },
  }
}
</script>
