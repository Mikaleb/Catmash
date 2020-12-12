<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card :elevation="hover ? 12 : 2" :class="{ 'on-hover': hover }">
        <v-img max-height="500" max-width="500" contain :src="picture">
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
import { defineComponent, ref, watch, reactive } from '@nuxtjs/composition-api'
export default defineComponent({
  name: 'VoteCat',
  props: {
    picture: String
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const storageKey = 'votes'
    let localVotes = localStorage.getItem(storageKey)
    const votesRef = ref(localVotes ? JSON.parse(localVotes) : undefined)

    watch(
      () => votesRef.value,
      to => {
        localStorage.setItem(storageKey, JSON.stringify(to))
      },
      { deep: true }
    )



    return {
      votesRef
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
