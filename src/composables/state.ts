import type { AppMenuItem } from "@/models/menu";
import { useStateStore } from "@/stores/state";
import { storeToRefs } from "pinia";

export function useState() {

    const { confirmModal, menuModal } = storeToRefs(useStateStore());

    const setConfirmModal = (value: boolean) => {
        confirmModal.value = value;
    }

    const setMenuModal = (menu?: AppMenuItem) => {
        menuModal.value = menu;
    }

    return { 
        confirmModal, 
        menuModal,
        setConfirmModal, 
        setMenuModal 
    }
}