import { useStateStore } from "@/stores/state";
import { storeToRefs } from "pinia";

export function useState() {

    const { confirmModal } = storeToRefs(useStateStore());

    const setConfirmModal = (value: boolean) => {
        confirmModal.value = value;
    }

    return { 
        confirmModal, 
        setConfirmModal, 
    }
}