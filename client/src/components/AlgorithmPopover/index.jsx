/**
 * Algorithm Popover Class mock interface
 */

import React, { useState } from "react";
import "./AlgorithmPopover.css"


const AlgorithmDescription = (props) => {
    const [displayModal, setDisplayModal] = useState(false)

    const handleClick = () => {
        setDisplayModal(!displayModal)
    }

    const algorithm = props.data.algorithm
    const algorithmTitle = props.data.title
    const algorithmDescription = props.data.description.map((listItem) => {
        let listField = <li key={listItem}>{listItem}</li>;
        return listField;
    })

    return (
        <>
            <div className="col-2">
                <button className="popover-button" onClick={handleClick}>Information on algorithm / tutorial</button>
                <div className={"algo-modal" + (displayModal ? "-block" : "")} id="algo-modal">
                    <div className="algo-modal-header">
                        <div className="algo-title">{algorithm}</div>
                        <button className="algo-close-button" onClick={handleClick}>&times;</button>
                    </div>
                    <div className="algo-modal-body">
                        <p className="algo-desc">
                            {algorithmTitle}
                        </p>
                        <ul>
                            {algorithmDescription}
                        </ul>
                    </div>
                </div>
            </div>
            <div className={"overlay-toggler" + (displayModal ? "-block" : "")} onClick={handleClick}></div>
        </>
    );
}

export default AlgorithmDescription