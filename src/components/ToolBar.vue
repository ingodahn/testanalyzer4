<template>
  <v-toolbar app dense elevate-on-scroll>
    <v-app-bar-nav-icon  disabled @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-btn icon disabled>
      <v-icon icon="mdi-file-import"/>
    </v-btn>
    <v-btn icon disabled>
    <v-icon icon="mdi-cog"/>
  </v-btn>
  <v-btn icon disabled>
    <v-icon disabled icon="mdi-file-chart"/>
  </v-btn>
  <v-btn icon disabled>
    <v-icon disabled icon="mdi-exclamation-thick" color="warning"/>
    </v-btn>
    <v-btn icon disabled>
    <v-icon icon="mdi-printer"/>
    </v-btn>
    <v-btn icon disabled>
    <v-icon icon="mdi-file-document-alert"/>
    </v-btn>
  </v-toolbar>
</template>

<script>

export default {
  components: { },
  computed: {
    system() {
      const test=this.$root.$data.Test;
      return (test)?test.system:'';
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
