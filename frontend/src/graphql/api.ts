import {
    ArtworkCategory,
    ArtworkInputType, GeneratedArtworkInputType,
    getSdk,
    ProfileInputType,
    ProfileType,
    Sdk,
    UpdateProfileMutation
} from "./sdk";
import { GraphQLClient } from "graphql-request";
import _ from "lodash";


export class Api {
    private readonly client: GraphQLClient;
    private readonly sdk: Sdk;

    constructor(uri: string, token?: string) {
        this.client = new GraphQLClient(uri, { headers: { authorization: token || '' } });
        this.sdk = getSdk(this.client);
    }

    async getNonce() {
        const r = await this.sdk.getNonce();
        return r.nonce;
    }

    async signIn(nonce: string, signature: string) {
        const r = await this.sdk.signIn({ nonce, signature });
        return r.signIn.token;
    }

    async getProfile(query: string) {
        const r = await this.sdk.getProfile({ query });
        return r.profile;
    }

    async getArtists(page: number, q: string) {
        const r = await this.sdk.getArtists({ q, page });
        return r.artists;
    }

    async getGallery(page: number, q: string, category: ArtworkCategory) {
        const r = await this.sdk.getGallery({ q, page, category });
        return r.gallery
    }

    async updateProfile(input: ProfileInputType, removeAvatar: boolean, avatar: File | null, nonce: string, signature: string) {
        input = _.pick(input, ['username', 'bio', 'telegram', 'instagram', 'facebook', 'twitter']);
        const r = await this.sdk.updateProfile({ input, nonce, signature, removeAvatar, avatar });
        return r.updateProfile.profile;
    }

    async createStandardNft(input: ArtworkInputType, minter: string): Promise<[ url: string, uuid: string, royalties: string, sig: string ]> {
        const r = await this.sdk.createStandardNft({ input, minter });
        return JSON.parse(r.createStandardNft.args);
    }

    async getArtwork(uuid: string) {
        const r = await this.sdk.getArtwork({ uuid });
        return r.artwork;
    }

    async genEjaculation(txid: string) {
        await this.sdk.genEjaculation({ txid });
    }

    async genOvulation(txid: string) {
        await this.sdk.genOvulation({ txid });
    }

    async genDNA() {
        await this.sdk.genDNA();
    }

    async getGenProcess() {
        const r = await this.sdk.getGenerationProcess();
        return r.generationProcess;
    }

    async createGeneratedNft(input: GeneratedArtworkInputType, minter: string): Promise<[ url: string, uuid: string, royalties: string, sig: string ]> {
        const r = await this.sdk.createGeneratedNft({ input, minter });
        return JSON.parse(r.createGeneratedNft.args);
    }

    async getTokenomicsInfo() {
        const r = await this.sdk.getTokenomicsInfo();
        return r.tokenomicsInfo;
    }
}
