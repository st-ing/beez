import React from "react";
import {CNavLink,CNavItem} from "@coreui/react";
import styled from 'styled-components'

const PrimaryTabStyled = styled(CNavItem)`
border: 1px solid rgba(61, 64, 91, 0.15);
box-sizing: border-box;
width: 220px;
text-align: center;
border-right: none;
border-left: none;
border-top: none;
padding: 6px, 20px, 20px, 6px;
&:hover {
   background-color: #F0F0F8;
  }
     border-bottom: 3px solid #F6BD60;
`;
const SecondaryTabStyled = styled(CNavItem)`
border: 1px solid rgba(61, 64, 91, 0.15);
box-sizing: border-box;
width: 220px;
text-align: center;
border: none;
padding: 6px, 30px, 20px, 6px;
&:hover {
   background-color: #F0F0F8;
  }
`;
const GreyPrimaryTabStyled = styled(CNavItem)`
border: 1px solid rgba(61, 64, 91, 0.15);
box-sizing: border-box;
border: none;
width: 220px;
text-align: center;
padding: 6px, 20px, 20px, 6px;
&:hover {
   background-color: #F0F0F8;
  }

`;
const OrangeSecondaryTabStyled = styled(CNavItem)`
border: 1px solid rgba(61, 64, 91, 0.15);
box-sizing: border-box;
width: 220px;
text-align: center;
border-left: none;
border-top: none;
border-right: none;
padding: 6px, 30px, 20px, 6px;
&:hover {
   background-color: #F0F0F8;
  }
border-bottom: 3px solid #F6BD60;
`;
const GreyLeftTabStyled = styled(CNavItem)`
background: #F0F0F8;
box-sizing: border-box;
border: 1px solid rgba(61, 64, 91, 0.15);
border-top-left-radius: 5px;
border-bottom-left-radius: 5px;
font-family: Open Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 14px;
letter-spacing: -0.02em;
color: #3D405B;
padding-left: 12px;
padding-right: 12px;
padding-top: 10px;
padding-bottom: 10px;
&:hover {
 opacity: 0.6;
  }
list-style:none ;

`;
const GreyRightTabStyled = styled(CNavItem)`
background: #F0F0F8;
box-sizing: border-box;
border: 1px solid rgba(61, 64, 91, 0.15);
border-top-right-radius: 5px;
border-bottom-right-radius: 5px;
font-family: Open Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 14px;
letter-spacing: -0.02em;
color: #3D405B;
padding-left: 12px;
padding-right: 12px;
padding-top: 10px;
padding-bottom: 10px;
&:hover {
 opacity: 0.6;
  }
list-style:none ;

`;
const GreyNoRadiusTabStyled = styled(CNavItem)`
background: #F0F0F8;
box-sizing: border-box;
border: 1px solid rgba(61, 64, 91, 0.15);
color: #3D405B;
font-family: Open Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 14px;
letter-spacing: -0.02em;
padding-left: 12px;
padding-right: 12px;
padding-top: 10px;
padding-bottom: 10px;
&:hover {
 opacity: 0.6;
  }
list-style:none ;

`;
const OrangeLeftTabStyled = styled(CNavItem)`
background: #F6BD60;
box-sizing: border-box;
border: 1px solid rgba(61, 64, 91, 0.15);
border-top-left-radius: 5px;
border-bottom-left-radius: 5px;
font-family: Open Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 14px;
letter-spacing: -0.02em;
padding-left: 12px;
padding-right: 12px;
padding-top: 10px;
padding-bottom: 10px;
list-style:none ;
&:hover {
   background-color: #F0F0F8;
  }
`;
const OrangeNoRadiusTabStyled = styled(CNavItem)`
background: #F6BD60;
box-sizing: border-box;
border: 1px solid rgba(61, 64, 91, 0.15);
font-family: Open Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 14px;
letter-spacing: -0.02em;
padding-left: 12px;
padding-right: 12px;
padding-top: 10px;
padding-bottom: 10px;
list-style:none ;
&:hover {
   background-color: #F0F0F8;
  }
`;
const OrangeRightTabStyled = styled(CNavItem)`
background: #F6BD60;
box-sizing: border-box;
border: 1px solid rgba(61, 64, 91, 0.15);
border-top-right-radius: 5px;
border-bottom-right-radius: 5px;
font-family: Open Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 14px;
letter-spacing: -0.02em;
padding-left: 12px;
padding-right: 12px;
padding-top: 10px;
padding-bottom: 10px;
list-style:none ;
&:hover {
   background-color: #F0F0F8;
  }
`;
const PrimaryNavLinkStyled = styled(CNavLink)`
color: #F6BD60;
font-family: Work Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 19px;
letter-spacing: -0.02em;
&:hover {
 color: #F6BD60;
  }
`;
const SecondaryNavLinkStyled = styled(CNavLink)`
color: #3D405B;
font-family: Work Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 19px;
letter-spacing: -0.02em;
&:hover {
 color: #3D405B;
  }
`;
const NavLinkStyled = styled(CNavLink)`
color:  #3D405B;
font-family: Work Sans,sans-serif;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 14px;
letter-spacing: -0.02em;
padding-left: 2px;
padding-right: 2px;
padding-top: 1px;
padding-bottom: 1px;
&:hover {
 color:  #3D405B;
  }
`;

