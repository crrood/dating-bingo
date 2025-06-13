<template>
  <div class="grid justify-center mt-4">
    <div class="text-xl font-bold">
      Entity
    </div>
    {{ state.data }}
  </div>
</template>

<script setup lang="ts">
import type { Entity } from '@/Types';
import axios from 'axios';
import { onBeforeMount, reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// reactive state
interface State {
  editing: boolean;
  data: Entity | undefined;
}
const state: State = reactive({
  editing: false,
  data: undefined,
});

// initialize
onBeforeMount(() => {
  if (route.params.entity) {
    if (typeof route.params.entity !== 'string') {
      console.error('Entity parameter is not a string');
      return;
    }
    state.data = JSON.parse(route.params.entity) as Entity;
  }
  else {
    getEntity(route.params.id);
  }
})

// methods
function getEntity(id: string | string[]) {
  const path = '/api/entity/' + id;
  axios.get(path)
    .then((res: { data: Entity; }) => {
      state.data = res.data;
    })
    .catch((error: Error) => {
      console.error(error);
    })
}

</script>