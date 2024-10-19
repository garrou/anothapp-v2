import { useStateStore } from "@/stores/state";
import { storeToRefs } from "pinia";

export function useState() {

    const { confirmModal, counter } = storeToRefs(useStateStore());

    const setConfirmModal = (value: boolean) => {
        confirmModal.value = value;
    }
    
    const increment = () => {
        counter.value++;
    }

    return { confirmModal, counter, increment, setConfirmModal }
}