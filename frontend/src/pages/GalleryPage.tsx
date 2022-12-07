import React, { useState } from 'react';

import SearchSvg from 'jsx:../images/search.svg';
import AllSvg from 'jsx:../images/basket.svg';
import GameSvg from 'jsx:../images/game.svg';
import ArtSvg from 'jsx:../images/art.svg';
import PhotoSvg from 'jsx:../images/photo.svg';
import MusicSvg from 'jsx:../images/music.svg';
import classNames from "classnames";
import _ from "lodash";
import { ArtworkCard } from "../components/ArtworkCard";
import { useInjection } from "inversify-react";
import { Api } from "../graphql/api";
import { ArtworkCategory, ListArtwork, ListProfile } from "../graphql/sdk";
import useAsyncEffect from "use-async-effect";
import { observer } from "mobx-react";
import WalletStore from "../stores/WalletStore";

interface IGalleryPageProps {
}

const GalleryPage = observer(({}: IGalleryPageProps) => {
    const api = useInjection(Api);
    const walletStore = useInjection(WalletStore);

    const [ page, setPage ] = useState(0);
    const [ q, setQ ] = useState('');
    const [ category, setCategory ] = useState<ArtworkCategory>();
    const [ totalItems, setTotalItems ] = useState(0);
    const [ items, setItems ] = useState<ListArtwork[]>([]);

    const loadPage = async (page: number, q_?: string) => {
        const { totalItems, items: newItems } = await api.getGallery(page, q_ || q, category);
        setTotalItems(totalItems);
        setItems(page === 0 ? newItems : items.concat(newItems));
        setPage(0)
    };

    useAsyncEffect(() => loadPage(0), [category]);
    useAsyncEffect(() => loadPage(page, q), [walletStore.lastBlock]);

    const onQ = _.debounce(q => loadPage(0, q), 300);

    return (
        <main className='main'>
            <section className="gallery-section">
                <div className="container">
                    <div className="gallery-header">
                        <h2 className="gallery-title">Explore</h2>
                        <div className="main-form__field">
                            <button className="search__btn" type="button">
                                <SearchSvg />
                            </button>
                            <input
                                className="main-form__input"
                                type="text"
                                placeholder="Search"
                                value={q}
                                onChange={e => { setQ(e.target.value); onQ(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="tabs js-tabs">
                        <div className="tabs__wrap">
                            <div className="tabs__head">
                                <ul className="tabs__list js-tabs-nav">
                                    <li className={classNames('tabs__btn', { active: !category })} onClick={() => setCategory(undefined)}>
                                        <span className="tabs__subtext"><AllSvg /><span className="tabs__name">All</span></span>
                                    </li>
                                    <li className={classNames('tabs__btn', { active: category === ArtworkCategory.Games })} onClick={() => setCategory(ArtworkCategory.Games)}>
                                        <span className="tabs__subtext"><GameSvg /><span className="tabs__name">Games</span></span>
                                    </li>
                                    <li className={classNames('tabs__btn', { active: category === ArtworkCategory.Art })} onClick={() => setCategory(ArtworkCategory.Art)}>
                                        <span className="tabs__subtext"><ArtSvg /><span className="tabs__name">Art</span></span>
                                    </li>
                                    <li className={classNames('tabs__btn', { active: category === ArtworkCategory.Photo })} onClick={() => setCategory(ArtworkCategory.Photo)}>
                                        <span className="tabs__subtext"><PhotoSvg /><span className="tabs__name">Photo</span></span>
                                    </li>
                                    <li className={classNames('tabs__btn', { active: category === ArtworkCategory.Music })} onClick={() => setCategory(ArtworkCategory.Music)}>
                                        <span className="tabs__subtext"><MusicSvg /><span className="tabs__name">Music</span></span>
                                    </li>
                                </ul>
                            </div>
                            <div className="tabs__content active">
                                <div className="gallery-wrap">
                                    {items.map(a => (
                                        <ArtworkCard key={a.id} artwork={a} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        {totalItems > (page+1) * 50 && (
                            <button
                                className="btn secondary load"
                                type="button"
                                onClick={() => { loadPage(page+1); setPage(page+1) }}
                            >
                                Load more
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
});

export default GalleryPage;
