<template>
  <v-app id="app">
    <!-- Add this line: you don't need to import TheAppLayout
       because it is already registered as explained earlier  -->
    <TheAppLayout />
  </v-app>
</template>

<script>
// import TheAppLayout from '@/layouts/TheAppLayout.vue'

export default {
  data() {
    return {
      lineArray: null,
      Test: null,
      Error: null,
      ScoredSorted: null,
      Config: {
        systems: [
          "imathas"
        ],
        contact: 'dahn@dahn-research.eu'
      }
    }
  },
  components: {
    // TheAppLayout,
  },
}
</script>
