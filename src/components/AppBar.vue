<template>
  <v-app-bar app color="primary" dense>
    <v-toolbar-title class="text-h4 d-flex justify-center">
      <span class="apptitle">{{ system1 }} {{ $t("Test.title") }}</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <LanguageSwitcher></LanguageSwitcher>
  </v-app-bar>
</template>

<script>
import LanguageSwitcher from "@/components/LanguageSwitcher.vue"

export default {
  components: {LanguageSwitcher },
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
  },
  methods: {
  }
}
</script>

<style scoped>
.apptitle {
  color: white;
}
v-toolbar-title__content {
  display: flex;
}
.fixing {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>