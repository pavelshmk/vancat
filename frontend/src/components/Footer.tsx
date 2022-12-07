import React from 'react';
import LogoSvg from 'jsx:../svg/logo.svg';
import { Link } from 'react-router-dom';
import {
    FaDiscord,
    FaEnvelopeSquare, FaInstagram,
    FaMedium,
    FaReddit,
    FaTelegramPlane,
    FaTwitter
} from "react-icons/fa";

interface IFooterProps {
}

const Footer = ({}: IFooterProps) => {
    return (
        <footer className="footer">
            <div className="container">
                <Link className="logo" to="/">
                    <LogoSvg />
                </Link>
                <div className="soc-wrap">
                    <a className="soc-link" target='_blank' href="https://discord.gg/c4P72umZ">
                        <FaDiscord />
                    </a>
                    <a className="soc-link" target='_blank' href="https://www.instagram.com/vancattokenofficial/">
                        <FaInstagram />
                    </a>
                    <a className="soc-link" target='_blank' href="https://www.reddit.com/r/VanCat_Token/">
                        <FaReddit />
                    </a>
                    <a className="soc-link" target='_blank' href="https://twitter.com/vancattoken">
                        <FaTwitter />
                    </a>
                    <a className="soc-link" target='_blank' href="https://t.me/vancattokencommunity">
                        <FaTelegramPlane />
                    </a>
                    <a className="soc-link" target='_blank' href="https://vancattoken.medium.com">
                        <FaMedium />
                    </a>
                    <a className="soc-link" target='_blank' href="mailto:contact@vancattoken.com">
                        <FaEnvelopeSquare />
                    </a>
                </div>
                <span className="copyright">© VanCat {new Date().getFullYear()}</span></div>
        </footer>
    )
};

export default Footer;
