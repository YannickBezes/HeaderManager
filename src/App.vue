<script setup lang="ts">
import TopBar from "./components/top-bar.vue";
import {useProfileStore} from "./stores/profile.store.ts";
import HeaderList from "./components/header-list.vue";
import {HEADER_TYPE} from "./constants.ts";

const profileStore = useProfileStore();
profileStore.loadProfiles();
</script>

<template>
  <div class="container">
	  <top-bar />

	  <header-list :type="HEADER_TYPE.request" />
	  <header-list :type="HEADER_TYPE.response" />
  </div>
</template>

<style scoped>
.container {
	min-width: 620px;
	min-height: 510px;
}
</style>
