import React from "react";
import './spinner.css'
export const Spinner = () => (
        <div className="loading text-warning">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
);
