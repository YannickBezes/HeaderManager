<script setup lang="ts">
import {useProfileStore} from "../stores/profile.store.ts";
import {ref} from "vue";
import VInput from "./v-input.vue";

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
		<v-input
			v-if="editable"
			v-model="name"
			@input="updateProfileName"
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
	color: var(--color-text);
	font-size: unset;
	font-family: unset;
}

</style>
