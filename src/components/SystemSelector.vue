<template>
  <div class="select">
    <h2>{{ $t("Selector.h2") }}</h2>
    <p v-html="$t('Selector.p1')"></p>

    <nav>
        <v-btn class="hvr-grow"
           color="primary"
           large @click="gotoSettings('imathas')" >
          IMathAS
        </v-btn>
        <v-btn class="hvr-grow"
           color="primary"
           large @click="gotoSettings('ilias')" >
          ILIAS
        </v-btn>
    </nav>
  </div>
</template>
<script>
export default {
  methods: {
    gotoSettings(system) {
            this.$router.push(
                { name: 'System', params: { system: system } }
            )
        }
  }
}
</script>
<style scoped>
body {
  background-color: #eeeeee;
  font-family: "Montserrat", sans-serif;
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
  padding-top: 50px;
}

/* Grow */
.hvr-grow {
  display: inline-block;
  vertical-align: middle;
  transform: translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  backface-visibility: hidden;
  -moz-osx-font-smoothing: grayscale;
  transition-duration: 0.3s;
  transition-property: transform;
  margin: 10px;
}

.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
  transform: scale(1.1);
}

nav {
  padding: 20px 20px 20px 0;
}

nav a {
  padding: 10px;
  text-decoration: none;
  background: hsl(198, 65%, 40%);
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  margin-right: 15px;
}
</style>
