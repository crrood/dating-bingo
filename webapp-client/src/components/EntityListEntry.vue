<template>
  <div
    class="flex place-items-center space-x-6 m-4 p-4" 
    @click="router.push({ 
      name: 'Entity',
      params: { id: props.entity._id?.$oid, entity: JSON.stringify(props.entity) }})"
  >
    <div class="text-white">
      <div class="text-bold">
        EntityListEntry:
      </div>
      {{ JSON.stringify(props.entity) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Entity } from '@/Types';
import { defineProps } from 'vue';
import router from '../router';

const props = defineProps<{
  entity: Entity,
}>();
</script>