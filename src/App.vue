<script setup lang="ts">
import TopBar from "./components/top-bar.vue";
import {useProfileStore} from "./stores/profile.store.ts";

const profileStore = useProfileStore();
profileStore.loadProfiles();
</script>

<template>
  <div class="container">
	  <top-bar />
  </div>
</template>

<style scoped>
.container {
	width: 620px;
	height: 510px;
}
</style>
