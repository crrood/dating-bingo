<template>
  <NavbarTop />
  <div class="flex w-full">
    <span 
      class="flex-1 text-center py-2 bg-gray-100 border-b-2 border-gray-300
    cursor-pointer hover:bg-gray-200"
      @click="state.showCriteriaForm = false"
    >
      Bingo
    </span>
    <span 
      class="flex-1 text-center py-2 bg-gray-100 border-b-2 border-gray-300
    cursor-pointer hover:bg-gray-200"
      @click="state.showCriteriaForm = true"
    >
      Criteria
    </span>
  </div>
  <CriteriaForm
    v-if="state.showCriteriaForm && state.criteriaResource.criteria"
    :criteriaArray="state.criteriaResource.criteria"
    @update:criteria-array="criteriaArrayUpdated"
  />
  <BingoCard
    v-if="!state.showCriteriaForm && state.bingoCardResourceList && state.criteriaResource.criteria"
    :criteriaArray="state.criteriaResource.criteria"
    :bingoCardResourceList="state.bingoCardResourceList"
    @update:bingo-card-resource="bingoCardResourceUpdated"
  />
</template>

<script setup lang="ts">
import axios from "axios";
import { reactive } from "vue";
import BingoCard from "./components/BingoCard.vue";
import CriteriaForm from "./components/CriteriaForm.vue";
import NavbarTop from "./components/NavbarTop.vue";
import type { BingoCardResource, CriteriaResource } from "./Types";

interface State {
  criteriaResource: CriteriaResource;
  bingoCardResourceList: BingoCardResource[];
  showCriteriaForm: boolean;
}
const state: State = reactive({
  criteriaResource: {criteria: []},
  bingoCardResourceList: [],
  showCriteriaForm: false,
});

axios.get("/api/criteriaArray").then((response) => {
  state.criteriaResource = response.data[0] as CriteriaResource;
  if (!state.criteriaResource.criteria) {
    throw new Error("Criteria array is missing in the response");
  }
  console.log("Fetched criteria:", state.criteriaResource);
  console.log("Criteria array:", state.criteriaResource.criteria);
}).catch((error) => {
  console.error("Error fetching criteria:", error);
});

axios.get("/api/bingoCard").then((response) => {
  state.bingoCardResourceList = response.data as BingoCardResource[];
  console.log("Fetched bingo cards:", state.bingoCardResourceList);
}).catch((error) => {
  console.error("Error fetching bingo cards:", error);
});

function criteriaArrayUpdated(newCriteriaArray: string[]) {
  console.log("Criteria array updated:", newCriteriaArray);
  state.criteriaResource.criteria = newCriteriaArray;
  axios.put(`/api/criteriaArray/${state.criteriaResource._id?.$oid}`, state.criteriaResource)
    .then((response) => {
      console.log("Successfully updated criteria array:", response.data);
    })
    .catch((error) => {
      console.error("Error updating criteria array:", error);
    });
}

function bingoCardResourceUpdated(updatedResource: BingoCardResource) {
  const index = state.bingoCardResourceList.findIndex(
    (resource) => resource._id?.$oid === updatedResource._id?.$oid
  );
  if (index !== -1) {
    state.bingoCardResourceList[index] = updatedResource;
  }
  axios.put(`/api/bingoCard`, updatedResource)
    .then((response) => {
      console.log("Successfully updated bingo card resource:", response.data);
    })
    .catch((error) => {
      console.error("Error updating bingo card resource:", error);
    });
}

</script>