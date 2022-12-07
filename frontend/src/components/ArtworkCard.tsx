import Picsum from "./Picsum";
import VanSvg from "jsx:../images/v.svg";
import { Link } from "react-router-dom";
import React from "react";
import { ListArtwork } from "../graphql/sdk";
import { toBN } from "../utils/utils";

export const ArtworkCard = ({ artwork }: { artwork: ListArtwork }) => (
    <div className="gallery">
        <div className="gallery__wrap">
            <div className="gallery__img">
                <img src={artwork.artwork?.url} />
                {/*<Picsum width={250}/>*/}
            </div>
            <div className="gallery__info">
                <span className="gallery__name base-text">{artwork.title}</span>
                <div className="gallery__login">
                    <div className="gallery__images">
                        {/*<Picsum width={24}/>*/}
                        {artwork.minterData?.avatar && <img src={artwork.minterData.avatar} />}
                    </div>
                    <span className="gallery__username">{artwork.minterData?.username ? `@${artwork.minterData.username}` : artwork.minter}</span>
                </div>
                <div className="gallery__price">
                    <span>Price</span>
                </div>
                <div className="gallery__price-img">
                    <div className="gallery-img">
                        <VanSvg/>
                    </div>
                    <span className="gallery__price-sum">
                        {artwork.activeListing ? `${toBN(artwork.activeListing.price).toFixed(2)} VAN` : 'Not on sale'}
                        {/*399.99 VAN
                        <span className="gallery__color">$ 1399.99 USD</span>*/}
                    </span>
                </div>
            </div>
            <Link className="btn primary" type="button" to={`/artworks/${artwork.uuid}`}>View</Link>
        </div>
    </div>
)
