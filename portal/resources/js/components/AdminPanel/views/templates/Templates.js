import {
  CNav,
  CTabContent,
  CTabPane, CTabs
} from "@coreui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import PlansTemplates from "../plans/PlansTemplates";
import OperationsTemplates from "../operations/OperationsTemplates";
import PrimaryTab, {GreyPrimaryTab, OrangeSecondaryTab, SecondaryTab} from "../../../tabs/Tabs";
import {OperationsTemplateIcon, TemplateIcon} from "../../assets/icons/icons";

const Templates = () => {
  const{t,i18n} = useTranslation();

  const [active, setActive] = useState(0);

  return (
    <CTabs activeTab={active} onActiveTabChange={idx => setActive(idx)}>
      <div className="d-flex justify-content-center border-bottom 1px solid grey">
        <CNav>
          {active === 0 ?
            <PrimaryTab id={'planTemplate'} icon={<TemplateIcon/>}> {t('plan_templates.table')} </PrimaryTab>
            :
            <GreyPrimaryTab id={'planTemplate'} icon={<OperationsTemplateIcon/>}> {t('plan_templates.table')} </GreyPrimaryTab>
          }
          {active === 1 ?
            <OrangeSecondaryTab id={'operationTemplate'} icon={<TemplateIcon/>}> {t('operation.templates')} </OrangeSecondaryTab>
            :
            <SecondaryTab id={'operationTemplate'} icon={<OperationsTemplateIcon/>}> {t('operation.templates')} </SecondaryTab>
          }
        </CNav>
      </div>
      <CTabContent>
        <CTabPane className='mt-3'>
          <PlansTemplates />
        </CTabPane>
        <CTabPane className='mt-3'>
          {active === 1 && (
          <OperationsTemplates/>
          )}
        </CTabPane>
      </CTabContent>
    </CTabs>
  )
}
export default Templates
