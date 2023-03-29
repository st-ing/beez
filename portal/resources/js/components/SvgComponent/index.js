import React from 'react';
import { SvgLoader, SvgProxy } from 'react-svgmt';
import {useTranslation} from "react-i18next";

const SvgComponent = (props) => {
  const{t,i18n} = useTranslation();
  // If array of strings is empty let's just return svg image, there is nothing to update.
  if(!props.strings) {
    return (<SvgLoader onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} className={props.className} onClick={props.onClick} path={props.svgImage} />)
  }

  return (
    <SvgLoader strings={props.strings} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} className={props.className} onClick={props.onClick} path={props.svgImage} >
      {props.strings.map((string, id) => <SvgProxy key={id} selector={`[id='${string}']`}>{t(string)}</SvgProxy>)}
    </SvgLoader>
  );
}

export default SvgComponent;
