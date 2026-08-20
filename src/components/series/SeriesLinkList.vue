<template>
    <v-table>
        <tbody>
            <tr v-for="serie in series" :key="serie.id">
                <td>
                    <router-link :text="serie.title" :to="`${basePath}/${serie.id}`" @click="$emit('click', serie)" />
                </td>
            </tr>
        </tbody>
    </v-table>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

interface LinkableSerie {
    id: number;
    title: string;
}

defineProps({
    basePath: { type: String, default: "/series" },
    series: { type: Array as PropType<LinkableSerie[]>, required: true },
});

defineEmits<{
    click: [LinkableSerie]
}>();
</script>
