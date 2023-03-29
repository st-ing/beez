import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import './index.css'
import CIcon from '@coreui/icons-react'
import {useDispatch, useSelector} from "react-redux";
import {getAllPlans} from "../../../../endpoints/PlanFunctions";
import {ProgressBarInfo} from "./ProgressBarInfo";
import {useTranslation} from "react-i18next";

const PlanTitleStyled = styled.div`
font-family: Work Sans,sans-serif;
font-weight: 500;
font-size: 14px;
line-height: 12px;
letter-spacing: -0.02em;
color: #3D405B;
padding-top: 10px;
`;
const TitleStyled = styled.div`
font-family: Work Sans,sans-serif;
font-weight: 600;
font-size: 15px;
line-height: 1.2;
color: #3c4b64;
padding: 0px 10px 13px 6px;
text-align: left;
border-bottom: 1px solid #d8dbe0;
`;

const TheHeaderDropdownTasks = () => {

  const plans = useSelector(state => state.planState.plans)
  const fetched = useSelector(state => state.planState.fetched)
  const [isOpen,setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const isActivityClicked = useSelector(state => state.headerState.isActivityClicked)
  const{t,i18n} = useTranslation();
  let domNode = useRef()
  const onToggleClick = () => {
    setIsOpen(true)
    dispatch({
      type: 'setHeaderVisible',
      isActivityClicked: !isActivityClicked,
    })
  }

  useEffect(() => {

    if (!fetched) {
      getAllPlans().then(data => {
        dispatch({type: 'setPlans', plans: _.sortBy(Object.values(data),'start_date'), fetched: true})
      })
    }

  }, [])

  return (

    <CDropdown
      inNav
      className="c-header-nav-item px-2 d-flex h-100"
    >
      <div className='d-flex h-100' ref={domNode}/>
      <CDropdownToggle onClick={() => onToggleClick()} className="c-header-nav-link" caret={false}>
        {isActivityClicked ?<CIcon name="yellow-activity-icon"/> : <CIcon name="activity-icon"/>}
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0" >
        <CDropdownItem
          header
          className="text-center task-items"
        >
        </CDropdownItem>
        <TitleStyled> {t('ongoing.activity')} </TitleStyled>
        {plans.map(plan =>
          <div className="px-2">
            <PlanTitleStyled>{plan.title} </PlanTitleStyled>
            <ProgressBarInfo plan={plan}/>
          </div>
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdownTasks
