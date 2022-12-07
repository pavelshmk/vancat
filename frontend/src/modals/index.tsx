import React from 'react';
import { ModalsEnum, ModalStore } from "../stores/ModalStore";
import { useInjection } from "inversify-react";
import { ScrollLock } from "../components/ScrollLock";
import EditProfileModal from "./EditProfileModal";
import { observer } from "mobx-react";
import SellModal from "./SellModal";
import ConnectModal from "./ConnectModal";

const MODAL_REGISTRY = {
    [ModalsEnum.EditProfile]: EditProfileModal,
    [ModalsEnum.Sell]: SellModal,
    [ModalsEnum.Connect]: ConnectModal,
    // [ModalsEnum.Loading]: LoadingModal,
    // [ModalsEnum.Prompt]: PromptModal,
}

const ModalsContainer = observer(() => {
    const modalStore = useInjection(ModalStore);

    return (
        <>
            {modalStore.activeModals.length > 0 && <ScrollLock />}
            {modalStore.activeModals.map((m, i) => {
                const Component = MODAL_REGISTRY[m.key];
                return Component ? <Component key={i} data={m.data} modalId={i} /> : null;
            })}
        </>
    )
});

export default ModalsContainer;
