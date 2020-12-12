<template>
  <div class="flex items-center justify-center p-8">
    <v-row justify="center" align="center" v-if="results">
      <v-col cols="6">
        <vote-cat :picture="firstPicture" v-if="!fetching" />
        <template v-else>
          <div class="flex items-center justify-center p-8">
            <div id="loading"></div>
          </div>
        </template>
      </v-col>
      <v-col cols="6">
        <!-- <vote-cat :picture="secondPicture" /> -->
        <vote-cat :picture="secondPicture" v-if="!fetching" />
        <template v-else>
          <div class="flex items-center justify-center p-8">
            <div id="loading"></div>
          </div>
        </template>
      </v-col>

      <!-- reload -->
    </v-row>
    <template v-else>
      <div class="flex items-center justify-center p-8">
        <div id="loading"></div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, reactive } from '@nuxtjs/composition-api'
import useApi from '@/composables/use-api'
import VoteCat from '@/components/VoteCat.vue'

export default defineComponent({
  components: { VoteCat },
  name: 'Index',
  component: { VoteCat },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const {
      results,
      fetching,
      fetchResults
    } = useApi()

    const localState = reactive({
      results: {},
      firstPicture: { id: '', url: 'http://placekitten.com/200/300' },
      secondPicture: { id: '', url: 'http://placekitten.com/200/300' },
    })


    const pickIdCategory = () => {
      const randomNb: number = Math.floor(Math.random() * (99 - 0 + 1) + 0)
      const apiResults: any = results.value
      return apiResults[randomNb]
    }

    onMounted(async () => {
      await fetchResults('').then(() => {
        localState.results = results.value
        localState.firstPicture = pickIdCategory()
        // localState.secondPicture = pickIdCategory()
        localState.secondPicture = {
          id: "37p",
          url: "http://24.media.tumblr.com/tumblr_lw9hu39q621qdvbl3o1_1280.jpg"
        }

        if (localState.firstPicture.id === localState.secondPicture.id) {
          localState.firstPicture = pickIdCategory()
        }
      })


    })
    return {
      ...toRefs(localState),
      fetching,
      results,
      pickIdCategory
    }
  }
})
</script>

<style lang="scss">
#loading {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>




