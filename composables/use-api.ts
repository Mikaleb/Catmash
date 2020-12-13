// eslint-disable-next-line
import {
  reactive,
  toRefs,
  SetupContext,
  computed,
  ref,
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

  const results = ref({})

  const fetchResults = async () => {
    apiState.fetching = true
    const { data } = await axios.get(`/data/cats.json`, {})
    results.value = data.images
    apiState.fetching = false

    return results
  }

  return {
    ...toRefs(apiState),
    results,
    fetchResults,
  }
}
