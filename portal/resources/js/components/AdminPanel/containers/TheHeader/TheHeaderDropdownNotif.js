import React, {useEffect, useRef, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {useOnClickOutside} from "../../../Utilities/helpers";

const TheHeaderDropdownNotif = () => {
  const [isOpen,setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const isNotifyClicked = useSelector(state => state.headerState.isNotifyClicked)
  const itemsCount = 5;
  let domNode = useRef()
  useOnClickOutside({domNode, isOpen}, () =>{
    setIsOpen(false)
    dispatch({type: 'setHeaderVisible', isNotifyClicked: false})
  })
  const onToggleClick = () => {
    setIsOpen(true)
    dispatch({
      type: 'setHeaderVisible',
      isNotifyClicked: !isNotifyClicked,
    })
  }
  return (
    <CDropdown
      inNav
      className="c-header-nav-item px-2 d-flex h-100"
    >
      <div className='d-flex h-100' ref={domNode}>
        <CDropdownToggle onClick={() => onToggleClick() } className="c-header-nav-link" caret={false}>
          {isNotifyClicked ?<CIcon name="yellow-notification-icon"/> : <CIcon name="notification-icon"/>}
        </CDropdownToggle>

        <CDropdownMenu placement="bottom-end" className="pt-0">
          <CDropdownItem
            header
            tag="div"
            className="text-center"
            color="light"
          >
            <strong>You have {itemsCount} notifications</strong>
          </CDropdownItem>
          <CDropdownItem><CIcon name="cil-user-follow" className="mr-2 text-success" /> New user registered</CDropdownItem>
          <CDropdownItem><CIcon name="cil-user-unfollow" className="mr-2 text-danger" /> User deleted</CDropdownItem>
          <CDropdownItem><CIcon name="cil-chart-pie" className="mr-2 text-info" /> Sales report is ready</CDropdownItem>
          <CDropdownItem><CIcon name="cil-basket" className="mr-2 text-primary" /> New client</CDropdownItem>
          <CDropdownItem><CIcon name="cil-speedometer" className="mr-2 text-warning" /> Server overloaded</CDropdownItem>
          <CDropdownItem
            header
            tag="div"
            color="light"
          >
            <strong>Server</strong>
          </CDropdownItem>
          <CDropdownItem className="d-block">
            <div className="text-uppercase mb-1">
              <small><b>CPU Usage</b></small>
            </div>
            <CProgress size="xs" color="info" value={25} />
            <small className="text-muted">348 Processes. 1/4 Cores.</small>
          </CDropdownItem>
          <CDropdownItem className="d-block">
            <div className="text-uppercase mb-1">
              <small><b>Memory Usage</b></small>
            </div>
            <CProgress size="xs" color="warning" value={70} />
            <small className="text-muted">11444GB/16384MB</small>
          </CDropdownItem>
          <CDropdownItem className="d-block">
            <div className="text-uppercase mb-1">
              <small><b>SSD 1 Usage</b></small>
            </div>
            <CProgress size="xs" color="danger" value={90} />
            <small className="text-muted">243GB/256GB</small>
          </CDropdownItem>
        </CDropdownMenu>
      </div>
    </CDropdown>
   )
}

export default TheHeaderDropdownNotif
