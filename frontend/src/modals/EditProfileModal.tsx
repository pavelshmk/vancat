import React, { useEffect, useState } from 'react';
import Modal from "../components/Modal";
import CloseSvg from 'jsx:../images/close.svg';
import { observer } from "mobx-react";
import { useInjection } from "inversify-react";
import { ModalStore } from "../stores/ModalStore";
import InstagramSvg from 'jsx:../images/instagram.svg'
import TwitterSvg from 'jsx:../images/twitter.svg'
import FacebookSvg from 'jsx:../images/facebook.svg'
import TelegramSvg from 'jsx:../images/telegram.svg'
import { ProfileType } from "../graphql/sdk";
import _ from "lodash";
import WalletStore from "../stores/WalletStore";
import { toast } from "react-toastify";
import Button from "../components/Button";
import ImageUpload from "../components/ImageUpload";

interface IEditProfileModalProps {
    modalId: number;
    data: ProfileType;
}

const EditProfileModal = observer(({ modalId, data }: IEditProfileModalProps) => {
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);

    const [ profile, setProfile ] = useState<ProfileType>(_.cloneDeep(data));
    const [ loading, setLoading ] = useState(false);
    const [ avatar, setAvatar ] = useState<File | string>(data.avatar);
    const [ avatarDirty, setAvatarDirty ] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await walletStore.updateProfile(profile, avatarDirty && !avatar, avatarDirty ? avatar as File : null);
            toast.success('Profile was successfully updated');
            modalStore.hideModal(modalId);
        } catch (e) {
            toast.success('An error has occurred while updating profile');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal modalId={modalId}>
            <form className="main-form" onSubmit={onSubmit}>
                <div className="main-form__wrap">
                    <h2 className="main-form__title">Edit your Profile</h2>
                    <div className="main-form__close" onClick={() => modalStore.hideModal(modalId)}>
                        <CloseSvg />
                    </div>
                    <div className="main-form__field">
                        <div className="main-form__name">
                            <span>Username</span>
                        </div>
                        <div className="main-form__wraper">
                            <input className="main-form__input" type="text" value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })}/>
                            <span className="main-form__mail">@</span>
                        </div>
                    </div>
                    <div className="main-form__field">
                        <div className="main-form__name">
                            <span>BIO</span>
                        </div>
                        <textarea className="main-form__textarea" name="feedback" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })}/>
                    </div>
                    <div className="main-form__name">
                        <span>Profile Image</span>
                    </div>
                    <ImageUpload image={avatar} onChange={image => { setAvatar(image); setAvatarDirty(true) }} />
                    {/*<div className="main-form__profile">*/}
                    {/*    <div className="main-form__img">*/}
                    {/*        <img src="images/jo2.png" alt="alt"/>*/}
                    {/*    </div>*/}
                    {/*    <div className="main-form__file">*/}
                    {/*        <span className="main-form__fil">file.name</span>*/}
                    {/*        <span className="main-form__fil">5000 mb</span>*/}
                    {/*        <button className="main-form__btn" type="button">*/}
                    {/*            <img src="images/4.svg" alt="alt"/>*/}
                    {/*            <span className="main-form__delete">delete file</span>*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="main-contact">
                        <span className="main-form__name">Contacts</span>
                        <div className="main-contact__wrap">
                            <div className="main-contact__row">
                                <div className="main-contact__img">
                                    <InstagramSvg />
                                </div>
                                <div className="main-contact__text">
                                    <span>instagram</span>
                                </div>
                            </div>
                            <div className="main-contact__field">
                                <span>https://instagram.com/</span>
                                <input className="main-form__input" type="text" value={profile.instagram} onChange={e => setProfile({ ...profile, instagram: e.target.value })} />
                            </div>
                        </div>
                        <div className="main-contact__wrap">
                            <div className="main-contact__row">
                                <div className="main-contact__img">
                                    <TwitterSvg />
                                </div>
                                <div className="main-contact__text">
                                    <span>twitter</span>
                                </div>
                            </div>
                            <div className="main-contact__field">
                                <span>https://twitter.com/</span>
                                <input className="main-form__input" type="text" value={profile.twitter} onChange={e => setProfile({ ...profile, twitter: e.target.value })} />
                            </div>
                        </div>
                        <div className="main-contact__wrap">
                            <div className="main-contact__row">
                                <div className="main-contact__img">
                                    <FacebookSvg />
                                </div>
                                <div className="main-contact__text">
                                    <span>facebook</span>
                                </div>
                            </div>
                            <div className="main-contact__field">
                                <span>https://facebook.com/</span>
                                <input className="main-form__input" type="text" value={profile.facebook} onChange={e => setProfile({ ...profile, facebook: e.target.value })} />
                            </div>
                        </div>
                        <div className="main-contact__wrap">
                            <div className="main-contact__row">
                                <div className="main-contact__img">
                                    <TelegramSvg />
                                </div>
                                <div className="main-contact__text">
                                    <span>telegram</span>
                                </div>
                            </div>
                            <div className="main-contact__field">
                                <span>https://t.me/</span>
                                <input className="main-form__input" type="text" value={profile.telegram} onChange={e => setProfile({ ...profile, telegram: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="modal__btn">
                        <Button className="primary" loading={loading} type="submit">Save changes</Button>
                    </div>
                </div>
            </form>
        </Modal>
    )
});

export default EditProfileModal;
