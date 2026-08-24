<template>
    <v-dialog :max-width="width" :persistent="persistent" :aria-label="title">
        <v-card :text="text" :title="title">
            <template #actions>
                <v-spacer></v-spacer>

                <v-btn variant="text" @click="$emit('cancel')">
                    {{ cancelText }}
                </v-btn>

                <v-btn :color="confirmColor" variant="flat" @click="$emit('confirm')">
                    {{ confirmText }}
                </v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
defineProps({
    cancelText: { type: String, default: "Annuler" },
    confirmColor: { type: String, default: "error" },
    confirmText: { type: String, default: "Confirmer" },
    persistent: { type: Boolean, default: false },
    text: { type: String, required: true },
    title: { type: String, required: true },
    width: { type: Number, default: 400 }
});

defineEmits<{
    cancel: []
    confirm: []
}>();
</script>