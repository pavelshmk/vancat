import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import WalletStore from "../stores/WalletStore";
import { RouterStore } from "mobx-react-router";
import { toast } from "react-toastify";

interface ICreatingPageProps {
}

const CreatePage = observer(({}: ICreatingPageProps) => {
    const walletStore = useInjection(WalletStore);
    const routerStore = useInjection(RouterStore);

    if (walletStore.initialized && !walletStore.connected) {
        routerStore.push('/');
        toast.error('You must connect a wallet to access this page');
        return null;
    }

    return (
        <main className='main'>
            <section className="creating-section">
                <div className="container">
                    <div className="creating">
                        <h2 className="section-title text-center">Create NFT</h2>
                        <div className="creating__wrap">
                            <div className="creating__col">
                                <Link to='/create/generate' className="btn secondary" type="button">Generate automatically</Link>
                                <span className="creating__text">Special NFT</span>
                            </div>
                            <div className="creating__col">
                                <Link to='/create/own' className="btn secondary" type="button">Create my own</Link>
                                <span className="creating__text">Standard NFT</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
});

export default CreatePage;
