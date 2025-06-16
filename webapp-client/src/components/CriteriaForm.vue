<template>
  <form
    class="max-w-2xl mx-auto p-6 space-y-6"
    @submit="$event.preventDefault()"
  >
    <div>
      <label
        for="center-square"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Center square
      </label>
      <input
        id="center-square"
        v-model="centerSquare"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
    </div>

    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Must haves
      </h3>
      <div class="space-y-3">
        <div
          v-for="i in 4"
          :key="`must-have-${i}`"
        >
          <label
            :for="`must-have-${i}`"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Must have {{ i }}
          </label>
          <input
            :id="`must-have-${i}`"
            v-model="mustHaves[i - 1]"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Nice to haves
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="i in 20"
          :key="`nice-to-have-${i}`"
        >
          <label
            :for="`nice-to-have-${i}`"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Nice to have {{ i }}
          </label>
          <input
            :id="`nice-to-have-${i}`"
            v-model="niceToHaves[i - 1]"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
      </div>
    </div>
    <div class="text-center">
      <button
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="submitCriteria"
      >
        Submit
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue';

// Props
const props = defineProps<{
  criteriaArray: string[]
}>()

// Emit events for prop updates
const emit = defineEmits<{
  'update:criteriaArray': [value: string[]]
}>()

// Local reactive data
const centerSquare = ref('')
const mustHaves = ref<string[]>(Array(4).fill(''))
const niceToHaves = ref<string[]>(Array(20).fill(''))

// Initialize local data from prop
const initializeFromProp = () => {
  const criteria = [...props.criteriaArray]
  centerSquare.value = criteria[0] || ''
  
  // Must haves (indices 1-4)
  for (let i = 0; i < 4; i++) {
    mustHaves.value[i] = criteria[i + 1] || ''
  }
  
  // Nice to haves (indices 5-24)
  for (let i = 0; i < 20; i++) {
    niceToHaves.value[i] = criteria[i + 5] || ''
  }
}

// Initialize on mount
initializeFromProp()

// Watch prop changes and update local data
watch(() => props.criteriaArray, () => {
  initializeFromProp()
}, { deep: true })

// Watch local data changes and emit updates
const updateCriteriaArray = () => {
  const criteriaArray = [
    centerSquare.value,
    ...mustHaves.value,
    ...niceToHaves.value
  ]
  emit('update:criteriaArray', criteriaArray)
}

watch(centerSquare, updateCriteriaArray)
watch(mustHaves, updateCriteriaArray, { deep: true })
watch(niceToHaves, updateCriteriaArray, { deep: true })

const submitCriteria = async () => {
  const criteriaArray = [
    centerSquare.value,
    ...mustHaves.value,
    ...niceToHaves.value
  ].filter(item => item.trim() !== '')

  try {
    await axios.put('/api/criteriaArray', { criteria: criteriaArray })
  } catch (error) {
    console.error('Error submitting criteria:', error)
  }
}
</script>
