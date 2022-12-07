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

interface ISellModalProps {
    modalId: number;
    data: { artworkId: string };
}

const SellModal = observer(({ modalId, data: { artworkId } }: ISellModalProps) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);

    const [ price, setPrice ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const marketplace = walletStore.marketplaceContract;
            const nft = walletStore.nftContract;

            if (!await nft.methods.isApprovedForAll(walletStore.address, ADDRESSES.marketplace).call()) {
                await walletStore.sendTransaction(nft.methods.setApprovalForAll(ADDRESSES.marketplace, true));
                toast.success('Approved NFT usage to the marketplace contract');
            }

            await walletStore.sendTransaction(marketplace.methods.list(artworkId, toBN(price).times('1e18').toFixed(0)));
            toast.success('Listed successfully');
            modalStore.hideModal(modalId);
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal modalId={modalId} closable={!loading}>
            <form className="main-form" onSubmit={onSubmit}>
                <div className="main-form__wrap">
                    <h2 className="main-form__title">Sell artwork</h2>
                    <div className="main-form__close" onClick={() => modalStore.hideModal(modalId)}>
                        <CloseSvg />
                    </div>
                    <div className="main-form__field">
                        <div className="main-form__name">
                            <span>Price</span>
                        </div>
                        <div className="main-form__wraper">
                            <span className="main-form__mail">VAN</span>
                            <input className="main-form__input" type="number" value={price} onChange={e => setPrice(e.target.value)}/>
                        </div>
                        <div className="modal__btn">
                            <Button className="primary" key={price} loading={loading} disabled={!toBN(price).isPositive()} type="submit">Sell</Button>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    )
});

export default SellModal;
