import type { AppMenuItem } from "@/models/menu";
import { useStateStore } from "@/stores/state";
import { storeToRefs } from "pinia";

export function useState() {

    const { confirmModal, counter, menuModal } = storeToRefs(useStateStore());

    const setConfirmModal = (value: boolean) => {
        confirmModal.value = value;
    }

    const setMenuModal = (menu?: AppMenuItem) => {
        menuModal.value = menu;
    }
    
    const increment = () => {
        counter.value++;
    }

    return { 
        confirmModal, 
        counter, 
        menuModal,
        increment, 
        setConfirmModal, 
        setMenuModal 
    }
}