<script setup lang="ts">
import {ref} from "vue";

const model = defineModel({
	type: Boolean
});

const input = ref<HTMLInputElement | null>(null);
function loseFocus() {
	if (!input.value) {
		return;
	}

	input.value.blur();
}

</script>

<template>
	<div class="v-input-container">
		<input type="checkbox" v-model="model" @click="loseFocus" ref="input" />
		<span></span>
	</div>
</template>

<style scoped lang="scss">
.v-input-container {
	width: 24px;
	height: 24px;
	position: relative;
	cursor: pointer;

	& > input {
		top: 0;
		left: 0;
		position: absolute;
		height: 100%;
		width: 100%;
		opacity: 0;
		margin: 0;
		padding: 0;
		pointer-events: auto;
		cursor: pointer;
	}

	& > span {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		border: 2px solid var(--grey-50);
		border-radius: 4px;
		transition: all .3s;
		pointer-events: none;
	}

	& > input:hover + span,
	& > input:focus + span {
		border-color: var(--primary-50);
	}



	& > input:checked + span {
		border-color: var(--primary-20);
		background-color: var(--primary-20);
		animation: bounce 250ms;

		&:before {
			content: '';
			position: absolute;
			border-right: 3px solid transparent;
			border-bottom: 3px solid transparent;
			top: 13px;
			left: 8px;
			transform: rotate(45deg);
			animation: checked-box 125ms 250ms forwards;
		}
	}
}

@keyframes checked-box {
	0% {
		width: 0;
		height: 0;
		border-color: var(--grey-220);
		transform: translate(0,0) rotate(45deg);
	}
	100% {
		width: 4px;
		height: 8px;
		border-color: var(--grey-220);
		transform: translate(0,-8px) rotate(45deg);
	}
}

@keyframes bounce {
	0% {
		transform: scale(1);
	}
	33% {
		transform: scale(.7);
	}
	100% {
		transform: scale(1);
	}
}
</style>
