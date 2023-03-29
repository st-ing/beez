import React from "react";
import {CButton} from "@coreui/react";
import styled from 'styled-components'
const PrimaryButtonStyled = styled(CButton)`
  background: #F6BD60;
  border-radius: 5px;
  font-family: Open Sans,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: #FFFFFF;
  padding: 10px;
  &:hover {
   opacity: 0.8;
   color: white;
  }
`;
const SecondaryButtonStyled = styled(CButton)`
  background: #F0F0F8;
  border-radius: 5px;
  font-family: Open Sans,sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: #3D405B;
  padding: 10px;
  margin-right: 6px;
  &:hover {
   opacity: 0.6;
  }
`;
const IconButtonStyled = styled(CButton)`
  border: 1px solid #d9d7d4;
  box-sizing: border-box;
  border-radius: 3px;
  padding-bottom: 3px;
  padding-right: 6px;
  padding-top: 0px;
  padding-left: 6px;
  padding: 0px, 6px, 3px, 6px;
  margin-top: 6px;
  margin-right: 3px;
`;
const DetailButtonStyled = styled(CButton)`
  padding: 0px 6px 3px 7px;
  background: #ffecc7;
  border-radius: 3px;
  margin-right: 3px;
  width:30px;
  height:30px;
  &:hover {
   opacity: 0.6;
  }

`;
const UpdateButtonStyled = styled(CButton)`
  padding: 0px 6px 3px 7px;
  background: rgba(45, 156, 219, 0.2);
  border-radius: 3px;
  margin-right: 3px;
  width:30px;
  height:30px;
  &:hover {
   opacity: 0.6;
  }
`;
const DeleteButtonStyled = styled(CButton)`
  background-color: #fcdad7;
  border-radius: 3px;
  padding: 0px 9px 3px 9px;
  margin-right: 3px;
  width:30px;
  height:30px;
  &:hover {
   opacity: 0.6;
  }
`;
const CancelButtonStyled = styled(CButton)`
  background-color: rgba(240, 240, 248, 0.2);
  border-radius: 3px;
  padding: 0px 6px 3px 6px;
  margin-right: 3px;
  width:30px;
  height:30px;
`;
const ExitButtonStyled = styled(CButton)`
  background-color: #ffffff;
  border-radius: 3px;
  padding: 0px 9px 3px 9px;
  margin-right: 3px;
  margin-top: 5px;
  width: 32px;
  height: 26px;
`;
const OrangeButtonStyled = styled(CButton)`
  background: #F6BD60;
  border-radius: 5px;
  font-family: Work Sans,sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.02em;
  color: #3D405B;
  margin-right: 3px;
  &:hover {
   opacity: 0.6;
  }
`;
const GreyButtonStyled = styled(CButton)`
  background: #E1E2E6;
  border-radius: 5px;
  font-family: Work Sans , sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.02em;
  color: #3D405B;
  margin-right: 3px;
  &:hover {
   opacity: 0.6;
  }
`;
const InitializeButtonStyled = styled(CButton)`
  background: #b0f5be;
  border-radius: 3px;
  margin-top: 6px;
  margin-right: 3px;
  padding: 0px 6px 3px 5px;
  &:hover {
   opacity: 0.6;
  }
`;

export const PrimaryButton = ({children, id, title, onClick, icon, ...props})  => {
  return (
    <PrimaryButtonStyled  onClick={onClick} id={id} props={props} icon={icon}
    >
      {icon && (
        <span className='mr-1'>
          {icon}
        </span>

      )}

      {children}

    </PrimaryButtonStyled>
  );
}
export default PrimaryButton
export const SecondaryButton = ({children, id, onClick, icon, ...props})  => {
  return (
    <SecondaryButtonStyled  onClick={onClick} id={id} props={props} icon={icon}
    >
      {icon && (
        <span className='mr-1'>
          {icon}
        </span>
      )}
      {children}

    </SecondaryButtonStyled>
  );
}
export const IconButton = ({onClick, children, disabled, title, icon, ...props})  => {
  return (
    <IconButtonStyled  onClick={onClick} disabled={disabled} title={title} props={props} icon={icon}
    >
      {icon && (
        <span>
          {icon}
        </span>
      )}
    </IconButtonStyled>
  );
}
export const DetailButton = ({children, onClick, title, icon, ...props})  => {
  return (
    <DetailButtonStyled  onClick={onClick} title={title} props={props} icon={icon}
    >
      {icon && (
        <span>
          {icon}
        </span>
      )}
      {children}

    </DetailButtonStyled>
  );
}
export const UpdateButton = ({onClick, children, title, icon, ariaLabel, ...props})  => {
  return (
    <UpdateButtonStyled onClick={onClick} title={title} aria-label={ariaLabel} props={props} icon={icon}
    >
      {icon && (
        <span>
          {icon}
        </span>
      )}
      {children}
    </UpdateButtonStyled>
  );
}
export const ExitButton = ({onClick, icon, ...props})  => {
  return (
    <ExitButtonStyled onClick={onClick} props={props} icon={icon}
    >
      {icon && (
        <span>
          {icon}
        </span>
      )}
    </ExitButtonStyled>
  );
}
export const DeleteButton = ({onClick, children, title, icon, ...props})  => {
  return (
    <DeleteButtonStyled onClick={onClick} title={title} props={props} icon={icon}
    >
      {icon && (
        <span>
          {icon}
        </span>
      )}
      {children}

    </DeleteButtonStyled>
  );
}
export const CancelButton = ({onClick, children,title, ...props})  => {
  return (
    <CancelButtonStyled onClick={onClick} title={title} props={props}
    >
      {children}
    </CancelButtonStyled>
  );
}
export const OrangeButton = ({onClick, id, children, ...props})  => {
  return (
    <OrangeButtonStyled onClick={onClick} id={id} props={props}
    >
      {children}

    </OrangeButtonStyled>
  );
}
export const GreyButton = ({onClick, children,className, style, ...props})  => {
  return (
    <GreyButtonStyled onClick={onClick} className={className} style={style} props={props}
    >
      {children}

    </GreyButtonStyled>
  );
}
export const InitializeButton = ({onClick, children,title, icon, ...props})  => {
  return (
    <InitializeButtonStyled onClick={onClick} title={title} props={props} icon={icon}
    >
      {icon && (
        <span>
          {icon}
        </span>
      )}
      {children}
    </InitializeButtonStyled>
  );
}
