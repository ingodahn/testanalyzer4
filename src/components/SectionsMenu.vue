<template>
  <v-menu activator="#drawer" open-on-hover close-on-content-click>
    <v-list>
      <v-list-item link v-if="Layout == 'all'" prepend-icon="mdi-database-export" href="#basics">
        <v-list-item-title>{{ $t("nav.basics") }}</v-list-item-title>
      </v-list-item>
      <v-list-item link v-if="Layout == 'all' ||
        ComponentStatus['scoreDistribution'] == 'warn_1'
        " :style="itemStyle('scoreDistribution')" prepend-icon="mdi-chart-bar" href="#scoreDistribution">
        <v-list-item-title>
          {{ $t("nav.scoreDistribution") }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link v-if="Layout == 'all' || ComponentStatus['more'] == 'warn_1'" :style="itemStyle('more')"
        prepend-icon="mdi-emoticon-happy-outline" href="#more">
        <v-list-item-title>
          {{ $t("nav.more") }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link v-if="Layout == 'all' || ComponentStatus['less'] == 'warn_1'" :style="itemStyle('less')"
        prepend-icon="mdi-emoticon-sad-outline" href="#less">
        <v-list-item-title>
          {{ $t("nav.less") }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link v-if="Layout == 'all' || ComponentStatus['attempts'] == 'warn_1'" :style="itemStyle('attempts')"
        prepend-icon="mdi-account-question-outline" href="#attempts">
        <v-list-item-title>
          {{ $t("nav.attempts") }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link v-if="Layout == 'all' || ComponentStatus['best'] == 'warn_1'" :style="itemStyle('best')"
        prepend-icon="mdi-flag-checkered" href="#best">
        <v-list-item-title>
          {{ $t("nav.best") }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link v-if="Layout == 'all'" :style="itemStyle('questionStatistics')" prepend-icon="mdi-chart-line"
        href="#questionStatistics">
        <v-list-item-title>
          {{ $t("nav.questionStatistics") }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link v-if="Layout == 'all' || ComponentStatus['discriminator'] == 'warn_1'"
        :style="itemStyle('discriminator')" prepend-icon="mdi-scale-balance" href="#discriminator">
        <v-list-item-title>
          {{ $t("nav.discriminator") }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "SectionsMenu",
  props: {
    Layout: {
      type: String,
      default: "all",
    },
    ComponentStatus: {
      type: Object,
      default: () => ({}),
    },
  },
  
  methods: {
    warnColor(component) {
      
      if (this.ComponentStatus[component] == "warn_1") {
        return "#cc8500"
      } else if (this.ComponentStatus[component] == "warn_2") {
        return "red";
      } else {
        return "black";
      }
    },
    itemStyle(component) {
      return "color: " + this.warnColor(component)+";";
    }
  },
};
</script>