import React, {useEffect} from "react";
import {AuthModal} from './Login/Auth';
import styled from "styled-components";
import {useTranslation} from 'react-i18next'
import { Link } from "react-scroll";
import BeeLogo from '@BeesImages/bee-z-logo.svg';
import Scrollspy from 'react-scrollspy'
import { offset } from "./Utilities/helpers";
import SvgComponent from "./SvgComponent";

const StyledA = styled.a`
    cursor: pointer;
`;
const StyledLink = styled(Link)`
  cursor: pointer;
`;
export const NavigationBar = () => {
    const{t,i18n} = useTranslation();

    const navbarCollapse = () => {
        const nav = document.getElementById('mainNav');
        if(nav) {
            if (offset(nav).top > 50) {
                nav.classList.add('navbar-scrolled');
            } else {
                nav.classList.remove('navbar-scrolled');
            }
        }
    };

    useEffect(() => {
        navbarCollapse();
        document.addEventListener('scroll', navbarCollapse);
        return () => { window.removeEventListener('scroll', navbarCollapse); }
    });
    return (
    <nav
        className="navbar navbar-expand-lg navbar-light fixed-top py-2 navbar-scrolled"
        id="mainNav"
    >
        <div className="container">
            <a style={{width:'20vw'}} className="navbar-brand" href="#page-top">
                <SvgComponent className='img-fluid' svgImage={BeeLogo} />
            </a>
            <button
                className="navbar-toggler navbar-toggler-right collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#navbarResponsive"
                aria-controls="navbarResponsive"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
                <Scrollspy items={ ['concept', 'functionality', 'technology','contact'] } className="navbar-nav ml-auto my-2 my-lg-0" currentClassName="active">
                    <li className="nav-item d-flex">
                        <StyledLink
                          className="nav-link align-self-center"
                          activeClass="active"
                          to="concept"
                          href="#concept"
                          spy={true}
                          smooth={true}
                          offset={-116.75}
                          duration={500}
                        >
                            {t("navbar.concept")}
                        </StyledLink>
                    </li>
                    <li className="nav-item d-flex">
                        <StyledLink
                          className="nav-link align-self-center"
                          activeClass="active"
                          to="functionality"
                          href="#functionality"
                          spy={true}
                          smooth={true}
                          offset={-106.75}
                          duration={500}
                        >
                            {t("navbar.functionality")}
                        </StyledLink>
                    </li>
                    <li className="nav-item d-flex">
                        <StyledLink
                          className="nav-link align-self-center"
                          activeClass="active"
                          to="technology"
                          href="#technology"
                          spy={true}
                          smooth={true}
                          offset={-106.75}
                          duration={500}
                        >
                            {t("navbar.technology")}
                        </StyledLink>
                    </li>
                    <li className="nav-item d-flex">
                        <StyledLink
                            className="nav-link align-self-center"
                            activeClass="active"
                            to="contact"
                            href="#contact"
                            spy={true}
                            smooth={true}
                            offset={-106.75}
                            duration={500}
                        >
                            {t("navbar.contact")}
                        </StyledLink>
                    </li>
                    <li className="nav-item">
                        <AuthModal/>
                    </li>
                </Scrollspy>
            </div>
        </div>
    </nav>
);
}
