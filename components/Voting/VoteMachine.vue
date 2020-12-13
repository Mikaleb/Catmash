<template>
  <v-row justify="center" align="center" v-if="propApiData">
    <v-col cols="6" v-for="(choice, i) in data" :key="i">
      <vote-cat :key="i" :picture="choice" v-if="!fetching" @voted="voting" />
      <template v-else>
        <div class="flex items-center justify-center p-8">
          <div id="loading"></div>
        </div>
      </template>
    </v-col>
  </v-row>
</template>


<script lang="ts">
import { defineComponent, toRefs, ref, onMounted, reactive, computed, watch } from '@nuxtjs/composition-api'
import useApi from '@/composables/use-api'
import VoteCat from '@/components/Voting/VoteCat.vue'
import VoteMachine from '@/components/Voting/VoteMachine.vue'
import Vue from 'vue/types/umd'

export default defineComponent({
  components: { VoteCat },
  name: 'VoteMachine',
  props: {
    pictures: Array,
    apiData: Array
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const {
      fetching,
      fetchResults
    } = useApi()

    interface apiData {
      id: string,
      url: string
    }

    const propPictures = computed(() => props.pictures)
    const propApiData = computed(() => props.apiData)
    let appVotes: any = ref([])

    const localState = reactive({
      data: [
        { id: '', url: 'http://placekitten.com/200/300' },
        { id: '', url: 'http://placekitten.com/200/300' }
      ],
    })

    const storageKey = 'votes'
    if (process.browser) {
      watch(
        () => appVotes.value,
        to => {
          localStorage.setItem(storageKey, JSON.stringify(to))
        },
        { deep: true }
      )
    }

    const pickIdCategory = () => {
      const randomNb: number = Math.floor(Math.random() * (99 - 0 + 1) + 0)
      const apiResults: any = propApiData.value

      return apiResults[randomNb]
    }


    const addCat = (data: any, choice: apiData) => {
      data.push({
        id: choice?.id,
        url: choice?.url,
        votes: 1
      })
      appVotes.value = data
    }


    const voting = (id: string) => {

      let apiCat: apiData = {
        id: '', url: ''
      }

      if (propApiData.value?.length) {
        //@ts-ignore
        apiCat = propApiData.value.find((vote: apiData) => vote.id === id)
      }

      // checking our localStorage
      if (appVotes.value.length) {
        if (!appVotes.value.find((vote: apiData) => vote.id === id)) {
          addCat(appVotes.value, apiCat)
        }
        else {
          const addedVote = appVotes.value.map((vote: any) => {
            if (vote.id == id) {
              vote.votes = vote.votes + 1
            }
            return vote
          })
          appVotes.value = addedVote
        }
      }
      else {
        addCat(appVotes.value, apiCat)
      }

      // reload data
      localState.data.splice(0, 1, pickIdCategory())
      localState.data.splice(1, 1, pickIdCategory())
    }

    onMounted(async () => {
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, '[]')
      }
      //@ts-ignore
      localState.data = propPictures.value
      //@ts-ignore
      appVotes.value = JSON.parse(localStorage.getItem(storageKey))
    })

    return {
      ...toRefs(localState),
      fetching,
      voting,
      propApiData,
      appVotes,
    }
  }
})
</script>
