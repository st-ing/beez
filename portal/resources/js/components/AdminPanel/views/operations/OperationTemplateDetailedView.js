import React, {useEffect, useState} from "react";
import {getPlan} from "../../../../endpoints/PlanFunctions";
import {Spinner} from "react-bootstrap";
import "../plans/index.css";
import {getOperationTemplate} from "../../../../endpoints/OperationFunctions";

import {OperationTemplateDetailsCard} from "../../../Cards";

const OperationTemplateDetailedView = (props) => {

  const [loadingPage,setLoadingPage] = useState(false);

  const [plan,setPlan] = useState({});
  const [currentOperation,setCurrentOperation] = useState({});
  useEffect(()=> {
    const id = props.match.params.id;
    getOperationTemplate(id).then(res => {
     setCurrentOperation(res);
     console.log(res)
      getPlan(res.plan_id).then(res => {
      setPlan(res);
      })
      setLoadingPage(true);
    });
  },[])

  return(
    <>
      {loadingPage ?
        (
          <>
          <OperationTemplateDetailsCard currentOperation={currentOperation} plan={plan}/>
          </>

        ):
        (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="warning" />
          </div>
        )
      }

    </>

  )
}

export default OperationTemplateDetailedView



