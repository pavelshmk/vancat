import React, { useState } from 'react';
import classNames from "classnames";
import _ from "lodash";
import { ArtworkCard } from "../components/ArtworkCard";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import WalletStore from "../stores/WalletStore";
import { RouterStore } from "mobx-react-router";
import { toast } from "react-toastify";

interface ICabinetPageProps {
}

const CabinetPage = observer(({}: ICabinetPageProps) => {
    const walletStore = useInjection(WalletStore);
    const routerStore = useInjection(RouterStore);

    const [ ownedTab, setOwnedTab ] = useState(false);

    if (walletStore.initialized && !walletStore.connected) {
        routerStore.push('/');
        toast.error('You must connect a wallet to access this page');
        return null;
    }

    return (
        <main className='main'>
            <section className="main-section">
                <div className="container">
                    <ProfileSidebar editable profile={walletStore.profile} />
                    <div className="content">
                        <div className="main-wrap">
                            <section className="cabinet-section">
                                <div className="tabs js-tabs">
                                    <div className="tabs__wrap">
                                        <div className="tabs__head">
                                            <ul className="tabs__list js-tabs-nav">
                                                <li className={classNames('tabs__btn', { active: !ownedTab })} onClick={() => setOwnedTab(false)}>Created ({walletStore.profile?.createdArtworks.length})</li>
                                                <li className={classNames('tabs__btn', { active: ownedTab })} onClick={() => setOwnedTab(true)}>Owned ({walletStore.profile?.ownedArtworks.length})</li>
                                            </ul>
                                        </div>
                                        <div className="tabs__content active">
                                            <div className="gallery-wrap">
                                                {(ownedTab ? walletStore.profile?.ownedArtworks : walletStore.profile?.createdArtworks)?.map(artwork => <ArtworkCard key={artwork.id} artwork={artwork} />)}
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
});

export default CabinetPage;
