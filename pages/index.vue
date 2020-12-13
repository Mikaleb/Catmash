<template>
  <div class="flex items-center justify-center p-8">
    <vote-machine
      v-if="apiResults"
      :pictures="pictures"
      :apiData="apiResults"
    />
    <template v-else>
      <div class="flex items-center justify-center p-8">
        <div id="loading"></div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, onMounted, reactive, ref } from '@nuxtjs/composition-api'
import useApi from '@/composables/use-api'
import VoteMachine from '@/components/Voting/VoteMachine.vue'

export default defineComponent({
  components: { VoteMachine },
  name: 'Index',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const {
      results,
      fetching,
      fetchResults
    } = useApi()

    const localState = reactive({
      apiResults: [],
      pictures: [
        { id: '', url: 'http://placekitten.com/200/300' },
        { id: '', url: 'http://placekitten.com/200/300' }
      ],
    })

    const pickIdCategory = (arrayData: any) => {
      const randomNb: number = Math.floor(Math.random() * (99 - 0 + 1) + 0)
      return arrayData[randomNb]
    }

    onMounted(async () => {
      await fetchResults().then((data) => {
        console.log(data)
        //@ts-ignore
        localState.apiResults = data.value
        localState.pictures[0] = pickIdCategory(data.value)
        localState.pictures[1] = pickIdCategory(data.value)

        if (localState.pictures[0].id === localState.pictures[1].id) {
          // Rare case where random is the same data
          localState.pictures[1] = pickIdCategory(data.value)
        }
        // ! TEST ONLY
        /* localState.secondPicture = {
          id: "37p",
          url: "http://24.media.tumblr.com/tumblr_lw9hu39q621qdvbl3o1_1280.jpg"
        }
        if (localState.firstPicture.id === localState.secondPicture.id) {
          localState.firstPicture = pickIdCategory()
        } */
      })


    })
    return {
      ...toRefs(localState),
      fetching,
      results,
      pickIdCategory,
    }
  }
})
</script>


