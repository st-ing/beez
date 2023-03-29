import React, {useEffect, useState} from 'react';
import {getPlanOperation} from "../../../../endpoints/PlanFunctions";
import CIcon from "@coreui/icons-react";
import styled from "styled-components";
import {CProgress} from "@coreui/react";
import {useDispatch, useSelector} from "react-redux";
import './index.css'
import {getAllFinishedOperations} from "../../../../endpoints/OperationFunctions";

const PercentageStyled = styled.strong`
color: #F6BD60;
padding-left: 2px;
font-size: 12px;
font-weight: bold;
`;
const ProgressStyled = styled(CProgress)`
height: 8px;
.progress-bar {
  background-color: #F6BD60;
  padding-bottom: 10px;
}
`;

/**
 * Component used for reproducing all plan operations with their status into ongoing activity.
 * @param {Object} plan - The plan which all plan operations with their status and progress bar value we will get.
 */
export const ProgressBarInfo = ({plan})  => {
  const [planOperations, setPlanOperations] = useState([]);
  const finishedOperations = useSelector(state => state.operationState.finished)
  const finishedFetched = useSelector(state => state.operationState.finishedFetched)
  const dispatch = useDispatch();

  useEffect(() => {

    getPlanOperation(plan.id).then(data => {
      setPlanOperations(_.sortBy(Object.values(data), 'planned_date'));
    })

    if (!finishedFetched) {
      getAllFinishedOperations().then(data => {
        dispatch({
          type: 'setOperations',
          finished: _.sortBy(Object.values(data), 'planned_date'),
          finishedFetched: true
        })
      })
    }
  }, [])

  /**
   * Progress bar value in percentage for specified plan
   * @param {Object} plan - The plan which progress bar value we will get.
   * @typedef {number} calc - Calculate value as number of operations divided with number of finished operations in percentage.
   * @typedef {Array} finished - Keeps finished operations.
   * @property {Function} toLocaleString - Returns a string with a language-sensitive representation of this number without fraction digits.
   * @returns {number} - Calculated value for that plan.
   */
  const getValue = (plan) => {

    let finished = finishedOperations.filter(planOperation => planOperation.plan_id === plan.id);
    let calc = 0;

   if ((planOperations.length) !== 0) {
     calc = ((finished.length) / (planOperations.length) * 100)
       .toLocaleString(undefined, {maximumFractionDigits: 0});
     return calc;
   }
   else
     return 0;
  }

  return (

    <div>
       <span className="float-right">
       <PercentageStyled> {getValue(plan)}% </PercentageStyled>
       </span>
      <div className="py-2">
        <ProgressStyled size="xs" value={getValue(plan)}/></div>
      {planOperations.map(operation =>
        <div className="col-*-* pl-3">
          <label>
            {
              operation.status === 'started' ? <CIcon name='cil-chevron-circle-right-alt' className='started' width='20' height='20'/> :
                operation.status === 'done' ? <CIcon name='cil-check-circle' className='finished' width='20' height='20'/> :
                  operation.status === 'canceled' ? <CIcon name='cil-x-circle' className='canceled' width='20' height='20' value={{ color: 'blue', size: '50px' }}/> :
                    <CIcon name='cil-clock' className='planned' width='20' height='20'/>
            }
            <span className='d-inline-flex px-2'> {operation.name} </span>
          </label>
        </div>
      )}
    </div>
  );
}
