import React, { useState } from 'react';
import VanSvg from 'jsx:../images/v.svg';
import classNames from "classnames";
import { RouteComponentProps } from "react-router";
import { Artwork, ArtworkEvent, ArtworkType } from "../graphql/sdk";
import useAsyncEffect from "use-async-effect";
import { useInjection } from "inversify-react";
import { Api } from "../graphql/api";
import { Link } from 'react-router-dom';
import Moment from "react-moment";
import { observer } from "mobx-react";
import WalletStore, { ADDRESSES } from "../stores/WalletStore";
import { ModalsEnum, ModalStore } from "../stores/ModalStore";
import { MAX_UINT256, processRequestError, toBN, trimAddress } from "../utils/utils";
import { toast } from "react-toastify";
import Button from "../components/Button";

interface IBuyPageProps extends RouteComponentProps<{ uuid: string }> {
}

const EventItem = ({ event }: { event: ArtworkEvent }) => {


    const mainUser = event.event === 'mint' ? event.toAddress : event.fromAddress;
    const mainUserData = event.event === 'mint' ? event.toAddressData : event.fromAddressData;

    let data = JSON.parse(event.data);
    return (
        <div className="buy-footer__row">
            <div className="buy-footer__content">
                {mainUserData && (
                    <div className="buy-footer__img">
                        {mainUserData.avatar && <img src={mainUserData.avatar} alt="alt"/>}
                    </div>
                )}
                <div className="buy-footer__text">
                    <span className="buy-footer__name">{mainUserData ? <Link to={`/artists/@${mainUserData.username}`}>@{mainUserData.username}</Link> : trimAddress(mainUser)}</span>
                    <span className="buy-footer__date"><Moment date={event.datetime} format='l LT' /></span>
                </div>
            </div>
            {event.event === 'mint' && (
                <span className="buy-footer__date">Created</span>
            )}
            {event.event === 'transfer' && (
                <div className="buy-footer__order">
                    <span className="buy-footer__date">Transfer to:</span>
                    <div className="buy-footer__info">

                        {/*<div className="buy-footer__images">*/}
                        {/*    <VanSvg />*/}
                        {/*    <span className="buy-footer__van">399.99 VAN</span>*/}
                        {/*</div>*/}
                        <div className="buy-footer__sum"><span>{trimAddress(event.toAddress)}</span></div>
                    </div>
                </div>
            )}
            {event.event === 'list' && (
                <div className="buy-footer__order">
                    <span className="buy-footer__date">Listed for:</span>
                    <div className="buy-footer__info">
                        <div className="buy-footer__images">
                            <VanSvg />
                            <span className="buy-footer__van">{data.price} VAN</span>
                        </div>
                        {/*<div className="buy-footer__sum"><span>$ 1399.99 USD</span></div>*/}
                    </div>
                </div>
            )}
            {event.event == 'cancel' && (
                <div className="buy-footer__order">
                    <span className="buy-footer__date">Cancelled sale</span>
                </div>
            )}
            {event.event === 'buy' && (
                <div className="buy-footer__order">
                    <span className="buy-footer__date">Bought for:</span>
                    <div className="buy-footer__info">
                        <div className="buy-footer__images">
                            <VanSvg />
                            <span className="buy-footer__van">{data.price} VAN</span>
                        </div>
                        {/*<div className="buy-footer__sum"><span>$ 1399.99 USD</span></div>*/}
                    </div>
                </div>
            )}
        </div>
    )
}

