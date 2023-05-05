<template>
  <v-responsive>
    <v-container fluid tag="section" aria-labelledby="title">
      <v-row>
        <v-col cols="10" offset="1">
          <div id="context" v-if="showContext">
            <context />
            <!--
            <v-speed-dial v-model="fab" bottom right>
              <template v-slot:activator>
                <v-btn v-model="fab" color="blue darken-2" dark fab>
                  <v-icon v-if="fab">
                    mdi-close
                  </v-icon>
                  <v-icon v-else>
                    mdi-account-circle
                  </v-icon>
                </v-btn>
              </template>
              <v-btn fab dark small color="green">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn fab dark small color="indigo">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn fab dark small color="red">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-speed-dial>
          -->
            <system-selector />
          </div>
        </v-col>
      </v-row>

    </v-container>
  </v-responsive>
</template>

<script>
import Context from '@/components/Context.vue'
import SystemSelector from '@/components/SystemSelector.vue'
export default {
  data: () => ({
    showContext: true,
    fab: true
  }),
  components: {
    Context,
    SystemSelector,
  },
}
</script>

<style>
p {
  margin-bottom: 16px;
}
</style>