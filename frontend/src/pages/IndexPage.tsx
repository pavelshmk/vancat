import React from 'react';
import BitmartSvg from 'jsx:../svg/bitmart.svg';
import CMCSvg from 'jsx:../svg/cmc.svg';
import CoinGeckoSvg from 'jsx:../svg/coingecko.svg';
import DappRadarSvg from 'jsx:../svg/dappradar.svg';
import FAQSection from "../components/index/FAQSection";
import TechnicalSection from "../components/index/TechnicalSection";
import TeamSection from "../components/index/TeamSection";
import PartnersSection from "../components/index/PartnersSection";
import { ADDRESSES } from "../stores/WalletStore";

interface IIndexPageProps {
}

const IndexPage = ({}: IIndexPageProps) => {
    return (
        <main className="main">
            <section className="intro-section">
                <video className="intro-video" muted autoPlay>
                    <source src={require('url:../video/IntroNFT.webm')} type='video/webm'/>
                    <source src={require('url:../video/IntroNFT.mp4')} type='video/mp4'/>
                </video>
            </section>
            <PartnersSection />
            <section className="what-section">
                <div className="container">
                    <div className="what">
                        <div className="what__wrap">
                            <div className="what__img">
                                <img src={require('url:../images/logo-cat.png')} alt="" />
                            </div>
                            <div className="what__info">
                                <h2 className="section-title">What is VANCAT?</h2>
                                <p className="base-text">VANCAT platform allows users to easily deposit BEP20 tokens (ANY tokens) into an NFT.</p>
                                <p className="base-text">The platform can also be used to mint NFTs with A.I.</p>
                                <p className="base-text">VANCAT token is the governance token of the platform.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="categories-section">
                <div className="container">
                    <div className="categories-wrap">
                        <div className="categories">
                            <div className="categories__wrap">
                                <div className="categories__intro">
                                    <h3 className="categories-title">Automated</h3>
                                    <span className="categories-text">Create NFTs automatically with Artificial Intelligence (AI). No talent needed. Just use VANCAT platform’s subtokens (VCSPERM and VCEGG) to create unique & rare NFTs with AI.</span>
                                </div>
                                <div className="categories__img">
                                    <img src={require('url:../images/ai.svg')} alt="alt" />
                                </div>
                            </div>
                        </div>
                        <div className="categories">
                            <div className="categories__wrap">
                                <div className="categories__intro">
                                    <h3 className="categories-title">NFT Types</h3>
                                    <span className="categories-text">Mint NFTs with different type of files. Upload and sell your visual artworks as jpg, png, gif, mp4, pdf formats. Tag them such as game, art, music and sell with low transaction fees.</span>
                                </div>
                                <div className="categories__img">
                                    <img src={require('url:../images/nft.svg')} alt="alt" />
                                </div>
                            </div>
                        </div>
                        <div className="categories">
                            <div className="categories__wrap">
                                <div className="categories__intro">
                                    <h3 className="categories-title">iOS App</h3>
                                    <span className="categories-text">Track your wallet balance or send/receive tokens with our iOS wallet app. You can use the browser’s DApp for DEXs like PancakeSwap or VANSwap. (VANCAT, VCSPERM, VCEGG are per-added)</span>
                                </div>
                                <div className="categories__img">
                                    <img src={require('url:../images/iPhone.svg')} alt="alt" />
                                </div>
                            </div>
                        </div>
                        <div className="categories">
                            <div className="categories__wrap">
                                <div className="categories__intro">
                                    <h3 className="categories-title">Game Awards</h3>
                                    <span className="categories-text">You can play to earn VANCAT tokens. Our game will be ready soon.</span>
                                </div>
                                <div className="categories__img">
                                    <img src={require('url:../images/play.svg')} alt="alt" />
                                </div>
                            </div>
                        </div>
                        <div className="categories">
                            <div className="categories__wrap">
                                <div className="categories__intro">
                                    <h3 className="categories-title">VANSwap</h3>
                                    <span className="categories-text">Buy crypto with credit card and swap for VANCAT with our own DEX, VANSwap.</span>
                                </div>
                                <div className="categories__img"><img src={require('url:../images/van.svg')} alt="alt" /></div>
                            </div>
                        </div>
                    </div>
                    <h2 className="section-title text-center">VANCAT TOKEN FAMILY</h2>
                    <div className="family-section">
                        <div className="family-head">
                            <div className="family-head__head">
                                <div className="family-head__img">
                                    <img src={require('url:../images/logo-cat.svg')} alt="alt" />
                                    <span className="family-head__text">VANCAT Token</span>
                                </div>
                                <span className="family-head__info">VANCAT is the main token of VANCAT platform</span>
                            </div>
                        </div>
                        <div className="family-body">
                            <div className="family">
                                <div className="family__wrap">
                                    <div className="family__img">
                                        <img src={require('url:../images/icons/loked.svg')} alt="alt" />
                                    </div>
                                    <div className="family__intro">
                                        <span className="family__text">Locked</span>
                                        <span className="family__info">All liquidity and remaining tokens ate locked</span>
                                    </div>
                                </div>
                            </div>
                            <div className="family">
                                <div className="family__wrap">
                                    <div className="family__img">
                                        <img src={require('url:../images/icons/governance.svg')} alt="alt" />
                                    </div>
                                    <div className="family__intro">
                                        <span className="family__text">Governance</span>
                                        <span className="family__info">VANCAT token is the governance token of VANCAT platform. It powers the platform so users must have VANCAT token to buy/sell NFTs on marketplace</span>
                                    </div>
                                </div>
                            </div>
                            <div className="family">
                                <div className="family__wrap">
                                    <div className="family__img">
                                        <img src={require('url:../images/icons/deflationary.svg')} alt="alt" />
                                    </div>
                                    <div className="family__intro">
                                        <span className="family__text">Deflationary</span>
                                        <span className="family__info">VANCAT has a built-in 10% transaction tax where 5% gets burnt & 5% goes back to holders</span>
                                    </div>
                                </div>
                            </div>
                            <div className="family">
                                <div className="family__wrap">
                                    <div className="family__img">
                                        <img src={require('url:../images/icons/passive.svg')} alt="alt" />
                                    </div>
                                    <div className="family__intro">
                                        <span className="family__text">Passive income</span>
                                        <span className="family__info">With our built-in 5% redistribution on every transaction, your fund will increase more and more while you hold our token</span>
                                    </div>
                                </div>
                            </div>
                            <div className="family">
                                <div className="family__wrap">
                                    <div className="family__img">
                                        <img src={require('url:../images/icons/low.svg')} alt="alt" />
                                    </div>
                                    <div className="family__intro">
                                        <span className="family__text">Low transaction fees</span>
                                        <span className="family__info">Binance Smart Chain’s low transaction fees make creating and trading NFT’s affordable for anyone</span>
                                    </div>
                                </div>
                            </div>
                            <div className="family">
                                <div className="family__wrap">
                                    <div className="family__img">
                                        <img src={require('url:../images/icons/safe.svg')} alt="alt" />
                                    </div>
                                    <div className="family__intro">
                                        <span className="family__text">Audited and safe</span>
                                        <span className="family__info">Our smart contract has passed a full code audit Solidity Finance</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="family__wallet">
                            <span className="family__contract">Contract:</span>
                            <a href='https://bscscan.com/token/0x8597ba143AC509189E89aaB3BA28d661A5dD9830' target='_blank' className="family__code">0x8597ba143AC509189E89aaB3BA28d661A5dD9830</a>
                        </div>
                        <div className="tags-wrap">
                            <a href='https://www.bitmart.com/trade/tr?layout=basic&symbol=VANCAT_USDT' target='_blank' className="btn secondary">
                                <img src={require('url:../images/bitmart.svg')} alt="" /><span>Buy on BitMart</span>
                            </a>
                            <a href='https://www.hotbit.io/exchange?symbol=VANCAT_USDT' target='_blank' className="btn secondary" type="button">
                                <img src={require('url:../images/hotbit.svg')} alt="" /><span>Buy on Hotbit</span>
                            </a>
                            <a href='https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x8597ba143AC509189E89aaB3BA28d661A5dD9830' target='_blank' className="btn secondary" type="button">
                                <img src={require('url:../images/pancake.svg')} alt="" /><span>Buy on PancakeSwap</span>
                            </a>
                            <a href='https://www.coingecko.com/en/coins/vancat' target='_blank' className="btn secondary" type="button">
                                <img src={require('url:../images/coingecko.svg')} alt="" /><span>Listed on CoinGecko</span>
                            </a>
                            <a href='https://coinmarketcap.com/tr/currencies/vancat/' target='_blank' className="btn secondary" type="button">
                                <img src={require('url:../images/marketcap.svg')} alt="" /><span>Listed on CoinMarketCap</span>
                            </a>
                        </div>
                    </div>
                    <div className="sperm-section family-section">
                        <div className="sperm-head family-head">
                            <div className="sperm-head__wrap family-head__head">
                                <div className="sperm-head__img family-head__img">
                                    <img src={require('url:../images/logo-sperm.svg')} alt="alt" />
                                    <div className="sperm-head__text family-head__text">VANCAT Sperm Token</div>
                                </div>
                                <div className="sperm-head__info family-head__info">
                                    VCSPERM is a subtoken of VANCAT platform. It is used to create NFTs with AI
                                </div>
                            </div>
                        </div>
                        <div className="sperm-wrap family-body">
                            <div className="sperm family">
                                <div className="sperm__wrap">
                                    <div className="sperm__img family__img">
                                        <img src={require('url:../images/icons/auto-lock.svg')} alt="alt" />
                                    </div>
                                    <div className="sperm__intro family__intro">
                                        <span className="sperm__text family__text">Liquidity Auto-lock</span>
                                        <span className="sperm__info family__info">Our smart contract has passed a full code audit Solidity Finance</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sperm family">
                                <div className="sperm__wrap">
                                    <div className="sperm__img family__img">
                                        <img src={require('url:../images/icons/generating.svg')} alt="alt" />
                                    </div>
                                    <div className="sperm__intro family__intro">
                                        <span className="sperm__text family__text">Yield Generating</span>
                                        <span className="sperm__info family__info">2% of each transaction is redistributed to holders</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sperm family">
                                <div className="sperm__wrap">
                                    <div className="sperm__img family__img">
                                        <img src={require('url:../images/icons/burn.svg')} alt="alt" />
                                    </div>
                                    <div className="sperm__intro family__intro">
                                        <span className="sperm__text family__text">Initial Burn</span>
                                        <span className="sperm__info family__info">10% of total initial supply was sent to the Dead wallet and burned</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="family__wallet text-center">
                            <span className="family__contract">Contract:</span>
                            <a href='https://bscscan.com/token/0xE285510E5C14c2b8ff46147D9145f034B8Ff073B' target='_blank' className="family__code">0xE285510E5C14c2b8ff46147D9145f034B8Ff073B</a>
                        </div>
                        <div className="tags-wrap">
                            <a href='https://www.bitmart.com/trade/tr?layout=basic&symbol=VCSPERM_USDT' target='_blank' className="btn secondary" type="button">
                                <img src={require('url:../images/bitmart.svg')} alt="" /><span>Buy on BitMart</span>
                            </a>
                            <a href='https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xE285510E5C14c2b8ff46147D9145f034B8Ff073B' target='_blank' className="btn secondary" type="button">
                                <img src={require('url:../images/pancake.svg')} alt="" /><span>Buy on PancakeSwap</span>
                            </a>
                        </div>
                    </div>
                    <div className="egg-section family-section">
                        <div className="egg-head family-head">
                            <div className="egg-head__wrap family-head__head">
                                <div className="egg-head__img family-head__img">
                                    <img src={require('url:../images/logo-egg.svg')} alt="alt" />
                                    <div className="egg-head__text family-head__text">VANCAT Egg Token</div>
                                </div>
                                <div className="egg-head__info family-head__info">
                                    VCEGG is a subtoken of VANCAT platform. It is used to create NFTs with AI
                                </div>
                            </div>
                        </div>
                        <div className="egg-wrap family-body">
                            <div className="egg family">
                                <div className="egg__wrap">
                                    <div className="egg__img family__img">
                                        <img src={require('url:../images/icons/auto-lock.svg')} alt="alt" />
                                    </div>
                                    <div className="egg__intro family__intro">
                                        <span className="egg__text family__text">Liquidity Auto-lock</span>
                                        <span className="egg__info family__info">Our smart contract has passed a full code audit Solidity Finance</span>
                                    </div>
                                </div>
                            </div>
                            <div className="egg family">
                                <div className="egg__wrap">
                                    <div className="egg__img family__img">
                                        <img src={require('url:../images/icons/generating.svg')} alt="alt" />
                                    </div>
                                    <div className="egg__intro family__intro">
                                        <span className="egg__text family__text subtext">Yield Generating</span>
                                        <span className="egg__info family__info">2% of each transaction is redistributed to holders</span>
                                    </div>
                                </div>
                            </div>
                            <div className="egg family">
                                <div className="egg__wrap">
                                    <div className="egg__img family__img">
                                        <img src={require('url:../images/icons/supply.svg')} alt="alt" />
                                    </div>
                                    <div className="egg__intro family__intro">
                                        <span className="egg__text family__text">Low Supply</span>
                                        <span className="egg__info family__info">Each VCEGG is rare and important when creating special NFTs</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="family__wallet text-center">
                            <span className="family__contract">Contract:</span>
                            <a href='https://bscscan.com/token/0x1FF2a2c2DEAdb17B6Ba9949393d1406f4c61BFC9' target='_blank' className="family__code">0x1FF2a2c2DEAdb17B6Ba9949393d1406f4c61BFC9</a>
                        </div>
                        <div className="tags-wrap">
                            <a href='https://www.bitmart.com/trade/tr?layout=basic&symbol=VCEGG_USDT' target='_blank' className="btn secondary" type="button">
                                <img src={require('url:../images/bitmart.svg')} alt="" /><span>Buy on BitMart</span>
                            </a>
                            <a href='https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x1FF2a2c2DEAdb17B6Ba9949393d1406f4c61BFC9' target='_blank' className="btn secondary" type="button">
                                <img src={require('url:../images/pancake.svg')} alt="" /><span>Buy on PancakeSwap</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="about-section">
                <div className="container">
                    <div className="about">
                        <div className="about__wrap">
                            <div className="about__intro">
                                <div className="about__img">
                                    <img src={require('url:../images/cat.png')} alt="alt" />
                                </div>
                                <div className="about__title">
                                    <h2 className="section-title text-center">ABOUT VAN CATS & VANCAT PLATFORM</h2>
                                    <p className="base-text">Van cats are a distinctive landrace of
                                    the domestic cat found in the Lake Van region of eastern Turkey. They are relatively
                                    large, have a chalky white coat, sometimes with ruddy coloration on the head and
                                    hindquarters, and have blue or amber eyes or have heterochromia (having one eye of
                                    each colour). </p>
                                </div>
                            </div>
                            <div className="about__text">
                                <p className="about__paragraph base-text">It’s thought there are around 250,000 Van Cats in existence.</p>
                                <p className="about__paragraph base-text">NFT's (non fungible tokens) are a special type of
                                cryptographic token which represents something unique; non-fungible tokens are thus not
                                mutually interchangeable. We choose Van Cats for our platform because they are unique as
                                NFTs.</p>
                                <p className="about__paragraph base-text">In our v1 web application, we’re only
                                supporting NFTs that are created using the VanCat NFT Minting Station. We’re doing this
                                to ensure safety for users on the platform. Users can mint their own NFTs or choose to
                                purchase others. If you’re interested in being one of the artists featured in the
                                launch, please let us know!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <TeamSection />
            <TechnicalSection />
            <FAQSection />
        </main>
    )
};

export default IndexPage;