const ArtworkPage = observer(({ match: { params: { uuid } } }: IBuyPageProps) => {
    const api = useInjection(Api);
    const walletStore = useInjection(WalletStore);
    const modalStore = useInjection(ModalStore);

    const [ descriptionTab, setDescriptionTab ] = useState(true);
    const [ artwork, setArtwork ] = useState<Artwork>();
    const [ loading, setLoading ] = useState(false);

    useAsyncEffect(async () => {
        setArtwork(await api.getArtwork(uuid));
    }, [uuid, walletStore.lastBlock]);

    const cancelSale = async () => {
        setLoading(true);
        try {
            const marketplace = walletStore.marketplaceContract;
            await walletStore.sendTransaction(marketplace.methods.cancel(artwork.activeListing.listingId.toString()));
            toast.success('Listing cancelled successfully');
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    const buy = async () => {
        setLoading(true);
        try {
            const paymentToken = walletStore.paymentTokenContract;
            const marketplace = walletStore.marketplaceContract;
            const allowance = toBN(await paymentToken.methods.allowance(walletStore.address, ADDRESSES.marketplace).call()).div('1e18');
            if (allowance.lt(artwork.activeListing.price)) {
                await walletStore.sendTransaction(paymentToken.methods.approve(ADDRESSES.marketplace, MAX_UINT256));
                toast.success('Approved successfully');
            }
            const balance = toBN(await paymentToken.methods.balanceOf(walletStore.address).call()).div('1e18');
            if (balance.lt(artwork.activeListing.price)) {
                toast.error('Insufficient balance');
                return;
            }
            await walletStore.sendTransaction(marketplace.methods.buy(artwork.activeListing.listingId.toString()));
            toast.success('Artwork was bought successfully');
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className='main'>
            <section className="buy-section">
                <div className="container">
                    <div className="buy">
                        <div className="buy__wrap">
                            <div className="buy__img">
                                <img src={artwork?.artwork.url} />
                                {/*<Picsum width={512} />*/}
                            </div>
                        </div>
                        <div className="buy-wrap">
                            <div className="buy-head">
                                <div className="buy-head__info">
                                    <h2 className="buy-title">{artwork?.title}</h2>
                                    {artwork?.minterData ? (
                                        <Link to={`/artists/@${artwork.minterData.username}`} className="buy-head__wrap">
                                            <div className="buy-head__price">
                                                {artwork.minterData.avatar && <img src={artwork.minterData.avatar} />}
                                            </div>
                                            <div className="buy-head__text white-col">
                                                <span>@{artwork.minterData.username}</span>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="buy-head__wrap">
                                            <div className="buy-head__price">
                                                {/*<Picsum width={24} />*/}
                                            </div>
                                            <div className="buy-head__text white-col">
                                                <span>{artwork?.minter}</span>
                                            </div>
                                        </div>
                                    )}
                                    <span className="price-text">Price</span>
                                    <div className="buy-head__sum">
                                        <div className="buy-head__img">
                                            <VanSvg />
                                            <span className="buy-head__van">
                                                {/*399.99 VAN*/}
                                                {artwork?.activeListing ? `${toBN(artwork.activeListing.price).toFixed(2)} VAN` : 'Not on sale'}</span>
                                        </div>

                                        <span className="buy-head__text">{/*$ 1399.99 USD*/}</span>
                                        {/*<button className="btn primary" type="button">Buy</button>*/}
                                        {walletStore.connected && (artwork?.owner === walletStore.address ? (
                                            artwork?.activeListing ? (
                                                <Button className="btn primary" type="button" onClick={() => cancelSale()} loading={loading}>Cancel</Button>
                                            ) : (
                                                <Button className="btn primary" type="button" onClick={() => modalStore.showModal(ModalsEnum.Sell, { artworkId: artwork.tokenId })} loading={loading}>Sell</Button>
                                            )
                                        ) : (
                                            artwork?.activeListing && <Button className="btn primary" type="button" onClick={() => buy()} loading={loading}>Buy</Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="buy-body">
                                <div className="buy-body__wrap">
                                    <div className="buy-body__col">
                                        <div className="buy-body__row">
                                            <span className="buy-body__color">Created:</span>
                                            <span className="buy-body__text"><Moment date={artwork?.createdAt} format='l LT' /></span>
                                        </div>
                                        <div className="buy-body__row">
                                            <span className="buy-body__color">Owned by:</span>
                                            <span className="buy-body__gadient">
                                                {artwork?.ownerData ? <Link to={`/artists/@${artwork.ownerData.username}`}>@{artwork.ownerData.username}</Link> : artwork?.owner}
                                            </span>
                                        </div>
                                        <div className="buy-body__row">
                                            <span className="buy-body__color">Category:</span>
                                            <span className="buy-body__gadient">{artwork?.category}</span>
                                        </div>
                                        <div className="buy-body__row">
                                            <span className="buy-body__color">Royalty:</span>
                                            <span className="buy-body__text">{artwork?.royalties}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tabs js-tabs">
                                <div className="tabs__wrap">
                                    <div className="tabs__head">
                                        <ul className="tabs__list js-tabs-nav">
                                            <li className={classNames('tabs__btn', { active: descriptionTab })} onClick={() => setDescriptionTab(true)}>Description</li>
                                            <li className={classNames('tabs__btn', { active: !descriptionTab })} onClick={() => setDescriptionTab(false)}>History</li>
                                        </ul>
                                    </div>
                                    {descriptionTab && (
                                        <div className="tabs__content active">
                                            <div className="buy-footer">
                                                <p className="buy-footer__text">{artwork?.description}</p>
                                            </div>
                                        </div>
                                    )}
                                    {!descriptionTab && (
                                        <div className="tabs__content active">
                                            <div className="buy-footer__wrap">
                                                {artwork?.events.map(evt => (
                                                    <EventItem event={evt} key={evt.id} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
});

export default ArtworkPage;
