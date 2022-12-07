import React, { useState } from 'react';
import ProfileMenu from "../components/profile/ProfileSidebar";
import _ from "lodash";
import { ArtworkCard } from "../components/ArtworkCard";
import classNames from "classnames";
import { RouteComponentProps } from "react-router";
import { Profile, ProfileType } from "../graphql/sdk";
import useAsyncEffect from "use-async-effect";
import { useInjection } from "inversify-react";
import { Api } from "../graphql/api";

interface IProfilePageProps extends RouteComponentProps<{ aid: string }> {
}

const ArtistPage = ({ match: { params: { aid } } }: IProfilePageProps) => {
    const api = useInjection(Api);

    const [ ownedTab, setOwnedTab ] = useState(false);
    const [ profile, setProfile ] = useState<Profile>();

    useAsyncEffect(async () => {
        const profile = await api.getProfile(aid);
        setProfile(profile);
    }, [aid])

    return (
        <main className='main'>
            <section className="main-section">
                <div className="container">
                    <ProfileMenu profile={profile} />
                    <div className="content">
                        <div className="main-wrap">
                            <section className="cabinet-section">
                                <div className="tabs js-tabs">
                                    <div className="tabs__wrap">
                                        <div className="tabs__head">
                                            <ul className="tabs__list js-tabs-nav">
                                                <li className={classNames('tabs__btn', { active: !ownedTab })} onClick={() => setOwnedTab(false)}>Created ({profile?.createdArtworks.length})</li>
                                                <li className={classNames('tabs__btn', { active: ownedTab })} onClick={() => setOwnedTab(true)}>Owned ({profile?.ownedArtworks.length})</li>
                                            </ul>
                                        </div>
                                        <div className="tabs__content active">
                                            <div className="gallery-wrap">
                                                {(ownedTab ? profile?.ownedArtworks : profile?.createdArtworks)?.map(artwork => <ArtworkCard key={artwork.id} artwork={artwork} />)}
                                            </div>
                                        </div>
                                    </div>
                                    {/*<button className="btn secondary" type="button">Load more</button>*/}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
};

export default ArtistPage;
