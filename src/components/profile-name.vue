<script setup lang="ts">
import {useProfileStore} from "../stores/profile.store.ts";
import {ref} from "vue";

const props = defineProps({
	profileId: {
		type: Number,
		required: true
	},
	editable: {
		type: Boolean,
		default: true
	}
});

const profileStore = useProfileStore();
const profile = profileStore.getProfileById(props.profileId);
const name = ref(profile?.name ?? "");

function updateProfileName() {
	profileStore.updateProfile(props.profileId, { ...profile, name: name.value } as Profile);
}
</script>

<template>
	<div class="profile-name-container">
		<input
			v-if="editable"
			v-model="name"
			class="profile-name-input"
			type="text"
			@focusout="updateProfileName"
		/>
		<span v-else class="profile-name-text">{{ name }}</span>
	</div>
</template>

<style lang="scss" scoped>
.profile-name-container {
	font-size: 20px;
}

.profile-name-text {
	user-select: none;
}

.profile-name-text,
.profile-name-input {
	color: var(--color-text);
	font-size: unset;
	font-family: unset;
}

.profile-name-input {
	background-color: transparent;
	border: none;
	border-bottom: 2px solid transparent;
	margin-top: 2px; // Add offset from the bottom border
	color: var(--color-text);
	padding: 0;


	&:hover {
		border-color: var(--border-issue-border-hover);
	}

	&:focus {
		outline: none;
		border-color: var(--primary-50);
	}
}
</style>
