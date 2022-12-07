import React, { useState } from 'react';
import classNames from "classnames";
import SlideDown from "react-slidedown";

interface IFAQSectionProps {
}

const FAQItem = ({ label, content, openItem, toggleOpen, id }: { label: React.ReactNode, content: React.ReactNode, openItem: number, toggleOpen: (number?) => any, id: number }) => (
    <div className="accordions__item">
        <div className={classNames('accordions__btn', { active: openItem === id })} onClick={() => toggleOpen(openItem === id ? undefined : id)}>
            <h3>{label}</h3>
            <div className="accordions__icon"/>
        </div>
        <SlideDown closed={openItem !== id} as='div' className="accordions__content">
            <div className="accordions__descr">
                {content}
            </div>
        </SlideDown>
    </div>
)

const FAQSection = ({}: IFAQSectionProps) => {
    const [ openItem, setOpenItem ] = useState<number>();

    return (
        <section className="faq-section">
            <div className="container">
                <h2 className="section-title text-center">Frequently asked questions</h2>
                <div className="accordions js-accordion-wrap">
                    <FAQItem
                        label='Question #1'
                        content={<p>
                            Our initial DAapp is developed
                            to be used with the growing crypto art market, with plans to rapidly expand with
                            additional DApps covering more of the NFT space.The main idea behind the VANCAT
                            token supply is the Van cats, so the token has no decimals (subdividing). You can
                            have 10 billion VANCAT or 330 million VANCAT, not 10,8326923 million VANCAT. Because
                            cats can not be divided️
                        </p>}
                        openItem={openItem}
                        toggleOpen={setOpenItem}
                        id={0}
                    />
                    <FAQItem
                        label='Question #2'
                        content={<p>
                            Our initial DAapp is developed
                            to be used with the growing crypto art market, with plans to rapidly expand with
                            additional DApps covering more of the NFT space.The main idea behind the VANCAT
                            token supply is the Van cats, so the token has no decimals (subdividing). You can
                            have 10 billion VANCAT or 330 million VANCAT, not 10,8326923 million VANCAT. Because
                            cats can not be divided️
                        </p>}
                        openItem={openItem}
                        toggleOpen={setOpenItem}
                        id={1}
                    />
                    <FAQItem
                        label='Question #3'
                        content={<p>
                            Our initial DAapp is developed
                            to be used with the growing crypto art market, with plans to rapidly expand with
                            additional DApps covering more of the NFT space.The main idea behind the VANCAT
                            token supply is the Van cats, so the token has no decimals (subdividing). You can
                            have 10 billion VANCAT or 330 million VANCAT, not 10,8326923 million VANCAT. Because
                            cats can not be divided️
                        </p>}
                        openItem={openItem}
                        toggleOpen={setOpenItem}
                        id={2}
                    />
                    <FAQItem
                        label='Question #4'
                        content={<p>
                            Our initial DAapp is developed
                            to be used with the growing crypto art market, with plans to rapidly expand with
                            additional DApps covering more of the NFT space.The main idea behind the VANCAT
                            token supply is the Van cats, so the token has no decimals (subdividing). You can
                            have 10 billion VANCAT or 330 million VANCAT, not 10,8326923 million VANCAT. Because
                            cats can not be divided️
                        </p>}
                        openItem={openItem}
                        toggleOpen={setOpenItem}
                        id={3}
                    />
                    <FAQItem
                        label='Question #5'
                        content={<p>
                            Our initial DAapp is developed
                            to be used with the growing crypto art market, with plans to rapidly expand with
                            additional DApps covering more of the NFT space.The main idea behind the VANCAT
                            token supply is the Van cats, so the token has no decimals (subdividing). You can
                            have 10 billion VANCAT or 330 million VANCAT, not 10,8326923 million VANCAT. Because
                            cats can not be divided️
                        </p>}
                        openItem={openItem}
                        toggleOpen={setOpenItem}
                        id={4}
                    />
                    <FAQItem
                        label='Question #6'
                        content={<p>
                            Our initial DAapp is developed
                            to be used with the growing crypto art market, with plans to rapidly expand with
                            additional DApps covering more of the NFT space.The main idea behind the VANCAT
                            token supply is the Van cats, so the token has no decimals (subdividing). You can
                            have 10 billion VANCAT or 330 million VANCAT, not 10,8326923 million VANCAT. Because
                            cats can not be divided️
                        </p>}
                        openItem={openItem}
                        toggleOpen={setOpenItem}
                        id={5}
                    />
                </div>
            </div>
        </section>
    )
};

export default FAQSection;
