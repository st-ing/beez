import React from "react";
import {CInput, CLabel, CTextarea, CInputGroupAppend, CInputGroup} from "@coreui/react";
import styled from 'styled-components'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import './style.css';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { DateUtils } from 'react-day-picker';
import DateIcon, {PasswordIcon} from "../AdminPanel/assets/icons/icons";

const PrimaryInputStyled = styled(CInput)`
background: rgba(240, 240, 248, 0.4);
border: 1px solid rgba(61, 64, 91, 0.15);
box-sizing: border-box;
border-radius: 5px;
`;
const PasswordInputStyled = styled(CInput)`
background: rgba(240, 240, 248, 0.4);
border: 1px solid rgba(61, 64, 91, 0.15);
box-sizing: border-box;
border-radius: 5px;
position:relative;
width:100%;

`;

const TextAreaStyled = styled(CTextarea)`
background: rgba(240, 240, 248, 0.4);
border: 1px solid rgba(61, 64, 91, 0.15);
box-sizing: border-box;
border-radius: 5px;
resize: none;

`;
const PrimaryLabelStyled = styled(CLabel)`
color: #999999;
font-family: Work Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 12px;
line-height: 14px;
letter-spacing: -0.02em;
`;

const SettingsPassword = styled.div`
display:inline;
width:100%;
  `

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}
function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale });
}

export const PrimaryInput = ({onChange, name, id, value, type, readOnly,...props})  => {
  return (

    <PrimaryInputStyled  onChange={onChange} name={name} id={id} value={value}  type={type} props={props}/>

  );
}
export default PrimaryInput

export const PrimaryTextarea = ({onChange, id, value, readOnly, name,  ...props})  => {

  return (

    <TextAreaStyled  id={id} value={value} name={name} readOnly={readOnly} onChange={onChange} props={props}
    />

  );
}
export const PrimaryLabel = ({onChange, children, ...props})  => {
  return (

    <PrimaryLabelStyled  onChange={onChange} props={props}>
    {children}
    </PrimaryLabelStyled>

  );
}
export const PasswordInput = ( {onChange, id, readOnly, value, name,  ...props} )  => {
  return (
<SettingsPassword>
    <PasswordInputStyled  id={id} readOnly={readOnly} name={name} value={value} onChange={onChange} props={props}/>
  <PasswordIcon/>
</SettingsPassword>
  );
}

export const DateInput = ( {onChange, id, readOnly, value, name,  ...props} )  => {
  return (
    <div >
        <DayPickerInput
          id={id}
          readOnly={readOnly}
          name={name}
          value={value}
          placeholder={`${dateFnsFormat(new Date(),"yyyy-MM-dd" )}`}
          props={props}
          onDayChange={onChange}
          format= "yyyy-MM-dd"
          inputProps={{ style: { paddingLeft: "8px", width:"100%", paddingTop: "4px", paddingBottom:"4px",
              backgroundColor: "rgba(240, 240, 248, 0.4)" ,
              borderColor: "rgba(61, 64, 91, 0.15)" ,
              borderWidth: "1px", borderStyle: "solid",
              borderRadius: "5px",
              "&:hover": {
                borderColor: "rgba(61, 64, 91, 0.15)"
              },
              focusedInput: "none" ,

              boxSizing: "border box"} }}
          modifiers={{
            sunday: day => day.getDay() === 0,
            firstOfMonth: day => day.getDate() === 1,
          }}
        />

<DateIcon />
    </div>

  );
}

