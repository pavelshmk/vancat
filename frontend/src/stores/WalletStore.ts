import RootStore from "./RootStore";
import { action, makeObservable, observable, runInAction } from "mobx";
import Web3 from "web3";
import { toast } from "react-toastify";
import store from "store";
import Timeout from "await-timeout";
import { generateSignature } from "../utils/utils";
import { Profile, ProfileInputType } from "../graphql/sdk";
import defer from 'defer-promise';

import ADDRESSES from '../contracts/addresses.json';
import { ContractContext as NFTContractContext, MethodReturnContext } from "../contracts/nft";
import { ContractContext as PaymentTokenContractContext } from "../contracts/paymentToken";
import { ContractContext as MarketplaceContractContext } from "../contracts/marketplace";
import { ContractContext as EggContractContext } from "../contracts/egg";
import { ContractContext as SpermContractContext } from "../contracts/sperm";
import NFTContractAbi from '../contracts/nft.abi.json';
import PaymentTokenContractAbi from '../contracts/paymentToken.abi.json';
import MarketplaceContractAbi from '../contracts/marketplace.abi.json';
import EggContractAbi from '../contracts/egg.abi.json';
import SpermContractAbi from '../contracts/sperm.abi.json';
import { Subscription } from 'web3-core-subscriptions';
import { BlockHeader } from "web3-eth";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ModalsEnum } from "./ModalStore";
import { PromiEvent, TransactionReceipt } from "ethereum-abi-types-generator";

export const CHAIN_ID = 97;
const DEFAULT_RPC = 'https://data-seed-prebsc-1-s3.binance.org:8545/';
const DEFAULT_RPC_WS = 'wss://speedy-nodes-nyc.moralis.io/058d9aac5b70cbdd3dfea97a/bsc/testnet/ws'

const chainParameters = {
    chainId: `0x${CHAIN_ID.toString(16).padStart(2, '0')}`,
    chainName: 'BSC Test',
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: [DEFAULT_RPC],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
}

class WalletStore {
    @observable initialized: boolean = false;
    @observable address: string;
    @observable connected: boolean = false;
    @observable lastBlock: number;
    @observable profile: Profile;
    @observable connectDefer: DeferPromise.Deferred<'mm' | 'wc'>;

    private rawProvider: any = new Web3.providers.WebsocketProvider(DEFAULT_RPC_WS);
    private newBlockSubscription: Subscription<BlockHeader>;

    constructor(private rootStore: RootStore) {
        makeObservable(this);
        this.initialize();
        this.newBlockSubscription = this.web3.eth.subscribe('newBlockHeaders').on('data', block => this.updateCurrentBlock(block));
    }

    @action private updateCurrentBlock = (block) => {
        this.lastBlock = block?.number;
        this.loadProfile();
        // this.loadProfile();
    }

    private initialize = async () => {
        await Timeout.set(10);
        if (store.get('connected')) {
            await this.connect(store.get('lastProvider'));
        }
        runInAction(() => this.initialized = true);
        // const info = await this.rootStore.api.getInfo();
        // runInAction(() => this.info = info);
    }

    loadProfile = async () => {
        if (!this.address)
            return;
        const profile = await this.rootStore.api.getProfile(this.address);
        runInAction(() => this.profile = profile);
    }

    resetWallet = async (chainId?: string) => {
        if (parseInt(chainId, 16) == CHAIN_ID)
            return;
        runInAction(() => { this.connected = false; this.address = undefined });
        this.rawProvider?.off?.('accountsChanged', this.resetWallet)
        this.rawProvider?.off?.('chainChanged', this.resetWallet);
        this.rawProvider?.off?.('disconnected', this.resetWallet);
        this.rawProvider = new Web3.providers.HttpProvider(DEFAULT_RPC);
        store.remove('tokenAddress');
        store.remove('token');
        store.remove('connected');
    }

