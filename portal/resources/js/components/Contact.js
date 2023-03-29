import React from "react";
import IconMail from '@BeesImages/icon-mail.svg';
import Divider from '@BeesImages/divider.png';
import {useTranslation} from "react-i18next";
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {flagSet} from "@coreui/icons";
import {useDispatch} from "react-redux";
import fetchLanguages from "./actions/fetchLanguages";
export const Contact = () => {
  const dispatch = useDispatch();
  const{t,i18n} = useTranslation();

  const returnLanguage = () => {
    const t_ = i18n.getFixedT(i18n.language);
    const languageName = t_('lang.name');
    switch (i18n.language){
      case 'en': return <span><CIcon name="cif-gb"/> {languageName}</span>
      case 'de': return <span><CIcon name="cif-de"/> {languageName}</span>
      case 'de-CH': return <span><CIcon name="cif-ch"/> {languageName}</span>
      case 'fr': return <span><CIcon name="cif-fr"/> {languageName}</span>
      case 'fr-CH': return <span><CIcon name="cif-ch"/> {languageName}</span>
      case 'es': return <span><CIcon name="cif-es"/> {languageName}</span>
      case 'sr': return <span><CIcon name="cif-rs"/> {languageName}</span>
      case 'sr-Cyrl': return <span><CIcon name="cif-rs"/> {languageName}</span>
    }
  }

  const handleClick = (lang) => {
    dispatch({type: 'setLanguage',language:lang})
    dispatch(fetchLanguages());
  }

  const breakLine = (text) => {
    return (
      text.split("\\n").map(line => {
        return ( <p key={line}> {line} </p>)
      })
    )
  }

  return (
    <section className="page-section contact" id='contact'>
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <h2 className="contact-header">
            {t('home.contact.title')}
          </h2>
        </div>
        <div className="row justify-content-center align-items-center pb-2">
          <div>
            <img src={Divider} style={{width:'5rem'}}/>
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="grey-header">
            {breakLine(t('home.contact.description'))}
          </div>
        </div>
        <div className="row justify-content-center align-items-center pb-3">
          <div>
            <img src={IconMail} style={{width:'2.5rem'}}/>
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="contact-footer">
            <a style={{textDecoration:'none'}} href="mailto:buzz@beez.link" target="_blank">buzz@beez.link </a>
          </div>
        </div>
      </div>
      <div className="row pb-2 justify-content-end w-100 m-0">
          <CDropdown placement="top" className="dropdown-language">
            <CDropdownToggle className='dropdown-button'>
              {returnLanguage()}
            </CDropdownToggle>
            <CDropdownMenu className='dropdowntop-language'>
              <CDropdownItem onClick={() => handleClick('en')}><CIcon content={flagSet.cifGb}/> English</CDropdownItem>
              <CDropdownItem onClick={() => handleClick('de')}><CIcon content={flagSet.cifDe}/> Deutsch</CDropdownItem>
              <CDropdownItem onClick={() => handleClick('fr')}><CIcon content={flagSet.cifFr}/> Français</CDropdownItem>
              <CDropdownItem onClick={() => handleClick('es')}><CIcon content={flagSet.cifEs}/> Español</CDropdownItem>
              <CDropdownItem onClick={() => handleClick('sr')}><CIcon content={flagSet.cifRs}/> Srpski</CDropdownItem>
              <CDropdownItem onClick={() => handleClick('sr-Cyrl')}><CIcon content={flagSet.cifRs}/> Српски</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
      </div>
      <footer>
        <div className="row w-100 m-0 p-1 text-black" style={{fontSize:'12px'}}>
          v{document.querySelector("meta[name='version']").getAttribute("content")}
        </div>
      </footer>
    </section>
  )
}
