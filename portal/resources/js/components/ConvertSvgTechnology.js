import React, {useState} from 'react';
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
      {props.strings.map((string, id) => {
          let text = t(string);
          let i = 0;
          let data= [];
          text.split("\\n").map(line => {
            i++;
            data.push(<SvgProxy key={line} selector={`[id='${string}'] tspan:nth-child(${i})`}>{line}</SvgProxy>);
          })
          return data;
      })}
    </SvgLoader>
  );
}

export default SvgComponent;