    connect = async (provider?: 'mm' | 'wc') => {
        if (this.connected)
            return true;

        this.connectDefer = defer();
        let modalId;
        if (!provider)
            modalId = this.rootStore.modalStore.showModal(ModalsEnum.Connect);
        try {
            if (!provider)
                provider = await this.connectDefer.promise;

            switch (provider) {
                case 'mm':
                    this.rawProvider = window['ethereum'];
                    if (!this.rawProvider) {
                        toast.error('Metamask is not installed');
                        return false;
                    }
                    break;
                case 'wc':
                    this.rawProvider = new WalletConnectProvider({
                        chainId: CHAIN_ID,
                        rpc: {
                            [CHAIN_ID]: DEFAULT_RPC,
                        }
                    });
                    break;
            }
            store.set('lastProvider', provider);
        } catch (e) {
            console.error(e);
            return false;
        } finally {
            if (typeof modalId !== 'undefined')
                this.rootStore.modalStore.hideModal(modalId);
        }
        return await this.initProvider();
    }

    initProvider = async () => {
        await this.rawProvider.enable();
        let chainId = await this.web3.eth.getChainId();

        try {
            await this.rawProvider.request({ method: 'wallet_addEthereumChain', params: [ chainParameters ] });
            chainId = await this.web3.eth.getChainId();
        } catch (e) {}

        if (chainId !== CHAIN_ID) {
            toast.error(`Please switch to ${chainParameters.chainName} network`);
            await this.resetWallet();
            return false;
        }

        const accounts = await this.web3.eth.getAccounts();
        if (store.get('address') !== accounts[0] || !store.get('token')) {
            const { nonce, signature } = await generateSignature('SignIn', accounts[0]);
            const token = await this.rootStore.api.signIn(nonce, signature);
            store.set('address', accounts[0]);
            store.set('token', token);
        }
        runInAction(() => { this.address = accounts[0]; this.connected = true });
        await this.loadProfile();
        store.set('connected', true);
        this.rawProvider?.on?.('accountsChanged', this.resetWallet)
        this.rawProvider?.on?.('chainChanged', this.resetWallet);
        this.rawProvider?.on?.('disconnected', this.resetWallet);
        return true;
    }

    private get web3(): Web3 {
        return new Web3(this.rawProvider);
    }

    signMessage = async (message: string, address?: string) => {
        return await this.web3.eth.personal.sign(message, address || this.address, '');
    }

    updateProfile = async (input: ProfileInputType, removeAvatar: boolean, avatar: File | null) => {
        const { nonce, signature } = await generateSignature('UpdateProfile', this.address);
        const newProfile = await this.rootStore.api.updateProfile(input, removeAvatar, avatar, nonce, signature);
        runInAction(() => this.profile = newProfile);
    }

    get nftContract(): NFTContractContext {
        return new this.web3.eth.Contract(NFTContractAbi as any, ADDRESSES.nft) as any;
    }

    get paymentTokenContract(): PaymentTokenContractContext {
        return new this.web3.eth.Contract(PaymentTokenContractAbi as any, ADDRESSES.payment_token) as any;
    }

    get marketplaceContract(): MarketplaceContractContext {
        return new this.web3.eth.Contract(MarketplaceContractAbi as any, ADDRESSES.marketplace) as any;
    }

    get eggContract(): EggContractContext {
        return new this.web3.eth.Contract(EggContractAbi as any, ADDRESSES.egg) as any;
    }

    get spermContract(): SpermContractContext {
        return new this.web3.eth.Contract(SpermContractAbi as any, ADDRESSES.sperm) as any;
    }

    // @ts-ignore
    sendTransaction = async (tx: MethodReturnContext, onTxHash?: (txid: string) => any): Promise<TransactionReceipt> => {
        let gas;
        try {
            gas = await tx.estimateGas({ from: this.address });
        } catch (e) {
            console.error('estimate', e);
            toast.warning('Unable to estimate gas limit, please check transaction confirmation window')
        }
        const p = tx.send({ from: this.address, gas, gasPrice: '10000000000' });
        p.on('transactionHash', txid => onTxHash?.(txid));
        return p;
    }
}

export default WalletStore;
export { ADDRESSES };
