<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card
        :elevation="hover ? 12 : 2"
        :class="{ 'cursor-pointer': hover }"
        @click="$emit('voted', propPictures.id)"
      >
        <v-img max-height="500" max-width="500" contain :src="propPictures.url">
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
    const propPictures = computed(() => props.picture)

    return {
      propPictures
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
