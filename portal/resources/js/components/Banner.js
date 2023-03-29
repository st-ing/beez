import React from "react";
import BeeImg from '@BeesImages/bee1.png';
import {useTranslation} from "react-i18next";
import ReactTypingEffect from 'react-typing-effect';
import SvgComponent from "./SvgComponent";
export const Banner = () => {
  const{t,i18n} = useTranslation();
  return (
    <header className="masthead">
      <div className="container py-5">
        <div className="row justify-content-center align-items-center banner-div">
          <div className="banner-headline">
            {t('home.intro.caption')}
            <img src={BeeImg} className='banner-bee'/>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className='banner-text'>
            <ReactTypingEffect
              text={[
                t('home.intro.summary')
              ]}
              speed="70"
              eraseSpeed="45"
              typingDelay="2000"
              eraseDelay="6000"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
