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
      /*
      Mode: {
        questionScore: "compulsory",
        // multiLine is true iff at least one student name occurs in more than one line
        multiLine: false,
        // multiQuestion is true iff in at least one line at least one question occurs more than once
        multiQuestion: false,
        //mode.multiLineScore is false if each student has a single line. Otherwise it is one of 'maxQuestion', 'maxLine' or 'single'
        multiLineScore: false
      },
      */
    }
  },
  components: {
    // TheAppLayout,
  },
}
</script>
