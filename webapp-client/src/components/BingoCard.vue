<template>
  <div class="max-w-2xl mx-auto">
    <!-- Dropdown and Create New Card Button -->
    <div class="mx-8 my-6 flex items-center gap-4">
      <div class="flex-1 max-w-xs">
        <select
          id="bingo-card-select"
          v-model="selectedCardIndex"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      
      <button
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        @click="createNewBingoCard"
      >
        Create Card
      </button>
      
      <button
        v-if="activeBingoCard && bingoCardResourceList.length > 1"
        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        @click="deleteBingoCard"
      >
        Delete Card
      </button>
    </div>
    <!-- Bingo Card Grid -->
    <div
      v-if="activeBingoCard"
      class="bg-white rounded-lg shadow-lg pt-6 pb-16"
    >
      <!-- Editable Prospect Name -->
      <div class="text-center mb-6">
        <div
          v-if="!isEditingName"
          class="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors duration-200 inline-flex items-center gap-2"
          @click="startEditingName"
        >
          {{ activeBingoCard.prospectName }}
          <Icon
            icon="material-symbols:edit"
            class="text-lg text-gray-400 hover:text-gray-600 transition-colors duration-200"
          />
        </div>
        <div
          v-else
          class="flex items-center justify-center gap-2"
        >
          <input
            ref="nameInput"
            v-model="editingName"
            class="text-2xl font-bold text-gray-800 text-center border-b-2 border-blue-500 bg-transparent focus:outline-none focus:border-blue-700 min-w-0"
            @blur="saveProspectName"
            @keyup.enter="saveProspectName"
            @keyup.escape="cancelEditing"
          >
          <button
            class="text-green-600 hover:text-green-800"
            @click="saveProspectName"
          >
            <Icon
              icon="material-symbols:check"
              class="text-lg"
            />
          </button>
          <button
            class="text-red-600 hover:text-red-800"
            @click="cancelEditing"
          >
            <Icon
              icon="material-symbols:close"
              class="text-lg"
            />
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-5 gap-0 max-w-lg mx-auto border-[1px] border-gray-300">
        <div
          v-for="(row, rowIndex) in activeBingoCard.tileMatrix"
          :key="`row-${rowIndex}`"
        >
          <div
            v-for="(square, colIndex) in row"
            :key="`square-${rowIndex}-${colIndex}`"
            class="relative aspect-square border-[1px] border-gray-300 flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-blue-400 p-2"
            :class="{
              'bg-blue-500 text-white border-blue-600': square.checked,
              'bg-white text-gray-800': !square.checked,
              'bg-yellow-200 border-yellow-400': rowIndex === 2 && colIndex === 2 && !square.checked,
              'bg-green-600 text-gray-900': rowIndex === 2 && colIndex === 2 && square.checked,
            }"
            @click="toggleSquare(rowIndex, colIndex)"
          >
            <span class="z-10 text-xs text-center select-none leading-tight">
              {{ getCriteriaText(square.index) }}
            </span>
            <Icon
              v-if="square.checked"
              icon="material-symbols:check"
              width="32"
              class="absolute text-white text-lg top-0 left-0"
            />
            <Icon
              v-if="rowIndex === 2 && colIndex === 2"
              icon="material-symbols-light:star"
              width="100%"
              class="absolute text-white text-lg"
            />
            <Icon
              v-if="[[1, 1], [1, 3], [3, 1], [3, 3], [0, 0], [0, 4], [4, 0], [4, 4]].some(([r, c]) => r === rowIndex && c === colIndex)"
              icon="arcticons:circle"
              width="80%"
              class="absolute"
              :class="{
                'text-gray-300': !square.checked,
                'text-white': square.checked
              }"
            />
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
import { Icon } from '@iconify/vue';
import { computed, ref, watch } from 'vue';
import type { BingoCardResource, BingoSquare } from '../Types';

// Props
const props = defineProps<{
  criteriaArray: string[]
  bingoCardResourceList: BingoCardResource[]
}>()

// Emit events for updating the bingo card data
const emit = defineEmits<{
  'update:bingoCardResource': [value: BingoCardResource]
  'create:bingoCardResource': [value: BingoCardResource]
  'delete:bingoCardResource': [value: BingoCardResource]
}>()

// Local state
const selectedCardIndex = ref(0)
const isEditingName = ref(false)
const editingName = ref('')
const nameInput = ref<HTMLInputElement>()

