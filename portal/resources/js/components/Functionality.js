import React from "react";
import Divider from '@BeesImages/divider.png';
import Inventory from '@BeesImages/inventory.png';
import Maintenance from '@BeesImages/maintenance.png';
import Sensoring from '@BeesImages/sensoring.png';
import Production from '@BeesImages/production.png';
import {useTranslation} from "react-i18next";
export const Functionality = () => {
  const{t,i18n} = useTranslation();
  return (
    <section className="page-section functionality" id='functionality'>
      <div className="container">
        <h2 className="concept-header">
          {t('home.functionality.caption')}
        </h2>
        <div className="row justify-content-center align-items-center">
          <div>
            <img src={Divider} style={{width:'5rem'}}/>
          </div>
        </div>
        <div className="row pt-5">
          <div className="col-12 col-md-6 col-lg-3">
            <div className='d-flex justify-content-center align-items-center'>
              <img style={{width:'80%'}} src={Inventory}/>
            </div>
            <div className='functionality-text'>
              {t('home.functionality.inventory.title')}
            </div>
            <div className='functionality-small-text'>
              {t('home.functionality.inventory.summary')}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className='d-flex justify-content-center align-items-center'>
              <img style={{width:'80%'}}  src={Sensoring}/>
            </div>
            <div className='functionality-text'>
              {t('home.functionality.sensoring.title')}
            </div>
            <div className='functionality-small-text'>
              {t('home.functionality.sensoring.summary')}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className='d-flex justify-content-center align-items-center'>
              <img style={{width:'80%'}}  src={Production}/>
            </div>
            <div className='functionality-text'>
              {t('home.functionality.production.title')}
            </div>
            <div className='functionality-small-text'>
              {t('home.functionality.production.summary')}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className='d-flex justify-content-center align-items-center'>
              <img style={{width:'80%'}} src={Maintenance}/>
            </div>
            <div className='functionality-text'>
              {t('home.functionality.maintenance.title')}
            </div>
            <div className='functionality-small-text'>
              {t('home.functionality.maintenance.summary')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
