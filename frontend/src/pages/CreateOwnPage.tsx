import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import { useInjection } from "inversify-react";
import { Api } from "../graphql/api";
import WalletStore, { ADDRESSES } from "../stores/WalletStore";
import { ArtworkCategory } from "../graphql/sdk";
import { MAX_UINT256, processRequestError } from "../utils/utils";
import { RouterStore } from "mobx-react-router";
import { toast } from "react-toastify";
import useAsyncEffect from "use-async-effect";
import { parseInt } from "lodash";
import Button from "../components/Button";

interface IChangePageProps {
}

interface IFormValues {
    title: string;
    category: ArtworkCategory;
    description: string;
    artwork: File;
    exclusiveInfo: string;
    royalties: number;
}

const CreateOwnPage = ({}: IChangePageProps) => {
    const api = useInjection(Api);
    const walletStore = useInjection(WalletStore);
    const routerStore = useInjection(RouterStore);

    const { register, handleSubmit, setValue, watch } = useForm<IFormValues>();
    const artwork = watch('artwork');

    const [ mintPrice, setMintPrice ] = useState<number>();
    const [ approved, setApproved ] = useState(false);
    const [ balance, setBalance ] = useState<number>();
    const [ preLoading, setPreLoading ] = useState(true);
    const [ loading, setLoading ] = useState(false);

    useAsyncEffect(async () => {
        if (!walletStore.initialized || !walletStore.connected) return;
        const mintPrice = await walletStore.nftContract.methods.mintPrice().call();
        setMintPrice(parseInt(mintPrice) / 10**18);
        await checkAllowance();
        const balance = await walletStore.paymentTokenContract.methods.balanceOf(walletStore.address).call();
        setBalance(parseInt(balance) / 10**18);
        setPreLoading(false);
    }, [walletStore.initialized, walletStore.connected]);

    const checkAllowance = async () => {
        const approved = await walletStore.paymentTokenContract.methods.allowance(walletStore.address, ADDRESSES.nft).call();
        setApproved(parseInt(approved) / 10**18 >= mintPrice);
    }

    const onApprove = async () => {
        setLoading(true);
        try {
            await walletStore.sendTransaction(walletStore.paymentTokenContract.methods.approve(ADDRESSES.nft, MAX_UINT256));
            await checkAllowance();
        } catch (e) {
            toast.error('An error has occurred');
        } finally {
            setLoading(false);
        }
    }

    const onSubmit = async (data: IFormValues) => {
        setLoading(true);
        try {
            data.royalties = parseInt(data.royalties as any);
            const args = await api.createStandardNft(data, walletStore.address);
            await walletStore.sendTransaction(walletStore.nftContract.methods.mint(...args));
            toast.success('Your NFT was successfully created');
            routerStore.push(`/artworks/${args[1].slice(2)}`);
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    if (walletStore.initialized && !walletStore.connected) {
        routerStore.push('/');
        toast.error('You must connect a wallet to access this page');
        return null;
    }

    return (
        <main className='main'>
            <section className="change-section">
                <div className="container">
                    <div className="change">
                        <div className="change__wrap">
                            <form className="main-form" onSubmit={handleSubmit(onSubmit)}>
                                <div className="main-form__wrap">
                                    <div className="main-intro">
                                        <h2 className="main-form__title">Standard NFT</h2>
                                        <span className="main-text">Upload your own</span>
                                    </div>
                                    <div className="main-form__row">
                                        <div className="main-form__field">
                                            <div className="main-form__name">
                                                <span>Title</span>
                                            </div>
                                            <div className="main-form__wraper">
                                                <input className="main-form__input" type="text" {...register('title', { required: true })} />
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
                                        <Dropzone accept={['image/jpeg', 'image/png', 'image/gif']} onDrop={val => val[0] && (val[0].size <= 20 * 10**20) && setValue('artwork', val[0])}>
                                            {({ getRootProps, getInputProps }) => (
                                                <div className='main-form__profile' {...getRootProps()}>
                                                    {artwork ? (
                                                        <>
                                                            <div className="main-form__img">
                                                                <img src={artwork instanceof File ? URL.createObjectURL(artwork) : artwork} alt="photo user"/>
                                                            </div>
                                                            <div className="main-form__file">
                                                                <span className="main-form__fil">{artwork.name}</span>
                                                                <span className="main-form__fil">{artwork.size} B</span>
                                                                <button className="main-form__btn" type="button">
                                                                    <img src={require('url:../images/4.svg')} alt="alt"/>
                                                                    <span className="main-form__delete" onClick={() => setValue('artwork', undefined)}>delete file</span>
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <label className="label-img label-img_small" htmlFor="input-img">
                                                            <p className="main-form__fil">JPG, PNG or GIF. <br/> 20MB
                                                                max size.</p>
                                                            <p className="main-form__fil">Drag and drop an image here, or click to
                                                                browse</p>
                                                            <input type='file' {...getInputProps()} />
                                                        </label>
                                                    )}
                                                </div>
                                            )}
                                        </Dropzone>
                                    </div>
                                    <div className="main-contact">
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
                                            <Button className="primary" type="submit" disabled={preLoading} loading={loading}>Create</Button>
                                        ) : (
                                            <Button className='primary' type='button' disabled={preLoading} loading={loading} onClick={onApprove}>Approve VANCAT</Button>
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
};

export default CreateOwnPage;
