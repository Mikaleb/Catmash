<template>
  <div>
    <v-container>
      <v-row>
        <v-col
          cols="4"
          v-for="(champion, i) in champions.slice(0, 3)"
          :key="i"
          :class="i === 1 ? 'order-0' : ''"
          :order="i === 0 ? 1 : i === 1 ? 0 : i === 2 ? 2 : 0"
        >
          <v-card>
            <v-img max-height="250" :src="champion.url"> </v-img>
            <v-card-text> Numéro {{ i + 1 }} </v-card-text>
            <v-card-text> {{ champion.votes }} votes </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="m-4">
      <v-data-table
        :headers="headers"
        :items="champions.slice(3)"
        :items-per-page="25"
        :loading="!champions"
        class="elevation-1"
      >
        <template v-slot:item.url="{ item }">
          <v-img :src="item.url" max-width="250" contain> </v-img>
        </template>
      </v-data-table>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, toRefs, ref, onMounted, reactive, computed, watch } from '@nuxtjs/composition-api'
import useApi from '@/composables/use-api'
import Vue from 'vue/types/umd'

export default defineComponent({
  name: 'Leaderboard',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const {
      results,
      fetching,
      fetchResults
    } = useApi()

    const headers = [
      { text: 'Image', value: 'url' },
      { text: 'Votes', value: 'votes' }
    ]

    const localState = reactive({
      apiResults: [],
      champions: [
        { id: '', url: 'http://placekitten.com/200/300' },
        { id: '', url: 'http://placekitten.com/200/300' },
        { id: '', url: 'http://placekitten.com/200/300' }
      ],
    })

    interface apiData {
      id: string,
      url: string
    }

    let appVotes: any = ref([])

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

    const setLeaderBoard = () => {
      const compare = (a: { votes: number }, b: { votes: number }) => {
        let comparison = 0
        if (a.votes > b.votes) {
          comparison = 1
        } else if (a.votes < b.votes) {
          comparison = -1
        }

        return comparison
      }

      // apply voted to api data
      localState.apiResults.map((result: any) => {
        const votedCat = appVotes.value.find((vote: apiData) => vote.id === result.id)
        result.votes = 0

        if (votedCat) {
          result.votes = votedCat.votes
        }
        return result
      })

      localState.champions = localState.apiResults.sort(compare).reverse()

    }

    onMounted(async () => {
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, '[]')
      }
      //@ts-ignore
      appVotes.value = JSON.parse(localStorage.getItem(storageKey))

      await fetchResults().then((data) => {
        console.log(data)
        //@ts-ignore
        localState.apiResults = data.value
        setLeaderBoard()
      })
    })

    return {
      ...toRefs(localState),
      headers
    }
  }
})
</script>

<style scoped lang="scss">
.order-0 {
  @apply mt-8;
}
.order-2 {
  @apply mt-16;
}
</style>
