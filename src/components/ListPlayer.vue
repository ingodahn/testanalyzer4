<template>
  <v-container>
    <span v-if="playerType == 'selector'">
      <span v-if="ListData.length == 1">{{ ListData[0] }}</span>
      <span v-else>
        <v-select :items="ListData" :value="ListData[0]" solo dense></v-select>
      </span>
    </span>

    <v-card v-if="playerType == 'player'" class="chart-containerx" elevation="20">
      <v-card-actions class="justify-center">
        <span v-if="curItem < ListData.length">
          <v-btn icon color="primary" v-on:click="curItem = 0" :disabled="curItem == 0"
            v-if="ListData.length > 2"><v-icon>mdi-skip-backward</v-icon>
          </v-btn>
          <v-btn icon color="primary" v-on:click="curItem--" :disabled="curItem == 0"
            v-if="ListData.length > 1"><v-icon>mdi-step-backward</v-icon>
          </v-btn>
          {{ listItem }}
          <v-btn icon color="primary" v-if="ListData.length > 1" v-on:click="curItem++"
            :disabled="curItem == ListData.length - 1"><v-icon>mdi-step-forward</v-icon>
          </v-btn>
          <v-btn icon color="primary" v-on:click="curItem = ListData.length - 1"
            :disabled="curItem == ListData.length - 1" v-if="ListData.length > 1"><v-icon>mdi-skip-forward</v-icon>
          </v-btn>
        </span>
      </v-card-actions>
    </v-card>
    <span v-if="playerType == 'showAll'">
      ({{ listItemsString(ListData) }})
    </span>
  </v-container>
</template>

<script>
export default {
  props: {
    ListData: {
      type: Array
    },
    Layout: {
      type: String,
      default: "all"
    }
  },
  data() {
    return {
      curItem: 0
    };
  },
  methods: {
    listItemsString: function (list) {
      var str = "";
      for (var i = 0; i < list.length; i++) {
        str += list[i];
        if (i < list.length - 1) {
          str += "; ";
        }
      }
      return str;
    }
  },
  computed: {
    listItem: function () {
      return this.ListData[this.curItem];
    },
    playerType: function () {
      return (this.Layout == "print") ? "showAll" : "selector";
    }
  }
};
</script>
