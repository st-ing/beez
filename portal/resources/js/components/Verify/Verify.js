import React, {useState} from 'react';
import {logout, resend} from "../../endpoints/UserFunctions";
import './verify.css';
import history from "../history";
export const Verify = () => {
    const [error, setError] = useState(undefined);
    const handleSubmit = (e) => {
        e.preventDefault();
        resend().then(res => {
                if(res) {
                    setError(false);
                }
                else {
                    setError(true);
                }
            })
    }
    const handleBack = (e) => {
        e.preventDefault();
        return logout().then(res => {
            if(res) {
                history.push('/');
            }
            else {
                console.log('error');
            }
        })
    }
    let msg = (!error) ? 'A fresh verification link has been sent to your email address.' : 'Failed to send new verification link' ;
    let name = (!error) ? 'alert alert-success' : 'alert alert-danger' ;
    return(
        <div className="bg-image-verify">
            <div className='h-100 row align-items-center'>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header"><p className='text-dark m-0'>Verify Your Email Address</p></div>
                                <div className="card-body">
                                    <div className="p-1">
                                        {error != undefined && <div className={name} role="alert">{msg}</div>}
                                    </div><p className='text-dark m-0'>
                                    Before proceeding, please check your email for a verification link.
                                    If you did not receive the email,</p>
                                        <button type="submit" className="btn btn-link p-0 m-0 align-baseline" onClick={handleSubmit}>
                                            click here to request another
                                        </button>.
                                    <div>
                                        <button type="button" className="btn btn-secondary float-right" onClick={handleBack}>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
