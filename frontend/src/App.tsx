import React from 'react';
import Web3 from "web3";
import { Route, Switch } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import Header from "./components/Header";
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import SettingsStore from "./stores/SettingsStore";
import classNames from "classnames";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/scss/main.scss';
import Footer from "./components/Footer";
import TokenomicsPage from "./pages/TokenomicsPage";
import ArtistsPage from "./pages/ArtistsPage";
import CreateGeneratePage from "./pages/CreateGeneratePage";
import ArtworkPage from "./pages/ArtworkPage";
import CabinetPage from "./pages/CabinetPage";
import CreateOwnPage from "./pages/CreateOwnPage";
import CreatePage from "./pages/CreatePage";
import GalleryPage from "./pages/GalleryPage";
import ArtistPage from "./pages/ArtistPage";
import ModalsContainer from "./modals";

const App = observer(() => {
    const settingsStore = useInjection(SettingsStore);

    return (
        <>
            <div className={classNames('wrapper', settingsStore.darkTheme && 'theme-dark')}>
                <Header />
                <Switch>
                    <Route exact path='/' component={IndexPage} />
                    <Route path='/tokenomics' component={TokenomicsPage} />
                    <Route path='/artists/:aid' component={ArtistPage} />
                    <Route path='/artists' component={ArtistsPage} />
                    <Route path='/artworks/:uuid' component={ArtworkPage} />
                    <Route path='/artworks' component={GalleryPage} />
                    <Route path='/cabinet' component={CabinetPage} />
                    <Route path='/create/own' component={CreateOwnPage} />
                    <Route path='/create/generate' component={CreateGeneratePage} />
                    <Route path='/create' component={CreatePage} />
                </Switch>
                <Footer />
                <ModalsContainer />
            </div>
            <ToastContainer theme={settingsStore.darkTheme ? 'dark' : 'light'} position='bottom-right' />
        </>
    )
});

export default App;
