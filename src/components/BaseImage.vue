<template>
    <!-- TODO: add lazy-src -->
    <v-img :src="src" class="align-end" :cover="cover">
        <template v-slot:placeholder>
            <v-row align="center" class="fill-height ma-0" justify="center">
                <v-progress-circular color="black" indeterminate />
            </v-row>
        </template>
    </v-img>
</template>

<script lang="ts" setup>
defineProps({
    cover: { type: Boolean, default: false },
    src: { type: String, required: true },
});
</script>