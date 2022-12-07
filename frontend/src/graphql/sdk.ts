import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: any;
  /**
   * Allows use of a JSON String for input / output from the GraphQL schema.
   *
   * Use of this type is *not recommended* as you lose the benefits of having a defined, static
   * schema (one of the key benefits of GraphQL).
   */
  JSONString: any;
  /**
   * Leverages the internal Python implementation of UUID (uuid.UUID) to provide native UUID objects
   * in fields, resolvers and input.
   */
  UUID: any;
  /**
   * Create scalar that ignores normal serialization/deserialization, since
   * that will be handled by the multipart request spec
   */
  Upload: any;
};

/** An enumeration. */
export enum AppArtworkCategoryChoices {
  /** Art */
  Art = 'ART',
  /** Games */
  Games = 'GAMES',
  /** Music */
  Music = 'MUSIC',
  /** Photo */
  Photo = 'PHOTO'
}

export type ArtistsResponseType = {
  items?: Maybe<Array<ProfileType>>;
  totalItems?: Maybe<Scalars['Int']>;
};

/** An enumeration. */
export enum ArtworkCategory {
  Art = 'ART',
  Games = 'GAMES',
  Music = 'MUSIC',
  Photo = 'PHOTO'
}

export type ArtworkEventType = {
  data?: Maybe<Scalars['JSONString']>;
  datetime: Scalars['DateTime'];
  event: Scalars['String'];
  fromAddress: Scalars['String'];
  fromAddressData?: Maybe<ProfileType>;
  id: Scalars['ID'];
  toAddress?: Maybe<Scalars['String']>;
  toAddressData?: Maybe<ProfileType>;
  tokenId?: Maybe<Scalars['Int']>;
};

