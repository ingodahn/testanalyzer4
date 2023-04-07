<template>
  <v-app-bar app color="primary" absolute>

    <v-icon icon="mdi-circle-slice-4" />
    <v-app-bar-title class="white--text">
      <span class="apptitle">{{ system }} {{ $t("Test.title") }}</span>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <LanguageSwitcher></LanguageSwitcher>
  </v-app-bar>
</template>

<script>
import LanguageSwitcher from "@/components/LanguageSwitcher.vue"
export default {
  components: { LanguageSwitcher },
  computed: {
    system() {
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

<style scoped>
.apptitle {
  color: white;
}
</style>