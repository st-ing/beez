import {CToast, CToastHeader, CToastBody, CToaster} from '@coreui/react'
import React, {useState} from "react";

const NotifyToaster = ({toasts,header}) => {

  const toasters = (()=>{
    return toasts.reduce((toasters, toast) => {
      toasters[toast.position] = toasters[toast.position] || []
      toasters[toast.position].push(toast)
      return toasters
    }, {})
  })()

return(
  <>
    {Object.keys(toasters).map((toasterKey) => (
        <CToaster
          position={toasterKey}
          key={'toaster' + toasterKey}
        >
          {
            toasters[toasterKey].map((toast, key)=>{
              return(
                <CToast
                  style={{flexBasis: '100px'}}
                  key={'toast' + key}
                  show={true}
                  autohide={toast.autohide}
                  fade={toast.fade}
                >
                  <CToastHeader className='text-danger' closeButton={toast.closeButton}>
                    {header}
                  </CToastHeader>
                  <CToastBody>
                    {toast.content}
                  </CToastBody>
                </CToast>
              )
            })
          }
        </CToaster>
      ))}
    </>
  )
}

export default NotifyToaster