export type ArtworkInputType = {
  artwork?: Maybe<Scalars['Upload']>;
  category?: Maybe<ArtworkCategory>;
  description?: Maybe<Scalars['String']>;
  exclusiveInfo?: Maybe<Scalars['String']>;
  royalties?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type ArtworkType = {
  activeListing?: Maybe<SaleListingType>;
  artwork?: Maybe<UrlField>;
  category: AppArtworkCategoryChoices;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  events?: Maybe<Array<ArtworkEventType>>;
  id: Scalars['ID'];
  minter: Scalars['String'];
  minterData?: Maybe<ProfileType>;
  owner?: Maybe<Scalars['String']>;
  ownerData?: Maybe<ProfileType>;
  royalties: Scalars['Int'];
  title: Scalars['String'];
  tokenId?: Maybe<Scalars['Int']>;
  uuid: Scalars['UUID'];
};


export type ArtworkType_ArtworkArgs = {
  size?: Maybe<Scalars['Int']>;
};

export type CreateGeneratedNftMutation = {
  args?: Maybe<Scalars['JSONString']>;
};

export type CreateStandardNftMutation = {
  args?: Maybe<Scalars['JSONString']>;
};

export type GalleryResponseType = {
  items?: Maybe<Array<ArtworkType>>;
  totalItems?: Maybe<Scalars['Int']>;
};

export type GeneratedArtworkInputType = {
  category?: Maybe<ArtworkCategory>;
  description?: Maybe<Scalars['String']>;
  exclusiveInfo?: Maybe<Scalars['String']>;
  royalties?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
};

export type GenerationDnaMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type GenerationEjaculationMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type GenerationOvulationMutation = {
  ok?: Maybe<Scalars['Boolean']>;
};

export type GenerationProcessType = {
  dNA?: Maybe<Array<Maybe<Scalars['Int']>>>;
  ejaculationConfirmed?: Maybe<Scalars['Boolean']>;
  ejaculationTx: Scalars['String'];
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  ovulationConfirmed?: Maybe<Scalars['Boolean']>;
  ovulationTx: Scalars['String'];
};

export type Mutation = {
  createGeneratedNft?: Maybe<CreateGeneratedNftMutation>;
  createStandardNft?: Maybe<CreateStandardNftMutation>;
  genDna?: Maybe<GenerationDnaMutation>;
  genEjaculation?: Maybe<GenerationEjaculationMutation>;
  genOvulation?: Maybe<GenerationOvulationMutation>;
  signIn?: Maybe<SignInMutation>;
  updateProfile?: Maybe<UpdateProfileMutation>;
};


export type Mutation_CreateGeneratedNftArgs = {
  input: GeneratedArtworkInputType;
  minter?: Maybe<Scalars['String']>;
};


export type Mutation_CreateStandardNftArgs = {
  input: ArtworkInputType;
  minter?: Maybe<Scalars['String']>;
};


export type Mutation_GenEjaculationArgs = {
  txid?: Maybe<Scalars['String']>;
};


export type Mutation_GenOvulationArgs = {
  txid?: Maybe<Scalars['String']>;
};


export type Mutation_SignInArgs = {
  nonce: Scalars['String'];
  signature: Scalars['String'];
};


export type Mutation_UpdateProfileArgs = {
  avatar?: Maybe<Scalars['Upload']>;
  input: ProfileInputType;
  nonce: Scalars['String'];
  removeAvatar?: Maybe<Scalars['Boolean']>;
  signature: Scalars['String'];
};

export type ProfileInputType = {
  bio?: Maybe<Scalars['String']>;
  facebook?: Maybe<Scalars['String']>;
  instagram?: Maybe<Scalars['String']>;
  telegram?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};

export type ProfileType = {
  address: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
  bio: Scalars['String'];
  createdArtworks?: Maybe<Array<ArtworkType>>;
  facebook: Scalars['String'];
  id: Scalars['ID'];
  instagram: Scalars['String'];
  ownedArtworks?: Maybe<Array<ArtworkType>>;
  telegram: Scalars['String'];
  twitter: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
  artists?: Maybe<ArtistsResponseType>;
  artwork?: Maybe<ArtworkType>;
  gallery?: Maybe<GalleryResponseType>;
  generationProcess?: Maybe<GenerationProcessType>;
  nonce: Scalars['String'];
  profile?: Maybe<ProfileType>;
  tokenomicsInfo?: Maybe<TokenomicsInfoType>;
};


export type Query_ArtistsArgs = {
  page?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
};


export type Query_ArtworkArgs = {
  uuid?: Maybe<Scalars['String']>;
};


export type Query_GalleryArgs = {
  category?: Maybe<ArtworkCategory>;
  page?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
};


export type Query_ProfileArgs = {
  search: Scalars['String'];
};

export type SaleListingType = {
  buyer?: Maybe<Scalars['String']>;
  closed: Scalars['Boolean'];
  listingId: Scalars['Int'];
  price: Scalars['Decimal'];
  seller?: Maybe<Scalars['String']>;
};

export type SignInMutation = {
  token?: Maybe<Scalars['String']>;
};

export type TokenomicsInfoType = {
  burnt?: Maybe<Scalars['Decimal']>;
  burntDelta?: Maybe<Scalars['Decimal']>;
};

export type UpdateProfileMutation = {
  profile?: Maybe<ProfileType>;
};

export type UrlField = {
  url?: Maybe<Scalars['String']>;
};

export type SaleListing = { listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean };

export type Profile = { id: string, address: string, username: string, bio: string, instagram: string, twitter: string, telegram: string, facebook: string, avatar?: Maybe<string>, createdArtworks?: Maybe<Array<{ id: string, uuid: any, title: string, minter: string, minterData?: Maybe<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>, artwork?: Maybe<{ url?: Maybe<string> }>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> }>>, ownedArtworks?: Maybe<Array<{ id: string, uuid: any, title: string, minter: string, minterData?: Maybe<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>, artwork?: Maybe<{ url?: Maybe<string> }>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> }>> };

export type ListProfile = { id: string, username: string, bio: string, avatar?: Maybe<string> };

export type UsernameProfile = { id: string, username: string, avatar?: Maybe<string> };

export type ArtworkEvent = { id: string, fromAddress: string, toAddress?: Maybe<string>, datetime: any, event: string, data?: Maybe<any>, fromAddressData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }>, toAddressData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }> };

