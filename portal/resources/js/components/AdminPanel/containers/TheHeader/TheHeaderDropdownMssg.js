import React, {useRef, useState} from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import BeeAvatar4 from '@BeesImages/avatars/4.jpg';
import BeeAvatar5 from '@BeesImages/avatars/5.jpg';
import BeeAvatar6 from '@BeesImages/avatars/6.jpg';
import BeeAvatar7 from '@BeesImages/avatars/7.jpg';
import {useDispatch, useSelector} from "react-redux";
import {useOnClickOutside} from "../../../Utilities/helpers";


const TheHeaderDropdownMssg = () => {
  const [isOpen,setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const isMessagesClicked = useSelector(state => state.headerState.isMessagesClicked)
  const itemsCount = 5;
  let domNode = useRef()
  useOnClickOutside({domNode, isOpen}, () =>{
    setIsOpen(false)
    dispatch({type: 'setHeaderVisible', isMessagesClicked: false,})
  })
  const onToggleClick = () => {
    setIsOpen(true)
    dispatch({
      type: 'setHeaderVisible',
      isMessagesClicked: !isMessagesClicked,
    })
  }
  return (
    <CDropdown
      inNav
      className="c-header-nav-item px-2 d-flex h-100"
      direction="down"
    >
      <div className='d-flex h-100' ref={domNode}>
        <CDropdownToggle onClick={() => onToggleClick()} className="c-header-nav-link" caret={false}>
          {isMessagesClicked ?<CIcon name="yellow-message-icon"/> : <CIcon name="message-icon"/>}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
        >
          <strong>You have {itemsCount} messages</strong>
        </CDropdownItem>
        <CDropdownItem href="#">
          <div className="message">
            <div className="pt-3 mr-3 float-left">
              <div className="c-avatar">
                <CImg
                  src={BeeAvatar7}
                  className="c-avatar-img"
                  alt="admin@bootstrapmaster.com"
                />
                <span className="c-avatar-status bg-success"></span>
              </div>
            </div>
            <div>
              <small className="text-muted">John Doe</small>
              <small className="text-muted float-right mt-1">Just now</small>
            </div>
            <div className="text-truncate font-weight-bold">
              <span className="fa fa-exclamation text-danger"></span> Important message
            </div>
            <div className="small text-muted text-truncate">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
            </div>
          </div>
        </CDropdownItem>

        <CDropdownItem href="#">
          <div className="message">
            <div className="pt-3 mr-3 float-left">
              <div className="c-avatar">
                <CImg
                  src={BeeAvatar6}
                  className="c-avatar-img"
                  alt="admin@bootstrapmaster.com"
                />
                <span className="c-avatar-status bg-warning"></span>
              </div>
            </div>
            <div>
              <small className="text-muted">Jane Dovve</small>
              <small className="text-muted float-right mt-1">5 minutes ago</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <div className="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
            </div>
          </div>
        </CDropdownItem>

        <CDropdownItem href="#">
          <div className="message">
            <div className="pt-3 mr-3 float-left">
              <div className="c-avatar">
                <CImg
                  src={BeeAvatar5}
                  className="c-avatar-img"
                  alt="admin@bootstrapmaster.com"
                />
                <span className="c-avatar-status bg-danger"></span>
              </div>
            </div>
            <div>
              <small className="text-muted">Janet Doe</small>
              <small className="text-muted float-right mt-1">1:52 PM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <div className="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
            </div>
          </div>
        </CDropdownItem>

        <CDropdownItem href="#">
          <div className="message">
            <div className="pt-3 mr-3 float-left">
              <div className="c-avatar">
                <CImg
                  src={BeeAvatar4}
                  className="c-avatar-img"
                  alt="admin@bootstrapmaster.com"
                />
                <span className="c-avatar-status bg-info"></span>
              </div>
            </div>
            <div>
              <small className="text-muted">Joe Doe</small>
              <small className="text-muted float-right mt-1">4:03 AM</small>
            </div>
            <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
            <div className="small text-muted text-truncate">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
            </div>
          </div>
        </CDropdownItem>
        <CDropdownItem href="#" className="text-center border-top"><strong>View all messages</strong></CDropdownItem>
      </CDropdownMenu>
      </div>
    </CDropdown>
  )
}

export default TheHeaderDropdownMssg
