<template>
    <v-text-field v-model="model" :counter="counter" :hide-details="hideDetails" :label="label" :prefix="prefix"
        :required="required" :rules="rules" :suffix="suffix" :type="type" :variant="variant" />
</template>

<script lang="ts" setup>
import type { TextFieldType, TextFieldVariant } from "@/types/base-textfield";
import type { PropType } from "vue";

defineProps({
    counter: { type: [Number, Boolean], required: false },
    hideDetails: { type: Boolean, default: true },
    label: { type: String, required: true },
    model: { type: String, required: true },
    prefix: { type: String, required: false },
    required: { type: Boolean, default: false },
    rules: { type: Array as PropType<any[]>, required: false },
    suffix: { type: String, required: false },
    type: { type: String as PropType<TextFieldType>, default: "text" },
    variant: { type: String as PropType<TextFieldVariant>, default: "underlined" }
})

const model = defineModel({ type: String });
</script>