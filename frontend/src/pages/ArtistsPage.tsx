import React, { useEffect, useState } from 'react';
import Picsum from "../components/Picsum";
import SearchSvg from 'jsx:../images/search.svg';
import VanSvg from 'jsx:../images/v.svg';
import _ from "lodash";
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import { Api } from "../graphql/api";
import { ListProfile, ProfileType } from "../graphql/sdk";
import useAsyncEffect from "use-async-effect";
import Truncate from "react-truncate";

interface IArtistsPageProps {
}

const ArtistsItem = observer(({ profile }: { profile: ListProfile }) => (
    <div className="artists">
        <div className="artists__wrap">
            <Link className="artists__head" to={`/artists/@${profile.username}`}>
                <div className="artists__images">
                    {profile.avatar && <img src={profile.avatar} />}
                </div>
                <div className="artists__info">
                    <span className="artists__name">
                        @{profile.username}
                    </span>
                    <div className="artists__sum">
                        <VanSvg />
                        <span>399.99 VAN</span>
                    </div>
                </div>
            </Link>
            <span className="artists__body">
                {profile.bio}
            </span>
            <div className="artists__footer">
                <span className="artists__text">Recent artworks</span>
            </div>
            <div className="artists__gallery">
                {_.range(3).map(i => <div className="artists__img" key={i}><Picsum width={85} /></div>)}
            </div>
        </div>
    </div>
));

const ArtistsPage = ({}: IArtistsPageProps) => {
    const api = useInjection(Api);

    const [ page, setPage ] = useState(0);
    const [ q, setQ ] = useState('');
    const [ totalItems, setTotalItems ] = useState(0);
    const [ items, setItems ] = useState<ListProfile[]>([]);

    const loadPage = async (page: number, q_?: string) => {
        const { totalItems, items: newItems } = await api.getArtists(page, q_ || q);
        setTotalItems(totalItems);
        setItems(page === 0 ? newItems : items.concat(newItems));
        setPage(0)
    };

    useAsyncEffect(() => loadPage(0), []);

    const onQ = _.debounce(q => loadPage(0, q), 300);

    return (
        <main className='main'>
            <section className="artist-section">
                <div className="container">
                    <div className="gallery-header">
                        <h2 className="gallery-title">Artists</h2>
                        <div className="main-form__field">
                            <span className="search__btn">
                                <SearchSvg />
                            </span>
                            <input
                                className="main-form__input"
                                type="text"
                                placeholder="Search"
                                value={q}
                                onChange={e => { setQ(e.target.value); onQ(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="artists-wrap">
                        {items.map(p => (
                            <ArtistsItem key={p.id} profile={p} />
                        ))}
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
            </section>
        </main>
    )
};

export default ArtistsPage;
