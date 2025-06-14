<template>
  <div
    class="flex place-items-center space-x-6 m-4 p-4" 
    @click="router.push({ 
      name: 'ResourceDetail',
      params: { id: props.resource._id?.$oid, resource: JSON.stringify(props.resource) }})"
  >
    <div class="text-white">
      <div class="text-bold">
        ResourceListEntry:
      </div>
      {{ JSON.stringify(props.resource) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ResourceA } from '@/Types';
import { defineProps } from 'vue';
import router from '../router';

const props = defineProps<{
  resource: ResourceA,
}>();
</script>