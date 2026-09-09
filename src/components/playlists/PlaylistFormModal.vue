<template>
    <v-dialog max-width="400" persistent :aria-label="title">
        <v-card :title="title">
            <v-card-text>
                <v-text-field v-model="name" autofocus label="Nom" maxlength="255" :rules="[(v: string) => !!v.trim() || 'Le nom est requis']" />
                <v-switch v-model="visible" color="primary" hide-details
                    :label="visible ? 'Visible par vos amis' : 'Privée'" />
            </v-card-text>

            <template #actions>
                <v-spacer></v-spacer>

                <v-btn variant="text" @click="$emit('cancel')">Annuler</v-btn>

                <v-btn color="primary" variant="flat" :disabled="!name.trim()" @click="save">
                    {{ confirmText }}
                </v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from "vue";
import type { Playlist } from "@/models/playlist";

const props = defineProps({
    confirmText: { type: String, default: "Créer" },
    playlist: { type: Object as PropType<Playlist>, default: undefined },
    title: { type: String, default: "Nouvelle playlist" },
});

const emit = defineEmits<{
    cancel: []
    save: [name: string, visible: boolean]
}>();

const name = ref(props.playlist?.name ?? "");
const visible = ref(props.playlist?.visible ?? false);

watch(() => props.playlist, (playlist) => {
    name.value = playlist?.name ?? "";
    visible.value = playlist?.visible ?? false;
});

const save = (): void => {
    if (!name.value.trim()) return;
    emit("save", name.value.trim(), visible.value);
}
</script>