export type Artwork = { id: string, uuid: any, title: string, category: AppArtworkCategoryChoices, description: string, royalties: number, minter: string, owner?: Maybe<string>, tokenId?: Maybe<number>, createdAt: any, artwork?: Maybe<{ url?: Maybe<string> }>, minterData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }>, ownerData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }>, events?: Maybe<Array<{ id: string, fromAddress: string, toAddress?: Maybe<string>, datetime: any, event: string, data?: Maybe<any>, fromAddressData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }>, toAddressData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }> }>>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> };

export type ListArtwork = { id: string, uuid: any, title: string, minter: string, minterData?: Maybe<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>, artwork?: Maybe<{ url?: Maybe<string> }>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> };

export type GenProcess = { id: string, ejaculationTx: string, ejaculationConfirmed?: Maybe<boolean>, ovulationTx: string, ovulationConfirmed?: Maybe<boolean>, dNA?: Maybe<Array<Maybe<number>>>, image?: Maybe<string> };

export type SignInVariables = Exact<{
  nonce: Scalars['String'];
  signature: Scalars['String'];
}>;


export type SignIn = { signIn?: Maybe<{ token?: Maybe<string> }> };

export type UpdateProfileVariables = Exact<{
  input: ProfileInputType;
  nonce: Scalars['String'];
  signature: Scalars['String'];
  removeAvatar?: Maybe<Scalars['Boolean']>;
  avatar?: Maybe<Scalars['Upload']>;
}>;


export type UpdateProfile = { updateProfile?: Maybe<{ profile?: Maybe<{ id: string, address: string, username: string, bio: string, instagram: string, twitter: string, telegram: string, facebook: string, avatar?: Maybe<string>, createdArtworks?: Maybe<Array<{ id: string, uuid: any, title: string, minter: string, minterData?: Maybe<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>, artwork?: Maybe<{ url?: Maybe<string> }>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> }>>, ownedArtworks?: Maybe<Array<{ id: string, uuid: any, title: string, minter: string, minterData?: Maybe<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>, artwork?: Maybe<{ url?: Maybe<string> }>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> }>> }> }> };

export type CreateStandardNftVariables = Exact<{
  input: ArtworkInputType;
  minter: Scalars['String'];
}>;


export type CreateStandardNft = { createStandardNft?: Maybe<{ args?: Maybe<any> }> };

export type GenEjaculationVariables = Exact<{
  txid: Scalars['String'];
}>;


export type GenEjaculation = { genEjaculation?: Maybe<{ ok?: Maybe<boolean> }> };

export type GenOvulationVariables = Exact<{
  txid: Scalars['String'];
}>;


export type GenOvulation = { genOvulation?: Maybe<{ ok?: Maybe<boolean> }> };

export type GenDnaVariables = Exact<{ [key: string]: never; }>;


export type GenDna = { genDna?: Maybe<{ ok?: Maybe<boolean> }> };

export type CreateGeneratedNftVariables = Exact<{
  input: GeneratedArtworkInputType;
  minter: Scalars['String'];
}>;


export type CreateGeneratedNft = { createGeneratedNft?: Maybe<{ args?: Maybe<any> }> };

export type GetNonceVariables = Exact<{ [key: string]: never; }>;


export type GetNonce = { nonce: string };

export type GetProfileVariables = Exact<{
  query: Scalars['String'];
}>;


export type GetProfile = { profile?: Maybe<{ id: string, address: string, username: string, bio: string, instagram: string, twitter: string, telegram: string, facebook: string, avatar?: Maybe<string>, createdArtworks?: Maybe<Array<{ id: string, uuid: any, title: string, minter: string, minterData?: Maybe<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>, artwork?: Maybe<{ url?: Maybe<string> }>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> }>>, ownedArtworks?: Maybe<Array<{ id: string, uuid: any, title: string, minter: string, minterData?: Maybe<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>, artwork?: Maybe<{ url?: Maybe<string> }>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> }>> }> };

export type GetArtistsVariables = Exact<{
  q?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
}>;


export type GetArtists = { artists?: Maybe<{ totalItems?: Maybe<number>, items?: Maybe<Array<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>> }> };

export type GetGalleryVariables = Exact<{
  category?: Maybe<ArtworkCategory>;
  page?: Maybe<Scalars['Int']>;
  q?: Maybe<Scalars['String']>;
}>;


