import React, { useRef, useState } from 'react';
import { useInjection } from "inversify-react";
import WalletStore, { ADDRESSES } from "../stores/WalletStore";
import { RouterStore } from "mobx-react-router";
import { toast } from "react-toastify";
import { observer } from "mobx-react";
import Button from "../components/Button";
import { MAX_UINT256, processRequestError, toBN } from "../utils/utils";
import { Api } from "../graphql/api";
import { ArtworkCategory, GenProcess } from "../graphql/sdk";
import useAsyncEffect from "use-async-effect";
import { useForm } from "react-hook-form";
import { parseInt } from "lodash";
import BN from "bignumber.js";
import Timeout from "await-timeout";
import MiddleTruncate from '../components/react-middle-truncate';

interface IAutomaticallyPageProps {
}

interface IFormValues {
    title: string;
    category: ArtworkCategory;
    description: string;
    exclusiveInfo: string;
    royalties: number;
}

const CreateGeneratePage = observer(({}: IAutomaticallyPageProps) => {
    const walletStore = useInjection(WalletStore);
    const routerStore = useInjection(RouterStore);
    const api = useInjection(Api);

    const { register, handleSubmit, setValue, watch } = useForm<IFormValues>();

    const [ mintPrice, setMintPrice ] = useState<number>();
    const [ approved, setApproved ] = useState(false);
    const [ approveLoading, setApproveLoading ] = useState(false);
    const [ balance, setBalance ] = useState<number>();
    const [ loading, setLoading ] = useState(false);
    const [ genProcess, setGenProcess ] = useState<GenProcess>();
    const [ spermBalance, setSpermBalance ] = useState<BN>();
    const [ eggBalance, setEggBalance ] = useState<BN>();

    const loadGenProcess = async () => {
        if (!walletStore.initialized || !walletStore.connected || loading)
            return;
        setGenProcess(await api.getGenProcess());
        setSpermBalance(toBN(await walletStore.spermContract.methods.balanceOf(walletStore.address).call()).div('1e18'));
        setEggBalance(toBN(await walletStore.eggContract.methods.balanceOf(walletStore.address).call()).div('1e18'));
    }

    useAsyncEffect(loadGenProcess, [walletStore.lastBlock]);
    useAsyncEffect(async () => {
        if (!walletStore.initialized || !walletStore.connected) return;
        const mintPrice = await walletStore.nftContract.methods.mintPrice().call();
        setMintPrice(parseInt(mintPrice) / 10**18);
        await checkAllowance();
        const balance = await walletStore.paymentTokenContract.methods.balanceOf(walletStore.address).call();
        setBalance(parseInt(balance) / 10**18);
    }, [walletStore.initialized, walletStore.connected]);

    if (walletStore.initialized && !walletStore.connected) {
        routerStore.push('/');
        toast.error('You must connect a wallet to access this page');
        return null;
    }

    const onEjaculate = async () => {
        setLoading(true);
        try {
            const contract = walletStore.spermContract;
            await walletStore.sendTransaction(contract.methods.ejaculation(), async txid => await api.genEjaculation(txid));
            await loadGenProcess();
            toast.success('Ejaculation transaction sent');
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    const onOvulate = async () => {
        setLoading(true);
        try {
            const contract = walletStore.eggContract;
            await walletStore.sendTransaction(contract.methods.ovulation(), async txid => await api.genOvulation(txid));
            await loadGenProcess();
            toast.success('Ovulation transaction sent');
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    const onGenerate = async () => {
        setLoading(true);
        try {
            await api.genDNA();
            await loadGenProcess();
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    const onMint = async (data: IFormValues) => {
        setLoading(true);
        try {
            data.royalties = parseInt(data.royalties as any);
            const args = await api.createGeneratedNft(data, walletStore.address);
            await walletStore.sendTransaction(walletStore.nftContract.methods.mint(...args));
            toast.success('Your NFT was successfully created');
            routerStore.push(`/artworks/${args[1].slice(2)}`);
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    const checkAllowance = async () => {
        await Timeout.set(0);
        const approved = await walletStore.paymentTokenContract.methods.allowance(walletStore.address, ADDRESSES.nft).call();
        setApproved(toBN(approved).div('1e18').gte(mintPrice));
    }

    const onApprove = async () => {
        try {
            setApproveLoading(true);
            await walletStore.sendTransaction(walletStore.paymentTokenContract.methods.approve(ADDRESSES.nft, MAX_UINT256));
            await checkAllowance();
        } catch (e) {
            toast.error('An error has occurred');
        } finally {
            setApproveLoading(false);
        }
    }

    const isEjaculation = !genProcess;
    const isOvulation = genProcess && genProcess.ejaculationTx && !genProcess.ovulationTx
    const isDNA = genProcess && genProcess.ejaculationConfirmed && genProcess.ovulationConfirmed && genProcess.dNA.length === 0;
    const isMint = genProcess && genProcess.ejaculationTx && genProcess.ovulationTx && genProcess.dNA.length > 0;

    return (
        <main className='main'>
            <section className="automatically-section">
                <div className="container">
                    <div className="automatically">
                        <div className="automatically__wrap">
                            <div className="automatically__intro">
                                <h2 className="section-title">Special NFT</h2>
                                <span className="section-text">Generate automatically</span>
                            </div>
                            <div className="automatically__body">
                                <div className="automatically__row">
                                    <div className="automatically__col">
                                        <span className="automatically__text">Your VCSPERM balance:</span>
                                        <span className="automatically__text">{spermBalance?.toFixed(0)}</span>
                                    </div>
                                    <Button className="primary" type="button" disabled={!isEjaculation} loading={isEjaculation && loading} onClick={onEjaculate}>Ejaculate VCSPERM</Button>
                                    <div className="automatically__warning">
                                        <img src={require('url:../images/warning.svg')} alt="alt"/>
                                        <span className="automatically__cost">Cost: 10 Million VCSPERM</span>
                                    </div>
                                </div>
                                <div className="automatically__row">
                                    <div className="automatically__col">
                                        <span className="automatically__text">Your VCEGG balance:</span>
                                        <span className="automatically__text">{eggBalance?.toFixed(0)}</span>
                                    </div>
                                    <Button className="btn primary" type="button" disabled={!isOvulation} loading={isOvulation && loading} onClick={onOvulate}>Ovulate VCEGG</Button>
                                    <div className="automatically__warning">
                                        <img src={require('url:../images/warning.svg')} alt="alt"/>
                                        <span className="automatically__cost">Cost: 1 VCEGG</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="generate-section">
                <div className="container">
                    <div className="generate">
                        <div className="generate__wrap">
                            <div className="generate__body">
                                {genProcess?.ejaculationTx && (
                                    <div className="generate__col">
                                        <span className="generate__color">Transaction is {genProcess.ejaculationConfirmed ? 'confirmed' : 'sent'}</span>
                                        <span className="generate__text">VCSPERM ejaculation transaction hash:</span>
                                        <span className="generate__code"><MiddleTruncate text={genProcess.ejaculationTx} /></span>
                                    </div>
                                )}
                                {genProcess?.ovulationTx && (
                                    <div className="generate__col">
                                        <span className="generate__color">Transaction is {genProcess.ovulationConfirmed ? 'confirmed' : 'sent'}</span>
                                        <span className="generate__text">VCEGG ovulation transaction hash:</span>
                                        <span className="generate__code"><MiddleTruncate text={genProcess.ovulationTx} /></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="special-section">
                <div className="container">
                    <div className="special">
                        <div className="special__wrap">
                            <div className="special__btn">
                                <Button className="btn primary" type="button" disabled={!isDNA} loading={isDNA && loading} onClick={onGenerate}>Generate DNA</Button>
                            </div>
                            {genProcess?.dNA.length > 0 && (
                                <div className="special__info">
                                    <span className="special__text">DNA is successfully created</span>
                                    <span className="special__code">Your NFT’s DNA code:</span>
                                    <span className="special__pasword">{genProcess.dNA.join(' ')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <section className="tobig-section">
                <div className="container">
                    <div className="change">
                        <div className="change__wrap">
                            <form className="main-form" onSubmit={handleSubmit(onMint)}>
                                <div className="main-form__wrap">
                                    <div className="main-form__row">
                                        <div className="main-form__field">
                                            <div className="main-form__name">
                                                <span>Title</span>
                                            </div>
                                            <div className="main-form__wraper">
                                                <input className="main-form__input" type="text"  {...register('title', { required: true })} />
                                            </div>
                                        </div>
                                        <div className="main-form__field">
                                            <div className="main-form__name">
                                                <span>Category</span>
                                            </div>
                                            <div className="main-form__wraper">
                                                <select className='main-form__input' {...register('category', { required: true })}>
                                                    <option value={ArtworkCategory.Games}>Games</option>
                                                    <option value={ArtworkCategory.Art}>Art</option>
                                                    <option value={ArtworkCategory.Photo}>Photo</option>
                                                    <option value={ArtworkCategory.Music}>Music</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="main-form__field">
                                        <div className="main-form__name">
                                            <span>Description</span>
                                        </div>
                                        <textarea className="main-form__textarea" name="feedback" {...register('description')}/>
                                    </div>
                                    <span className="main-form__name">Artwork</span>
                                    <div className="main-form__row">
                                        <div className="main-form__profile">
                                            {genProcess?.image ? (
                                                <div className="main-form__img-large">
                                                    <img src={genProcess.image} alt="alt"/>
                                                </div>
                                            ) : (
                                                <p>DNA is not generated yet</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="main-contact">
                                        {genProcess?.dNA && (
                                            <div className="main-contact__code">
                                                <span>NFT’s DNA code{': '}</span>
                                                <span className="main-contact__pasword">{genProcess.dNA.join(' ')}</span>
                                            </div>
                                        )}
                                        <div className="main-form__field">
                                            <div className="main-form__name">
                                                <span>Exclusive info for buyer</span>
                                            </div>
                                            <textarea className="main-form__textarea" name="feedback" {...register('exclusiveInfo')} />
                                        </div>
                                        <div className="main-form__row">
                                            <div className="main-form__field">
                                                <div className="main-form__name">
                                                    <span>Creator Royalties (max value is 20%)</span>
                                                </div>
                                                <input className="main-form__input" type="number" {...register('royalties', { max: 20, min: 0, required: true })} />
                                            </div>
                                        </div>
                                    </div>
                                    <p className='main-form__name'>Mint fee: {mintPrice} VANCAT</p>
                                    {balance < mintPrice ? (
                                        <button className="btn primary" disabled type="submit">Insufficient VANCAT</button>
                                    ) : (
                                        approved ? (
                                            <Button className="btn primary" disabled={!isMint} loading={isMint && loading} type="submit">Create</Button>
                                        ) : (
                                            <Button className='btn primary' type='button' onClick={onApprove} loading={approveLoading}>Approve VANCAT</Button>
                                        )
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
});

export default CreateGeneratePage;
