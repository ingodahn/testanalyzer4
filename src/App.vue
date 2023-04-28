<template>
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      lineArray: null,
      Test: null,
      Mode: {
        questionScore: "compulsory",
        // multiLine is true iff at least one student name occurs in more than one line
        multiLine: false,
        // multiQuestion is true iff in at least one line at least one question occurs more than once
        multiQuestion: false,
        //mode.multiLineScore is false if each student has a single line. Otherwise it is one of 'maxQuestion', 'maxLine' or 'single'
        multiLineScore: false
      },
    }
  }
}
</script>
