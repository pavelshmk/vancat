import { action, makeObservable, observable, runInAction } from "mobx";
import defer from "defer-promise";
import RootStore from "./RootStore";

export enum ModalsEnum {
    _,
    Loading,
    Prompt,
    EditProfile,
    Sell,
    Connect,
}

export interface ModalEntry {
    key: ModalsEnum;
    data?: any;
}

export class ModalStore {
    activeModals = observable.array<ModalEntry>([]);

    constructor(private readonly rootStore: RootStore) {
        makeObservable(this);
        // makeAutoObservable(this);
    }

    @action showModal (key: ModalsEnum, data?: any) {
        this.activeModals.push({ key, data });
        return this.activeModals.length - 1;
    }

    @action hideModal(id: number) {
        this.activeModals.replace(this.activeModals.filter((_, i) => i !== id));
    }

    @action hideAllModals() {
        this.activeModals.clear();
    }

    @action prompt(text: string, description) {
        const deferred = defer<boolean>();
        this.showModal(ModalsEnum.Prompt, { deferred, text, description });
        return deferred.promise;
    }
}
