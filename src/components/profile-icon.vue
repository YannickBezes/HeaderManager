<script setup lang="ts">

defineProps({
	profileId: {
		type: Number,
		required: true
	}
})
</script>

<template>
	<div class="profile-icon-container">
		<span>{{ profileId }}</span>
	</div>
</template>

<style scoped>
.profile-icon-container {
	border: 2px solid var(--grey-40);
	height: 35px;
	width: 35px;
	border-radius: 50%;
	color: var(--grey-10);
	font-size: 18px;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	user-select: none;
	line-height: normal;
}
</style>
