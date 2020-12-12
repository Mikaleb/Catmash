<template>
  <div @click="vote(picture.id)">
    <v-hover v-slot="{ hover }">
      <v-card :elevation="hover ? 12 : 2" :class="{ 'cursor-pointer': hover }">
        <v-img max-height="500" max-width="500" contain :src="picture.url">
          <div class="align-self-center">
            <v-btn :class="{ 'show-btns': hover }" color="transparent" icon>
              <v-icon :class="{ 'show-btns': hover }" color="transparent">
                mdi-heart
              </v-icon>
            </v-btn>
          </div>
        </v-img>
      </v-card>
    </v-hover>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, watch, computed, reactive, onMounted } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'VoteCat',
  props: {
    picture: Object
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const propPicture = computed(() => props.picture)
    let appVotes: string | null = null


    const storageKey = 'votes'
    const appVotesRef = ref(appVotes ? JSON.parse(appVotes) : JSON.parse('[]'))

    if (process.browser) {
      watch(
        () => appVotesRef.value,
        to => {
          localStorage.setItem(storageKey, JSON.stringify(to))
        },
        { deep: true }
      )
    }

    const vote = (id: string) => {
      // checking our localStorage

      if (appVotesRef.value.length) {
        const addedVote = appVotesRef.value.find((v: any) => v.id === id).map((v: any) => {
          return { ...v, votes: v.votes + 1 }
        })

        // replacing in localStorage


        // sending event that a vote was done, reload the data

        console.log('🚀 ~ file: VoteCat.vue ~ line 51 ~ vote ~ appVotes', appVotes)
      }
      else {
        appVotesRef.value.push({
          id: id,
          url: propPicture.value?.url,
          votes: 1
        })
      }
    }

    onMounted(() => {
      if (process.browser) {
        if (!localStorage.getItem(storageKey)) {
          localStorage.setItem(storageKey, '[]')
        }
        appVotes = localStorage.getItem(storageKey)
      }
    })

    return {
      appVotesRef,
      vote,
      propPicture
    }
  }
})
</script>

<style scoped lang="scss">
.v-card {
  transition: opacity 0.2s ease-in-out;
}

.show-btns {
  @apply text-red-600 #{!important};
}
</style>
