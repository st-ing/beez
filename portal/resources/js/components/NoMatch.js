import React, {useState} from 'react';
import {logout, register} from "../endpoints/UserFunctions";
import { useHistory } from "react-router-dom";

export default function NoMatch() {
    let history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        logout().then(res => {
                if(res) {
                    history.push('/')
                }
                else {
                    console.log('error');
                }
            }
        )}
    return(
        <div>
            <h2>No Match</h2>
                <button className='btn-primary' onClick={handleSubmit}>
                    Logout
                </button>
        </div>
    )
}