export type GetGallery = { gallery?: Maybe<{ totalItems?: Maybe<number>, items?: Maybe<Array<{ id: string, uuid: any, title: string, minter: string, minterData?: Maybe<{ id: string, username: string, bio: string, avatar?: Maybe<string> }>, artwork?: Maybe<{ url?: Maybe<string> }>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> }>> }> };

export type GetArtworkVariables = Exact<{
  uuid: Scalars['String'];
}>;


export type GetArtwork = { artwork?: Maybe<{ id: string, uuid: any, title: string, category: AppArtworkCategoryChoices, description: string, royalties: number, minter: string, owner?: Maybe<string>, tokenId?: Maybe<number>, createdAt: any, artwork?: Maybe<{ url?: Maybe<string> }>, minterData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }>, ownerData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }>, events?: Maybe<Array<{ id: string, fromAddress: string, toAddress?: Maybe<string>, datetime: any, event: string, data?: Maybe<any>, fromAddressData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }>, toAddressData?: Maybe<{ id: string, username: string, avatar?: Maybe<string> }> }>>, activeListing?: Maybe<{ listingId: number, price: any, seller?: Maybe<string>, buyer?: Maybe<string>, closed: boolean }> }> };

export type GetGenerationProcessVariables = Exact<{ [key: string]: never; }>;


export type GetGenerationProcess = { generationProcess?: Maybe<{ id: string, ejaculationTx: string, ejaculationConfirmed?: Maybe<boolean>, ovulationTx: string, ovulationConfirmed?: Maybe<boolean>, dNA?: Maybe<Array<Maybe<number>>>, image?: Maybe<string> }> };

export type GetTokenomicsInfoVariables = Exact<{ [key: string]: never; }>;


export type GetTokenomicsInfo = { tokenomicsInfo?: Maybe<{ burnt?: Maybe<any>, burntDelta?: Maybe<any> }> };

export const ListProfile = gql`
    fragment listProfile on ProfileType {
  id
  username
  bio
  avatar
}
    `;
export const SaleListing = gql`
    fragment saleListing on SaleListingType {
  listingId
  price
  seller
  buyer
  closed
}
    `;
export const ListArtwork = gql`
    fragment listArtwork on ArtworkType {
  id
  uuid
  title
  minter
  minterData {
    ...listProfile
  }
  artwork(size: 256) {
    url
  }
  activeListing {
    ...saleListing
  }
}
    ${ListProfile}
${SaleListing}`;
export const Profile = gql`
    fragment profile on ProfileType {
  id
  address
  username
  bio
  instagram
  twitter
  telegram
  facebook
  avatar
  createdArtworks {
    ...listArtwork
  }
  ownedArtworks {
    ...listArtwork
  }
}
    ${ListArtwork}`;
export const UsernameProfile = gql`
    fragment usernameProfile on ProfileType {
  id
  username
  avatar
}
    `;
export const ArtworkEvent = gql`
    fragment artworkEvent on ArtworkEventType {
  id
  fromAddress
  fromAddressData {
    ...usernameProfile
  }
  toAddress
  toAddressData {
    ...usernameProfile
  }
  datetime
  event
  data
}
    ${UsernameProfile}`;
export const Artwork = gql`
    fragment artwork on ArtworkType {
  id
  uuid
  title
  category
  description
  artwork {
    url
  }
  royalties
  minter
  minterData {
    ...usernameProfile
  }
  owner
  ownerData {
    ...usernameProfile
  }
  tokenId
  createdAt
  events {
    ...artworkEvent
  }
  activeListing {
    ...saleListing
  }
}
    ${UsernameProfile}
${ArtworkEvent}
${SaleListing}`;
export const GenProcess = gql`
    fragment genProcess on GenerationProcessType {
  id
  ejaculationTx
  ejaculationConfirmed
  ovulationTx
  ovulationConfirmed
  dNA
  image
}
    `;
export const SignInDocument = gql`
    mutation signIn($nonce: String!, $signature: String!) {
  signIn(nonce: $nonce, signature: $signature) {
    token
  }
}
    `;
