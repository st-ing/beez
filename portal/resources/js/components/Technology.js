import React, {useEffect, useState} from "react";
import DividerTechnology from '@BeesImages/divider.png';
import {useTranslation} from "react-i18next";
import ConvertSvgTechnology from "./ConvertSvgTechnology";
import BeezNode from "@BeesImages/default-beez-node.svg";
import BeezGateway from "@BeesImages/default-beez-gateway.svg";
import LoraWan from "@BeesImages/default-lora-wan.svg";
import Mobile from "@BeesImages/default-mobile.svg";
import Wireless from "@BeesImages/default-wireless.svg";
import Remote from "@BeesImages/default-remote.svg";

import ActiveNodeLora from "@BeesImages/active-node-lora.svg"
import ActiveLora from "@BeesImages/active-lora.svg"
import ActiveRemoteLora from "@BeesImages/active-remote-lora.svg"

import ActiveNodeMobile from "@BeesImages/active-node-mobile.svg"
import ActiveGatewayMobile from "@BeesImages/active-gateway-mobile.svg"
import ActiveMobile from "@BeesImages/active-mobile.svg"
import ActiveRemoteMobile from "@BeesImages/active-remote-mobile.svg"

import ActiveNodeWifi from "@BeesImages/active-node-wifi.svg"
import ActiveGatewayWifi from "@BeesImages/active-gateway-wifi.svg"
import ActiveWifi from "@BeesImages/active-wifi.svg"
import ActiveRemoteWifi from "@BeesImages/active-remote-wifi.svg"

import HoverNode from "@BeesImages/hover-beez-node.svg"
import HoverGateway from "@BeesImages/hover-beez-gateway.svg"
import HoverLora from "@BeesImages/hover-lora-wan.svg"
import HoverMobile from "@BeesImages/hover-mobile.svg"
import HoverWifi from "@BeesImages/hover-wireless.svg"
import HoverRemote from "@BeesImages/hover-remote.svg"

