import React from 'react';
import Picsum from "../Picsum";
import VanSvg from 'jsx:../../images/v.svg';
import CopySvg from 'jsx:../../images/copy.svg';
import EditSvg from 'jsx:../../images/icons1.svg';
import CloseSvg from 'jsx:../../images/close.svg';
import { Profile, ProfileType } from "../../graphql/sdk";
import { trimAddress } from "../../utils/utils";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { useInjection } from "inversify-react";
import { ModalsEnum, ModalStore } from "../../stores/ModalStore";
import { observer } from "mobx-react";
import WalletStore from "../../stores/WalletStore";
import { RouterStore } from "mobx-react-router";

interface IProfileSidebarProps {
    editable?: boolean;
    profile: Profile;
}

const ProfileSidebar = observer(({ editable, profile }: IProfileSidebarProps) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);
    const routerStore = useInjection(RouterStore);

    return (
        <div className="menu">
            <div className="menu-head">
                <div className="menu-head__img">
                    {profile?.avatar && <img src={profile.avatar} />}
                </div>
                <span className="menu-head__name">@{profile?.username}</span>
            </div>
            <div className="menu-body">
                <div className="menu-body__col">
                    <div className="menu-body__row">
                        <span className="menu-body__name">Wallet:</span>
                        <div className="menu-body__btn">
                            <button className="btn bord" type="button" onClick={() => { copy(profile.address); toast.success('Address was copied to clipboard') }}>
                                <span className="img"/>
                                <CopySvg />
                                <span className="menu-body__sum">
                                    <span>{profile?.address && trimAddress(profile.address)}</span>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="menu-body__row">
                        <span className="menu-body__name">Earned:</span>
                        <div className="menu-body__btn">
                            <VanSvg />
                            <div className="menu-body__sum">
                                <span>399.99 VAN</span>
                            </div>
                        </div>
                    </div>
                    {profile?.bio && <div className="mebu-body__row">
                        <span className="menu-body__name">Bio:</span>
                    </div>}
                </div>
                {profile?.bio && <p className="menu-body__info">{profile?.bio}</p>}
            </div>
            <div className="menu-footer">
                {profile?.instagram && <a className="menu-footer__link" href={`https://instagram.com/${profile.instagram}`} target='_blank'>
                    <img src={require('url:../../images/menu/instargam2.svg')} alt="alt"/>
                    <span className="menu-footer__text">instagram</span>
                </a>}
                {profile?.twitter && <a className="menu-footer__link" href={`https://twitter.com/${profile.twitter}`} target='_blank'>
                    <img src={require('url:../../images/menu/twitter2.svg')} alt="alt"/>
                    <span className="menu-footer__text">twitter</span>
                </a>}
                {profile?.facebook && <a className="menu-footer__link" href={`https://facebook.com/${profile.facebook}`} target='_blank'>
                    <img src={require('url:../../images/menu/facebook2.svg')} alt="alt"/>
                    <span className="menu-footer__text">facebook</span>
                </a>}
                {profile?.telegram && <a className="menu-footer__link" href={`https://t.me/${profile.telegram}`} target='_blank'>
                    <img src={require('url:../../images/menu/telegram2.svg')} alt="alt"/>
                    <span className="menu-footer__text">telegram</span>
                </a>}
            </div>
            {editable && (
                <>
                    <button
                        className="btn secondary"
                        type="button"
                        onClick={() => {
                            console.log(modalStore.showModal(ModalsEnum.EditProfile, profile));
                        }}
                        style={{ marginBottom: 5 }}
                    >
                        <EditSvg />
                        <span>Edit</span>
                    </button>
                    <button
                        className="btn secondary"
                        type="button"
                        onClick={() => { walletStore.resetWallet(); routerStore.push('/'); toast.success('Wallet disconnected') }}
                        style={{ background: 'darkred' }}
                    >
                        <CloseSvg />
                        <span>Disconnect</span>
                    </button>
                </>
            )}
        </div>
    )
});

export default ProfileSidebar;
