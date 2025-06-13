<template>
  <div class="grid justify-center mt-4">
    <div class="text-xl font-bold">
      ResourceDetail
    </div>
    {{ state.data }}
  </div>
</template>

<script setup lang="ts">
import type { ResourceA } from '@/Types';
import axios from 'axios';
import { onBeforeMount, reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// reactive state
interface State {
  editing: boolean;
  data: ResourceA | undefined;
}
const state: State = reactive({
  editing: false,
  data: undefined,
});

// initialize
onBeforeMount(() => {
  if (route.params.resource) {
    if (typeof route.params.resource !== 'string') {
      console.error('Resource parameter is not a string');
      return;
    }
    state.data = JSON.parse(route.params.resource) as ResourceA;
  }
  else {
    getResource(route.params.id);
  }
})

// methods
function getResource(id: string | string[]) {
  const path = '/api/resourceA/' + id;
  axios.get(path)
    .then((res: { data: ResourceA; }) => {
      state.data = res.data;
    })
    .catch((error: Error) => {
      console.error(error);
    })
}

</script>