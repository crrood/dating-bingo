<template>
  <div class="bg-primary">
    <ResourceListEntry
      v-for="resource in state.resources"
      :key="resource._id?.$oid"
      :resource="resource"
    />
  </div>
  <!-- Previous / next page buttons -->
  <!-- Icons from https://www.flaticon.com/uicons/get-started -->
  <!-- Need to be attributed if I end up releasing this -->
  <div class="flex grow justify-center gap-10">
    <button @click="state.pageNumber = 0">
      <svg
        class="w-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      ><path d="M24,11H4.324l4.3-4.3L7.213,5.282l-4.95,4.95A2.578,2.578,0,0,0,2,10.553V5H0V19H2V13.447a2.578,2.578,0,0,0,.263.321l4.95,4.95L8.627,17.3,4.324,13H24Z" /></svg>
    </button>
    <button @click="state.pageNumber = state.pageNumber - 1">
      <svg
        class="w-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      ><g
        id="_01_align_center"
        data-name="01 align center"
      ><path d="M24,13l0-2-21.445.031L6.877,6.707,5.463,5.293.877,9.879a3,3,0,0,0,0,4.242l4.586,4.586,1.414-1.414L2.615,13.031Z" /></g></svg>
    </button>
    <button @click="state.pageNumber = state.pageNumber + 1">
      <svg
        class="w-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      ><g
        id="_01_align_center"
        data-name="01 align center"
      ><path d="M23.124,9.879,18.538,5.293,17.124,6.707l4.262,4.263L0,11l0,2,21.446-.03-4.323,4.323,1.414,1.414,4.587-4.586A3.007,3.007,0,0,0,23.124,9.879Z" /></g></svg>
    </button>
    <button @click="state.pageNumber = 0">
      <svg
        class="w-10"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      ><path d="M22,10.553a2.578,2.578,0,0,0-.263-.321l-4.95-4.95L15.373,6.7l4.3,4.3H0v2H19.676l-4.3,4.3,1.414,1.414,4.95-4.95A2.578,2.578,0,0,0,22,13.447V19h2V5H22Z" /></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ResourceA } from '@/Types';
import axios from 'axios';
import { reactive, watch } from 'vue';
import ResourceListEntry from './ResourceListEntry.vue';

interface State {
  resources: Array<ResourceA>;
  pageNumber: number;
}
const state: State = reactive({
  resources: [],
  pageNumber: 0
})

watch(() => state.pageNumber, () => {
  getResourceList(state.pageNumber);
});

function getResourceList(pageNumber: number) {
  if (pageNumber < 0) {
    pageNumber = 0;
  }
  const path = '/api/resourceA?page=' + pageNumber
  axios.get(path)
    .then(res => {
      state.resources = res.data;
    })
    .catch(error => {
      console.error(error);
    })
}

getResourceList(state.pageNumber);

</script>