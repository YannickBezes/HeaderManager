<script setup lang="ts">
import {HEADER_TYPE} from "../constants.ts";
import {computed} from "vue";
import {useProfileStore} from "../stores/profile.store.ts";
import VInput from "./v-input.vue";
import DeleteIcon from "../assets/icons/delete.svg";
import VCheckbox from "./v-checkbox.vue";


const props = defineProps({
	type: {
		type: String,
		default: HEADER_TYPE.request
	}
});

const title = computed(() => props.type === HEADER_TYPE.request ? "Request headers" : "Response headers");

const profileStore = useProfileStore();
const headers = computed(() => {
	if (profileStore.currentProfile === null) {
		return [];
	}

	return (
		props.type === HEADER_TYPE.request
			? profileStore.currentProfile.request.headers
			: profileStore.currentProfile.response.headers
	).map(header => ({...header}));
});

function updateProfile() {
	if (
		profileStore.currentProfile === null
		|| profileStore.currentProfileId === null
	) {
		return;
	}

	profileStore.updateProfile(profileStore.currentProfileId, {
		...profileStore.currentProfile,
		request: {
			...profileStore.currentProfile.request,
			headers: props.type === HEADER_TYPE.request ? headers.value : profileStore.currentProfile.request.headers as Header[],
		},
		response: {
			...profileStore.currentProfile.response,
			headers: props.type === HEADER_TYPE.response ? headers.value : profileStore.currentProfile.response.headers as Header[],
		},
	});
}

function deleteHeader(headerIndex: number) {
	headers.value.splice(headerIndex, 1);
	updateProfile();
}
</script>

<template>
	<div class="header-list-container" v-if="headers.length > 0">
		<div class="header-row">
			<h3 class="header-title">{{ title }}</h3>
		</div>

		<div class="header-row" v-for="(header, index) in headers">
			<v-checkbox v-model="header.active" @change="updateProfile" />
			<v-input
				v-model="header.name"
				:display-border="true"
				placeholder="Name"
				@input="updateProfile"
			/>
			<v-input
				v-model="header.value"
				:display-border="true"
				placeholder="Value"
				@input="updateProfile"
			/>

			<delete-icon
				class="header-row-delete"
				@click.native="deleteHeader(index)"
				tabindex="0"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.header-list-container {
	padding: 10px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.header-title {
	margin: 0;
	font-weight: bold;
	user-select: none;
}

.header-row {
	flex: 1;
	width: 100%;
	display: flex;
	gap: 10px;
	align-items: center;

	> input {
		flex: 1;
	}
}

.header-row-delete {
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
