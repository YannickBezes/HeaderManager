<script setup lang="ts">
import ProfileIcon from "./profile-icon.vue";
import {useProfileStore} from "../stores/profile.store.ts";
import ProfileName from "./profile-name.vue";
import AddIcon from "../assets/icons/add.svg";
import PauseIcon from "../assets/icons/pause.svg";
import MoreIcon from "../assets/icons/more.svg";

const profileStore = useProfileStore();
const currentProfile = profileStore.currentProfile;
</script>

<template>
	<header class="top-bar" v-if="currentProfile !== null">
		<profile-icon :profile-id="currentProfile.id"/>
		<profile-name :profile-id="currentProfile.id" :editable="true"/>

		<div class="action-buttons-container">
			<add-icon class="action-button" tabindex="0"/>
			<pause-icon class="action-button" tabindex="0"/>
			<more-icon class="action-button" tabindex="0"/>
		</div>
	</header>
</template>

<style lang="scss" scoped>
.top-bar {
	background-color: var(--grey-180);
	color: white;
	width: 100%;
	align-items: center;
	padding: 10px;
	display: flex;
	gap: 10px;
}

.action-buttons-container {
	flex: 1 1 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 10px;
}

.action-button {
	width: 34px;
	height: 34px;
	padding: 5px;
	cursor: pointer;
	border-radius: 50%;

	&:hover,
	&:focus {
		outline: none;
		background: var(--grey-110);

		:deep(*) {
			fill: var(--primary-20);

		}
	}
}
</style>