export const Technology = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [active, setActive] = useState(0)
  const [node,setNode] = useState(BeezNode);
  const [gateway,setGateway] = useState(BeezGateway);
  const [mobile,setMobile] = useState(Mobile);
  const [lora,setLora] = useState(LoraWan);
  const [wifi,setWifi] = useState(Wireless);
  const [remote,setRemote] = useState(Remote);
  const [activatedLora,setActivatedLora] = useState(0);
  const [activatedMobile,setActivatedMobile] = useState(0);
  const [activatedWifi,setActivatedWifi] = useState(0);

  const [nodeClass,setNodeClass] = useState('beez-node-img');
  const [gatewayClass,setGatewayClass] = useState('beez-gateway-img');
  const [mobileClass,setMobileClass] = useState('beez-mobile-img');
  const [loraClass,setLoraClass] = useState('beez-lora-img');
  const [wifiClass,setWifiClass] = useState('beez-wifi-img');
  const [remoteClass,setRemoteClass] = useState('beez-remote-img');

  useEffect(() => {
    const intervalID = setTimeout(() =>  {
      if(activatedLora === 0 && activatedMobile === 0 && activatedWifi === 0) {
        intervalLora()
        setTimeout(() => {
          intervalMobile()
        }, 300)
        setTimeout(() => {
          intervalWifi()
        }, 600)
      }
    }, 5000);

    return () => {
      clearTimeout(intervalID)
    };
  }, );

  const intervalLora = () => {
    setLora(HoverLora);
    setLoraClass('beez-lora-hover')
    setTimeout(()=> {
      setLora(LoraWan);
      setLoraClass('beez-lora-img');
    },300)
  }

  const intervalMobile = () => {
    setMobile(HoverMobile);
    setMobileClass('beez-mobile-hover')
    setTimeout(()=> {
      setMobile(Mobile);
      setMobileClass('beez-mobile-img');
    },300)
  }

  const intervalWifi = () => {
    setWifi(HoverWifi);
    setWifiClass('beez-wifi-hover')
    setTimeout(()=> {
      setWifi(Wireless);
      setWifiClass('beez-wifi-img');
    },300)
  }


  const activeLora = (e) => {
    if(activatedLora === 0) {
      deactivateAll();

      setNode(ActiveNodeLora);
      setLora(ActiveLora);
      setRemote(ActiveRemoteLora);

      setNodeClass('active-node-lora')
      setLoraClass('active-lora')
      setRemoteClass('active-remote-lora')
      setActivatedLora(1);
      setActivatedMobile(0);
      setActivatedWifi(0);
    }else{
      deactivateAll();
      setActivatedLora(0);
    }

  }

  const activeMobile = (e) => {
    if(activatedMobile === 0) {
      deactivateAll();

      setNode(ActiveNodeMobile);
      setGateway(ActiveGatewayMobile);
      setMobile(ActiveMobile);
      setRemote(ActiveRemoteMobile);

      setNodeClass('active-node-mobile');
      setGatewayClass('active-gateway-mobile')
      setMobileClass('active-mobile');
      setRemoteClass('active-remote-mobile');
      setActivatedMobile(1);
      setActivatedLora(0);
      setActivatedWifi(0);
    }else{
      deactivateAll();
      setActivatedMobile(0);
    }
  }

  const activeWifi = (e) => {
    if(activatedWifi === 0) {
      deactivateAll();

      setNode(ActiveNodeWifi);
      setGateway(ActiveGatewayWifi);
      setWifi(ActiveWifi);
      setRemote(ActiveRemoteWifi);

      setNodeClass('active-node-wifi');
      setGatewayClass('active-gateway-wifi')
      setWifiClass('active-wifi');
      setRemoteClass('active-remote-wifi');
      setActivatedWifi(1);
      setActivatedMobile(0);
      setActivatedLora(0);
    }else{
      deactivateAll();
      setActivatedWifi(0);
    }

  }

  const deactivateAll = (e) => {
    setNode(BeezNode);
    setGateway(BeezGateway);
    setMobile(Mobile);
    setWifi(Wireless);
    setLora(LoraWan);
    setRemote(Remote);

    setNodeClass('beez-node-img');
    setLoraClass('beez-lora-img');
    setGatewayClass('beez-gateway-img');
    setMobileClass('beez-mobile-img');
    setWifiClass('beez-wifi-img');
    setRemoteClass('beez-remote-img');
  }

  const onMouseEnterNode = (e) => {
    if(node === BeezNode) {
      setNode(HoverNode);
      setNodeClass('beez-node-hover')
    }
  }

  const onMouseLeaveNode = (e) => {
    if(node === HoverNode) {
      setNode(BeezNode);
      setNodeClass('beez-node-img');
    }
  }

  const onMouseEnterGateway = (e) => {
    if(gateway === BeezGateway) {
      setGateway(HoverGateway);
      setGatewayClass('beez-gateway-hover')
    }
  }

  const onMouseLeaveGateway = (e) => {
    if(gateway === HoverGateway) {
      setGateway(BeezGateway);
      setGatewayClass('beez-gateway-img');
    }
  }

  const onMouseEnterLora = (e) => {
    if(lora === LoraWan) {
      setLora(HoverLora);
      setLoraClass('beez-lora-hover')
    }
  }

  const onMouseLeaveLora = (e) => {
    if(lora === HoverLora) {
      setLora(LoraWan);
      setLoraClass('beez-lora-img');
    }
  }

  const onMouseEnterMobile = (e) => {
    if(mobile === Mobile) {
      setMobile(HoverMobile);
      setMobileClass('beez-mobile-hover')
    }
  }

  const onMouseLeaveMobile = (e) => {
    if(mobile === HoverMobile) {
      setMobile(Mobile);
      setMobileClass('beez-mobile-img');
    }
  }

  const onMouseEnterRemote = (e) => {
    if(remote === Remote) {
      setRemote(HoverRemote);
      setRemoteClass('beez-remote-hover')
    }
  }

  const onMouseLeaveRemote = (e) => {
    if(remote === HoverRemote) {
      setRemote(Remote);
      setRemoteClass('beez-remote-img');
    }
  }

  const onMouseEnterWifi = (e) => {
    if(wifi === Wireless) {
      setWifi(HoverWifi);
      setWifiClass('beez-wifi-hover')
    }
  }

  const onMouseLeaveWifi = (e) => {
    if(wifi === HoverWifi) {
      setWifi(Wireless);
      setWifiClass('beez-wifi-img');
    }
  }

  const removeNewLine = (text) => {
    return text.replace(/\\n/g, '');
  }

  const{t,i18n} = useTranslation();
  return (
    <section className="page-section" id='technology'>
      <div className='bg-yellow w-100'>
        <div className='container'>
          <h2 className='concept-header'>
            {t('home.technology.caption')}
          </h2>
          <div className="row justify-content-center align-items-center">
            <div>
              <img src={DividerTechnology} style={{width:'5rem'}}/>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-pink row justify-content-center align-items-center w-100 m-0'>

        <div className='wrap-images'>
            <ConvertSvgTechnology strings={['home.technology.node.title','home.technology.node.description']}  className={nodeClass} svgImage={node}/><a className='clickable-area-node' onMouseEnter={onMouseEnterNode} onMouseLeave={onMouseLeaveNode} onClick={deactivateAll}/>
            <ConvertSvgTechnology strings={['home.technology.lora.title','home.technology.lora.description']}  className={loraClass} svgImage={lora}/><a className='clickable-area-lora' onMouseEnter={onMouseEnterLora} onMouseLeave={onMouseLeaveLora} onClick={activeLora}/>
            <ConvertSvgTechnology strings={['home.technology.gateway.title','home.technology.gateway.description']}  className={gatewayClass} svgImage={gateway}/><a className='clickable-area-gateway' onMouseEnter={onMouseEnterGateway} onMouseLeave={onMouseLeaveGateway} onClick={deactivateAll}/>
            <ConvertSvgTechnology strings={['home.technology.wifi.title','home.technology.wifi.description']}  className={wifiClass} svgImage={wifi}/><a className='clickable-area-wifi' onMouseEnter={onMouseEnterWifi} onMouseLeave={onMouseLeaveWifi} onClick={activeWifi} />
            <ConvertSvgTechnology strings={['home.technology.mobile.title','home.technology.mobile.description']}  className={mobileClass} svgImage={mobile}/><a className='clickable-area-mobile' onMouseEnter={onMouseEnterMobile} onMouseLeave={onMouseLeaveMobile} onClick={activeMobile} />
            <ConvertSvgTechnology strings={['home.technology.access.title','home.technology.access.description']}  className={remoteClass} svgImage={remote}/><a className='clickable-area-access' onMouseEnter={onMouseEnterRemote} onMouseLeave={onMouseLeaveRemote} onClick={deactivateAll}/>
        </div>

        <div className='wrap-carousel row row w-100 m-0'>
            <div className="col-12 p-3">
              <div className='functionality-text'>
                {t('home.technology.node.title')}
              </div>
              <div className='functionality-small-text'>
                {removeNewLine(t('home.technology.node.description'))}
              </div>
            </div>
          <div className="col-12 p-3">
            <div className='functionality-text'>
              {t('home.technology.gateway.title')}
            </div>
            <div className='functionality-small-text'>
              {removeNewLine(t('home.technology.gateway.description'))}
            </div>
          </div>
          <hr className='mx-1' />
          <div className="col-12 p-3">
            <div className='functionality-text'>
              {t('home.technology.lora.title')}
            </div>
            <div className='functionality-small-text'>
              {removeNewLine(t('home.technology.lora.description'))}
            </div>
          </div>
          <div className="col-12 p-3">
            <div className='functionality-text'>
              {t('home.technology.wifi.title')}
            </div>
            <div className='functionality-small-text'>
              {removeNewLine(t('home.technology.wifi.description'))}
            </div>
          </div>
          <div className="col-12 p-3">
            <div className='functionality-text'>
              {t('home.technology.mobile.title')}
            </div>
            <div className='functionality-small-text'>
              {removeNewLine(t('home.technology.mobile.description'))}
            </div>
          </div>
          <hr className='mx-1' />
          <div className="col-12 p-3">
            <div className='functionality-text'>
              {t('home.technology.access.title')}
            </div>
            <div className='functionality-small-text'>
              {removeNewLine(t('home.technology.access.description'))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
