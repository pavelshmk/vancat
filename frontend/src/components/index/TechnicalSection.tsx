import React from 'react';

interface ITechnicalSectionProps {
}

const TechnicalSection = ({}: ITechnicalSectionProps) => {
    return (
        <section className="technical-section">
            <div className="container">
                <div className="technical">
                    <div className="technical__wrap">
                        <div className="technical__download">
                            <a className="technical__link" href="https://vancattoken.com/VanCatTokenWhitepaper.pdf" target='_blank'>
                                View Whitepaper
                                <div className="technical__img">
                                    <img src={require('url:../../images/file.svg')} alt="alt" />
                                </div>
                            </a>
                            <a className="technical__link" href="https://vancattoken.com/VanCatTokenRoadmap.pdf" target='_blank'>
                                View Roadmap
                                <div className="technical__img">
                                    <img src={require('url:../../images/file.svg')} alt="alt" />
                                </div>
                            </a>
                        </div>
                        <div className="technical__info">
                            <h2 className="section-title">TECHNICAL DETAILS </h2>
                            <p className="base-text"> Our initial DAapp is developed to be used with the growing crypto
                            art market, with plans to rapidly expand with additional DApps covering more of the NFT
                            space.The main idea behind the VANCAT token supply is the Van cats, so the token has no
                            decimals (subdividing). You can have 10 billion VANCAT or 330 million VANCAT, not
                            10,8326923 million VANCAT. Because cats can not be divided.✌️</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default TechnicalSection;