export const PrimaryTab = ({children, id, onClick, icon, ...props})  => {
  return (
    <PrimaryTabStyled  onClick={onClick} id={id} props={props} icon={icon}
    >
      <PrimaryNavLinkStyled>
        {icon && (
          <span className='mr-1'>
          {icon}
        </span>
        )}
        {children}
      </PrimaryNavLinkStyled>


    </PrimaryTabStyled>
  );
}
export default PrimaryTab
export const SecondaryTab = ({children, id, icon, ...props})  => {
  return (
    <SecondaryTabStyled props={props} id={id} icon={icon}
    >
      <SecondaryNavLinkStyled>
        {icon && (
          <span className='mr-1'>
          {icon}
        </span>
        )}
        {children}
      </SecondaryNavLinkStyled>

    </SecondaryTabStyled>
  );
}
export const GreyLeftTab = ({onClick, id, value, name, children, ...props})  => {
  return (
    <GreyLeftTabStyled>
      <NavLinkStyled onClick={onClick} id={id} value={value} name={name} props={props}>
        {children}
        </NavLinkStyled>
    </GreyLeftTabStyled>
  );
}
export const GreyRightTab = ({onClick, id, value, name, children, ...props})  => {
  return (
    <GreyRightTabStyled>
      <NavLinkStyled onClick={onClick} id={id} value={value} name={name} props={props}>
      {children}
      </NavLinkStyled>
    </GreyRightTabStyled>
  );
}
export const GreyNoRadiusTab = ({onClick, id, value, name, children, ...props})  => {
  return (
    <GreyNoRadiusTabStyled>
      <NavLinkStyled  onClick={onClick} id={id} value={value} name={name} props={props}>
        {children}
      </NavLinkStyled>
    </GreyNoRadiusTabStyled>
  );
}
export const OrangeLeftTab = ({onClick, id, value, name, children, ...props})  => {
  return (
    <OrangeLeftTabStyled>
      <NavLinkStyled onClick={onClick} id={id} value={value} name={name} props={props}>
      {children}
      </NavLinkStyled>
    </OrangeLeftTabStyled>
  );
}
export const OrangeNoRadiusTab = ({onClick, id, value, name, children, ...props})  => {
  return (
    <OrangeNoRadiusTabStyled>
      <NavLinkStyled onClick={onClick} id={id} value={value} name={name} props={props}>
      {children}
      </NavLinkStyled>
    </OrangeNoRadiusTabStyled>
  );
}
export const OrangeRightTab = ({onClick, id, value, name, children, ...props})  => {
  return (
    <OrangeRightTabStyled>
      <NavLinkStyled onClick={onClick} id={id} value={value} name={name} props={props}>
        {children}
      </NavLinkStyled>
    </OrangeRightTabStyled>
  );
}

export const GreyPrimaryTab = ({children, id, onClick, icon, ...props})  => {
  return (
    <GreyPrimaryTabStyled  onClick={onClick} id={id} props={props} icon={icon}
    >
      <SecondaryNavLinkStyled>
        {icon && (
          <span className='mr-1'>
          {icon}
        </span>
        )}
        {children}
      </SecondaryNavLinkStyled>

    </GreyPrimaryTabStyled>
  );
}
export const OrangeSecondaryTab = ({children, id, onClick, icon, ...props})  => {
  return (
    <OrangeSecondaryTabStyled  onClick={onClick} id={id} props={props} icon={icon}
    >
      <PrimaryNavLinkStyled>
        {icon && (
          <span className='mr-1'>
          {icon}
        </span>
        )}
        {children}
      </PrimaryNavLinkStyled>

    </OrangeSecondaryTabStyled>
  );
}