export const UpdateProfileDocument = gql`
    mutation updateProfile($input: ProfileInputType!, $nonce: String!, $signature: String!, $removeAvatar: Boolean, $avatar: Upload) {
  updateProfile(
    input: $input
    nonce: $nonce
    signature: $signature
    removeAvatar: $removeAvatar
    avatar: $avatar
  ) {
    profile {
      ...profile
    }
  }
}
    ${Profile}`;
export const CreateStandardNftDocument = gql`
    mutation createStandardNft($input: ArtworkInputType!, $minter: String!) {
  createStandardNft(input: $input, minter: $minter) {
    args
  }
}
    `;
export const GenEjaculationDocument = gql`
    mutation genEjaculation($txid: String!) {
  genEjaculation(txid: $txid) {
    ok
  }
}
    `;
export const GenOvulationDocument = gql`
    mutation genOvulation($txid: String!) {
  genOvulation(txid: $txid) {
    ok
  }
}
    `;
export const GenDnaDocument = gql`
    mutation genDNA {
  genDna {
    ok
  }
}
    `;
export const CreateGeneratedNftDocument = gql`
    mutation createGeneratedNft($input: GeneratedArtworkInputType!, $minter: String!) {
  createGeneratedNft(input: $input, minter: $minter) {
    args
  }
}
    `;
export const GetNonceDocument = gql`
    query getNonce {
  nonce
}
    `;
export const GetProfileDocument = gql`
    query getProfile($query: String!) {
  profile(search: $query) {
    ...profile
  }
}
    ${Profile}`;
export const GetArtistsDocument = gql`
    query getArtists($q: String, $page: Int) {
  artists(q: $q, page: $page) {
    totalItems
    items {
      ...listProfile
    }
  }
}
    ${ListProfile}`;
export const GetGalleryDocument = gql`
    query getGallery($category: ArtworkCategory, $page: Int, $q: String) {
  gallery(category: $category, page: $page, q: $q) {
    totalItems
    items {
      ...listArtwork
    }
  }
}
    ${ListArtwork}`;
export const GetArtworkDocument = gql`
    query getArtwork($uuid: String!) {
  artwork(uuid: $uuid) {
    ...artwork
  }
}
    ${Artwork}`;
export const GetGenerationProcessDocument = gql`
    query getGenerationProcess {
  generationProcess {
    ...genProcess
  }
}
    ${GenProcess}`;
export const GetTokenomicsInfoDocument = gql`
    query getTokenomicsInfo {
  tokenomicsInfo {
    burnt
    burntDelta
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    signIn(variables: SignInVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignIn> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignIn>(SignInDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'signIn');
    },
    updateProfile(variables: UpdateProfileVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateProfile> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProfile>(UpdateProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateProfile');
    },
    createStandardNft(variables: CreateStandardNftVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateStandardNft> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateStandardNft>(CreateStandardNftDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createStandardNft');
    },
    genEjaculation(variables: GenEjaculationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GenEjaculation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenEjaculation>(GenEjaculationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'genEjaculation');
    },
    genOvulation(variables: GenOvulationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GenOvulation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenOvulation>(GenOvulationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'genOvulation');
    },
    genDNA(variables?: GenDnaVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GenDna> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenDna>(GenDnaDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'genDNA');
    },
    createGeneratedNft(variables: CreateGeneratedNftVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateGeneratedNft> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateGeneratedNft>(CreateGeneratedNftDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createGeneratedNft');
    },
    getNonce(variables?: GetNonceVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetNonce> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetNonce>(GetNonceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getNonce');
    },
    getProfile(variables: GetProfileVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetProfile> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProfile>(GetProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getProfile');
    },
    getArtists(variables?: GetArtistsVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetArtists> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetArtists>(GetArtistsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getArtists');
    },
    getGallery(variables?: GetGalleryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetGallery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGallery>(GetGalleryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGallery');
    },
    getArtwork(variables: GetArtworkVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetArtwork> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetArtwork>(GetArtworkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getArtwork');
    },
    getGenerationProcess(variables?: GetGenerationProcessVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetGenerationProcess> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetGenerationProcess>(GetGenerationProcessDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGenerationProcess');
    },
    getTokenomicsInfo(variables?: GetTokenomicsInfoVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTokenomicsInfo> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTokenomicsInfo>(GetTokenomicsInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTokenomicsInfo');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;