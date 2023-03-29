import React from "react";
import {useTranslation} from "react-i18next";
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {flagSet} from "@coreui/icons";
import {useDispatch, useSelector} from "react-redux";
import fetchLanguages from "../../../actions/fetchLanguages";
export const TheHeaderDropdownLanguage = () => {
  const dispatch = useDispatch();
  const{t,i18n} = useTranslation();

  const returnLanguage = () => {
    const t_ = i18n.getFixedT(i18n.language);
    const languageName = t_('lang.name');
    switch (i18n.language){
      case 'en': return <span className='c-user-name'><CIcon name="cif-gb"/> {languageName}</span>
      case 'de': return <span className='c-user-name'><CIcon name="cif-de"/> {languageName}</span>
      case 'de-CH': return <span className='c-user-name'><CIcon name="cif-ch"/> {languageName}</span>
      case 'fr': return <span className='c-user-name'><CIcon name="cif-fr"/> {languageName}</span>
      case 'fr-CH': return <span className='c-user-name'><CIcon name="cif-ch"/> {languageName}</span>
      case 'es': return <span className='c-user-name'><CIcon name="cif-es"/> {languageName}</span>
      case 'sr': return <span className='c-user-name'><CIcon name="cif-rs"/> {languageName}</span>
      case 'sr-Cyrl': return <span className='c-user-name'><CIcon name="cif-rs"/> {languageName}</span>
    }
  }

  const handleClick = (lang) => {
    dispatch({type: 'setLanguage',language:lang})
    dispatch(fetchLanguages());
  }

  return (

          <CDropdown
            inNav
            className="c-header-nav-item px-2 d-flex h-100"
            direction="down"
          >
            <div className='d-flex h-100'>
          <CDropdownToggle className='c-header-nav-link' caret={true}>
            {returnLanguage()}
          </CDropdownToggle>
          <CDropdownMenu className='dropdown-menu'>
            <CDropdownItem onClick={() => handleClick('en')}><CIcon content={flagSet.cifGb}/> English </CDropdownItem>
            <CDropdownItem onClick={() => handleClick('de')}><CIcon content={flagSet.cifDe}/> Deutsch</CDropdownItem>
            <CDropdownItem onClick={() => handleClick('fr')}><CIcon content={flagSet.cifFr}/> Français</CDropdownItem>
            <CDropdownItem onClick={() => handleClick('es')}><CIcon content={flagSet.cifEs}/> Español</CDropdownItem>
            <CDropdownItem onClick={() => handleClick('sr')}><CIcon content={flagSet.cifRs}/> Srpski</CDropdownItem>
            <CDropdownItem onClick={() => handleClick('sr-Cyrl')}><CIcon content={flagSet.cifRs}/> Српски</CDropdownItem>
          </CDropdownMenu>
            </div>
        </CDropdown>


  )
}
