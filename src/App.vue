<script setup lang="ts">
import TopBar from "./components/top-bar.vue";
import {useProfileStore} from "./stores/profile.store.ts";
import HeaderList from "./components/header-list.vue";
import {HEADER_TYPE} from "./constants.ts";
import {ref} from "vue";

const profileStore = useProfileStore();
const isLoading = ref(true);
profileStore
	.loadProfiles()
	.then(() => isLoading.value = false);
</script>

<template>
	<div class="container">
		<!-- TODO: loader -->
		<template v-if="!isLoading">
			<top-bar/>

			<header-list :type="HEADER_TYPE.request"/>
			<header-list :type="HEADER_TYPE.response"/>
		</template>
	</div>
</template>

<style scoped>
.container {
	min-width: 620px;
	min-height: 510px;
}
</style>
