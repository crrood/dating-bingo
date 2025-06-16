<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Dropdown for selecting bingo card -->
    <div class="mb-6">
      <label
        for="bingo-card-select"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Bingo Card:
      </label>
      <select
        id="bingo-card-select"
        v-model="selectedCardIndex"
        class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option
          v-for="(bingoCard, index) in bingoCardResourceList"
          :key="bingoCard._id?.$oid || index"
          :value="index"
        >
          {{ bingoCard.prospectName || `Card ${index + 1}` }}
        </option>
      </select>
    </div>

    <!-- Bingo Card Grid -->
    <div
      v-if="activeBingoCard"
      class="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">
        {{ activeBingoCard.prospectName }}
      </h2>
      
      <div class="grid grid-cols-5 gap-2 max-w-lg mx-auto">
        <div
          v-for="(row, rowIndex) in activeBingoCard.tileMatrix"
          :key="`row-${rowIndex}`"
        >
          <div
            v-for="(square, colIndex) in row"
            :key="`square-${rowIndex}-${colIndex}`"
            class="aspect-square border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-blue-400 p-2"
            :class="{
              'bg-blue-500 text-white border-blue-600': square.checked,
              'bg-white text-gray-800': !square.checked,
              'bg-yellow-200 border-yellow-400': rowIndex === 2 && colIndex === 2 && !square.checked
            }"
            @click="toggleSquare(rowIndex, colIndex)"
          >
            <span class="text-xs text-center leading-tight">
              {{ getCriteriaText(square.index) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- No cards message -->
    <div
      v-else
      class="text-center py-12"
    >
      <p class="text-gray-600">
        No bingo cards available.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { BingoCardResource, BingoSquare } from '../Types';

// Props
const props = defineProps<{
  criteriaArray: string[]
  bingoCardResourceList: BingoCardResource[]
}>()

// Emit events for updating the bingo card data
const emit = defineEmits<{
  'update:bingoCardResourceList': [value: BingoCardResource[]]
}>()

// Local state
const selectedCardIndex = ref(0)

// Computed properties
const activeBingoCard = computed(() => {
  return props.bingoCardResourceList[selectedCardIndex.value]
})

// Utility function to get criteria text by index
const getCriteriaText = (index: number): string => {
  if (index < 0 || index >= props.criteriaArray.length) {
    return ''
  }
  return props.criteriaArray[index] || ''
}

// Function to generate random indices for uninitialized squares
const initializeTileMatrix = (bingoCard: BingoCardResource) => {
  const tileMatrix = bingoCard.tileMatrix
  const centerRow = 2
  const centerCol = 2
  
  // Track which indices are already assigned
  const usedIndices = new Set<number>()
  
  // Ensure center square is index 0
  if (tileMatrix[centerRow][centerCol].index === -1) {
    tileMatrix[centerRow][centerCol].index = 0
  }
  usedIndices.add(tileMatrix[centerRow][centerCol].index)
  
  // Randomize indices 1-4 among corner squares
  const corners = [
    [1, 1], [1, 3], [3, 1], [3, 3]
  ]
  
  // Collect already used indices from corners
  corners.forEach(([row, col]) => {
    if (tileMatrix[row][col].index !== -1) {
      usedIndices.add(tileMatrix[row][col].index)
    }
  })
  
  // Get available corner indices (1-4 that aren't already used)
  const availableCornerIndices = [1, 2, 3, 4].filter(index => !usedIndices.has(index))
  
  // Shuffle the available corner indices
  for (let i = availableCornerIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCornerIndices[i], availableCornerIndices[j]] = [availableCornerIndices[j], availableCornerIndices[i]];
  }
  
  // Assign shuffled indices to uninitialized corners
  let cornerIndexCounter = 0
  corners.forEach(([row, col]) => {
    if (tileMatrix[row][col].index === -1 && cornerIndexCounter < availableCornerIndices.length) {
      tileMatrix[row][col].index = availableCornerIndices[cornerIndexCounter]
      usedIndices.add(availableCornerIndices[cornerIndexCounter])
      cornerIndexCounter++
    }
  })
  
  // Collect all available indices (excluding already used ones)
  const availableIndices: number[] = []
  for (let i = 0; i < props.criteriaArray.length; i++) {
    if (!usedIndices.has(i)) {
      availableIndices.push(i)
    }
  }
  
  // Shuffle available indices
  for (let i = availableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]]
  }
  
  // Assign random indices to remaining squares with value -1
  let availableIndex = 0
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (tileMatrix[row][col].index === -1 && availableIndex < availableIndices.length) {
        tileMatrix[row][col].index = availableIndices[availableIndex]
        availableIndex++
      }
    }
  }
}

// Function to toggle a square's checked state
const toggleSquare = (rowIndex: number, colIndex: number) => {
  const resource = props.bingoCardResourceList[selectedCardIndex.value]
  const square = resource.tileMatrix[rowIndex][colIndex]
  square.checked = !square.checked
  
  // Emit update to parent
  const updatedList = [...props.bingoCardResourceList]
  emit('update:bingoCardResourceList', updatedList)
}

// Watch for changes to bingoCardResourceList and initialize tile matrices as needed
watch(() => props.bingoCardResourceList, (newList: BingoCardResource[]) => {
  newList.forEach((resource: BingoCardResource) => {
    // Check if any squares need initialization
    const hasUninitialized = resource.tileMatrix.some((row: BingoSquare[]) => 
      row.some((square: BingoSquare) => square.index === -1)
    )
    
    if (hasUninitialized) {
      initializeTileMatrix(resource)
    }
  })
}, { immediate: true, deep: true })

// Reset selected card index if it's out of bounds
watch(() => props.bingoCardResourceList.length, (newLength) => {
  if (selectedCardIndex.value >= newLength) {
    selectedCardIndex.value = Math.max(0, newLength - 1)
  }
})
</script>
