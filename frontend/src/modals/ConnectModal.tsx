import React, { useMemo, useState } from 'react';
import { ProfileType } from "../graphql/sdk";
import Modal from "../components/Modal";
import CloseSvg from 'jsx:../images/close.svg';
import { useInjection } from "inversify-react";
import { ModalStore } from "../stores/ModalStore";
import WalletStore, { ADDRESSES } from "../stores/WalletStore";
import Button from "../components/Button";
import { processRequestError, toBN } from "../utils/utils";
import { observer } from "mobx-react";
import { toast } from "react-toastify";

interface IConnectModalProps {
    modalId: number;
}

const ConnectModal = observer(({ modalId }: IConnectModalProps) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);

    return (
        <Modal modalId={modalId} onHide={() => walletStore.connectDefer.reject()}>
            <div className="main-form">
                <div className="main-form__wrap">
                    <h2 className="main-form__title">Connect Wallet</h2>
                    <div className="main-form__close" onClick={() => modalStore.hideModal(modalId)}>
                        <CloseSvg />
                    </div>
                    <div className="main-form__field">
                        <div className="modal__btn">
                            <button className="btn secondary" type="button" onClick={() => walletStore.connectDefer.resolve('mm')}>Metamask</button>
                        </div>
                        <div className="modal__btn">
                            <button className="btn secondary" type="button" onClick={() => walletStore.connectDefer.resolve('wc')}>WalletConnect</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
});

export default ConnectModal;
