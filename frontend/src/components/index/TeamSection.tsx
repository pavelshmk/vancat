import React from 'react';

interface ITeamSectionProps {
}

const TeamItem = ({ img, name, role }: { img: string, name: string, role: string }) => (
    <div className="team">
        <div className="team__wrap">
            <div className="team__img">
                <img src={img} alt="alt" />
            </div>
            <span className="team__name base-text">{name}</span>
            <span className="team__info">{role}</span>
        </div>
    </div>
)

const TeamSection = ({}: ITeamSectionProps) => {
    return (
        <section className="team-section">
            <div className="container">
                <h2 className="section-title text-center">Our team</h2>
                <div className="team-wrap">
                    <TeamItem img={require('url:../../images/jo.png')} name='John Doe' role='Co-founder' />
                    <TeamItem img={require('url:../../images/jo2.png')} name='John Doe' role='Co-founder' />
                    <TeamItem img={require('url:../../images/jo3.png')} name='John Doe' role='Co-founder' />
                    <TeamItem img={require('url:../../images/jo4.png')} name='John Doe' role='Co-founder' />
                    <TeamItem img={require('url:../../images/jo5.png')} name='John Doe' role='Co-founder' />
                </div>
            </div>
        </section>
    )
};

export default TeamSection;