// Computed properties
const activeBingoCard = computed(() => {
  return props.bingoCardResourceList[selectedCardIndex.value]
})

// Utility function to get criteria text by index
function getCriteriaText(index: number): string {
  if (index < 0 || index >= props.criteriaArray.length) {
    return ''
  }
  return props.criteriaArray[index] || ''
}

// Function to generate random indices for uninitialized squares
function initializeTileMatrix(bingoCard: BingoCardResource) {
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

  // Randomize indices 1-8 among important tiles
  const importantTiles = [
    [1, 1], [1, 3], [3, 1], [3, 3], [0, 0], [0, 4], [4, 0], [4, 4]
  ]

  // Collect already used indices from important tiles
  importantTiles.forEach(([row, col]) => {
    if (tileMatrix[row][col].index !== -1) {
      usedIndices.add(tileMatrix[row][col].index)
    }
  })

  // Get available corner indices (1-8 that aren't already used)
  const availableCornerIndices = [1, 2, 3, 4, 5, 6, 7, 8].filter(index => !usedIndices.has(index))
  
  // Shuffle the available corner indices
  for (let i = availableCornerIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCornerIndices[i], availableCornerIndices[j]] = [availableCornerIndices[j], availableCornerIndices[i]];
  }
  
  // Assign shuffled indices to uninitialized corners
  let cornerIndexCounter = 0
  importantTiles.forEach(([row, col]) => {
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
function toggleSquare(rowIndex: number, colIndex: number) {
  const resource = props.bingoCardResourceList[selectedCardIndex.value]
  const square = resource.tileMatrix[rowIndex][colIndex]
  square.checked = !square.checked
  
  // Emit update to parent
  emit('update:bingoCardResource', resource)
}

// Functions for editing prospect name
function startEditingName() {
  if (!activeBingoCard.value) return
  
  editingName.value = activeBingoCard.value.prospectName
  isEditingName.value = true
}

function saveProspectName() {
  if (!activeBingoCard.value) return
  
  const trimmedName = editingName.value.trim()
  if (trimmedName) {
    activeBingoCard.value.prospectName = trimmedName
    emit('update:bingoCardResource', activeBingoCard.value)
  }
  isEditingName.value = false
}

const cancelEditing = () => {
  isEditingName.value = false
  editingName.value = ''
}

// Function to create a new bingo card
function createNewBingoCard() {
  // Create empty 5x5 tile matrix with all indices set to -1
  const emptyTileMatrix: BingoSquare[][] = []
  for (let row = 0; row < 5; row++) {
    const rowArray: BingoSquare[] = []
    for (let col = 0; col < 5; col++) {
      rowArray.push({
        index: -1,
        checked: false
      })
    }
    emptyTileMatrix.push(rowArray)
  }

  const newBingoCard: BingoCardResource = {
    prospectName: `New Card ${props.bingoCardResourceList.length + 1}`,
    tileMatrix: emptyTileMatrix
  }

  // Initialize the tile matrix for the new card
  initializeTileMatrix(newBingoCard)

  // Emit the new card to the parent component
  emit('create:bingoCardResource', newBingoCard)

  // Switch to the new card
  selectedCardIndex.value = props.bingoCardResourceList.length
}

// Function to delete the currently selected bingo card
function deleteBingoCard() {
  if (!activeBingoCard.value || props.bingoCardResourceList.length <= 1) {
    return
  }

  if (confirm(`Are you sure you want to delete "${activeBingoCard.value.prospectName}"?`)) {
    // Emit delete event to parent component
    emit('delete:bingoCardResource', activeBingoCard.value)

    // Adjust selectedCardIndex if necessary
    if (selectedCardIndex.value >= props.bingoCardResourceList.length - 1) {
      selectedCardIndex.value = Math.max(0, props.bingoCardResourceList.length - 2)
    }
  }
}

// Watch for changes to bingoCardResourceList and initialize tile matrices as needed
watch(() => props.bingoCardResourceList, (newList: BingoCardResource[]) => {
  newList.forEach((resource: BingoCardResource) => {
    // Check if any squares need initialization
    const hasUninitialized = resource.tileMatrix.some((row: BingoSquare[]) => 
      row.some((square: BingoSquare) => square.index === -1)
    )
    
    if (hasUninitialized) {
      initializeTileMatrix(resource);
      emit('update:bingoCardResource', resource);
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
