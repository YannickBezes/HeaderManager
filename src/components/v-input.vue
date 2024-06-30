<script setup lang="ts">
const model = defineModel();

defineProps({
	value: {
		type: String,
		required: false
	},
	displayBorder: {
		type: Boolean,
		default: false
	},
	placeholder: {
		type: String,
		default: ''
	}
});
</script>

<template>
	<input
		v-model="model"
		:class="{ 'border-bottom': displayBorder }"
		:placeholder="placeholder"
		class="v-input"
		type="text"
	/>
</template>

<style lang="scss" scoped>
.v-input {
	color: var(--color-text);
	font-size: unset;
	font-family: unset;
	background-color: transparent;
	border: none;
	border-bottom: 2px solid transparent;
	margin-top: 2px; // Add offset from the bottom border
	padding: 0;

	&.border-bottom {
		border-color: var(--grey-90);
	}

	&:hover {
		border-color: var(--border-issue-border-hover);
	}

	&:focus {
		outline: none;
		border-color: var(--primary-50);
	}
}
</style>
