import React from "react";
import Illustration from '@BeesImages/illustration.png';
import Divider from '@BeesImages/divider.png';
import {useTranslation} from "react-i18next";
export const Concept = () => {
  const{t,i18n} = useTranslation();
  return (
    <section className="page-section bg-white" id="concept">
      <div className="container">
        <h2 className="concept-header mt-5">
          {t('home.concept.caption')}
        </h2>
        <div className="row justify-content-center align-items-center">
          <div>
            <img src={Divider} style={{width:'5rem'}}/>
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className='p-3'>
            <img src={Illustration}  style={{width:'100%'}}/>
          </div>
        </div>
        <div className="row mt-5 mb-5">
          <div className="col justify-content-center">
            <div className='concept-text'>
              <p>{t('home.concept.summary.1')}</p>
            </div>
          </div>
          <div className="col justify-content-center">
            <div className='concept-text'>
              <p>{t('home.concept.summary.2')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
