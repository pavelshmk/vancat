import React, { useState } from 'react';
import LogoSvg from 'jsx:../svg/logo.svg';
import ExternalSvg from 'jsx:../svg/external.svg';
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import SettingsStore from "../stores/SettingsStore";
import WalletStore from "../stores/WalletStore";
import classNames from "classnames";
import { Link, NavLink } from 'react-router-dom';

interface IHeaderProps {
}

const Header = observer(({}: IHeaderProps) => {
    const walletStore = useInjection(WalletStore);
    const settingsStore = useInjection(SettingsStore);

    const [ burger, setBurger ] = useState(false);

    return (
        <header className="header">
            <div className="container">
                <Link to='/' className="logo">
                    <LogoSvg />
                </Link>
                <div className={classNames('menu-burger', { active: burger })}>
                    <nav className="nav">
                        <ul className="nav__list">
                            <li className="nav__item"><NavLink exact to='/' className="nav__link">Home</NavLink></li>
                            <li className="nav__item"><NavLink to='/artworks' className="nav__link">Gallery</NavLink></li>
                            <li className="nav__item"><NavLink to='/artists' className="nav__link">Artists</NavLink></li>
                            <li className="nav__item"><NavLink to='/tokenomics' className="nav__link">Tokenomics</NavLink></li>
                            <li className="nav__item"><a className="nav__link" href="#">VANPAD</a></li>
                        </ul>
                    </nav>
                    <div className="menu-burger__btn">
                        <div className="switcher">
                            <input className="switcher__input" type="checkbox" id="theme" name="theme" onChange={() => settingsStore.toggleTheme()}/>
                            <label className="switcher__label switcher__label_theme" htmlFor="theme">
                                <span className="switcher__dark display__blok">Dark Mode</span>
                                <span className="switcher__dark display__none">Light Mode</span>
                            </label>
                        </div>
                        {walletStore.address ? (
                            <>
                                <Link to='/cabinet' className='cabinet-link'>
                                    <div className="img-header">{walletStore.profile?.avatar && <img src={walletStore.profile.avatar} />}</div>
                                    <span className="user-name">@{walletStore.profile?.username}</span>
                                </Link>
                                <Link className="btn primary" type="button" to='/create'>Create NFT</Link>
                            </>
                        ) : (
                            <button className="btn secondary" type="button" onClick={() => walletStore.connect()}>Connect Wallet</button>
                        )}
                        <a href='https://vancat.army/vanswap' target='_blank' className="link">
                            VANSwap
                            <span className="images">
                                <ExternalSvg />
                            </span>
                        </a>
                    </div>
                </div>
                <div className={classNames('burger', { active: burger })} onClick={() => setBurger(!burger)}>
                    <div className="burger__wrap">
                        <div className="burger__btn"><span/><span/><span/></div>
                    </div>
                </div>
            </div>
        </header>
    )
});

export default Header;
