import React from 'react';

/* From Uiverse.io by catraco */ 
export default function Back() {
    return (
        <div>          
            <button className="cursor-pointer duration-200 hover:scale-125 active:scale-100" title="Go Back">
            <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 24 24" className="stroke-lightBlue">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" d="M11 6L5 12M5 12L11 18M5 12H19"></path>
            </svg>
            </button>
        </div>
    )
}