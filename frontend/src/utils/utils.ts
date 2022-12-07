import { rootStore } from "../main";
import { ModalsEnum } from "../stores/ModalStore";
import { ClientError } from "graphql-request";
import { toast } from "react-toastify";
import BN from "bignumber.js";

export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'


export async function generateSignature(prefix: string, address?: string): Promise<{ nonce: string, signature: string }> {
    const modalId = rootStore.modalStore.showModal(ModalsEnum.Loading, { title: 'Please sign confirmation message', 'subtitle': '' });
    try {
        const nonce = await rootStore.api.getNonce();
        const signature = await rootStore.walletStore.signMessage(`${prefix}:${nonce}`, address);
        return { nonce, signature };
    } finally {
        rootStore.modalStore.hideModal(modalId);
    }
}

export function trimAddress(address?: string) {
    if (!address)
        return '';
    return `${address.slice(0, 6)}...${address.slice(address.length-4)}`
}

export function processRequestError(e: ClientError) {
    console.error(e);
    if (!e.response) {
        toast.error('An error has occurred while performing a request. Please check your internet connection and try later.')
        return;
    }
    e.response.errors.forEach(err => toast.error(err.message));
}

export function toBN(val: number | string) {
    if (!val)
        return new BN(0);
    return new BN(val.toString());
}
