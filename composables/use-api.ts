// eslint-disable-next-line
import {
  reactive,
  toRefs,
  SetupContext,
  computed,
} from '@nuxtjs/composition-api'
import axios from 'axios'

interface Options {
  ctx: SetupContext
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useApi() {
  // Setting up the endpoint
  const apiState = reactive({
    response: [],
    error: null,
    fetching: false,
  })

  const globalState = reactive({
    results: {},
  })

  const fetchResults = async (id: string) => {
    apiState.fetching = true
    const { data } = await axios.get(`/data/cats.json`, {
      params: {
        id: id,
      },
    })
    globalState.results = data.images
    apiState.fetching = false

    return globalState.results
  }

  return {
    ...toRefs(apiState),
    ...toRefs(globalState),
    results: computed(() => globalState.results),
    fetchResults,
  }
}
