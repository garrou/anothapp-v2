import { ref } from "vue";
import { defineStore } from "pinia";
import type { AppMenuItem } from "@/models/menu";

export const useStateStore = defineStore("state", () => {

  const confirmModal = ref(false);

  const menuModal = ref<AppMenuItem>();

  return { confirmModal, menuModal };
});