<script setup lang="ts">
import ProfileIcon from "./profile-icon.vue";
import {useProfileStore} from "../stores/profile.store.ts";
import ProfileName from "./profile-name.vue";

const profileStore = useProfileStore();
const currentProfile = profileStore.currentProfile;
</script>

<template>
	<header class="top-bar" v-if="currentProfile !== null">
		<profile-icon :profile-id="currentProfile.id" />
		<profile-name :profile-id="currentProfile.id" />
	</header>
</template>

<style scoped>
.top-bar {
	background-color: var(--grey-140);
	color: white;
	position: fixed;
	width: 100%;
	align-items: center;
	padding: 10px;
	display: flex;
	gap: 10px;
}
</style>
