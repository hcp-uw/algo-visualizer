/**
 * Algorithm Popover Class mock interface
 */

import React, { useState } from "react";
import "./AlgorithmPopover.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AlgorithmDescription = ({...props}) => {
    const [displayModal, setDisplayModal] = useState(false);

    const handleClick = () => {
        setDisplayModal(!displayModal);
    };

    const algorithmName = props.data.algorithm;
    const algorithmDesc = props.data.title;
    const algorithmTimeComplx = props.data.description.map((listItem:string, i:number) => {
        let listField = <li key={i}>{listItem}</li>;
        return listField;
    });

    return (
        <>
            <h2>
                {algorithmName}
                {"  "}
                <FontAwesomeIcon
                    onClick={handleClick}
                    icon={["fas", "circle-info"]} 
                    className="fa"
                    id="info-icon"
                />
            </h2>

            <div className={displayModal ? "info-modal" : "hidden"}>
                {/* The popup overlay */}
                <div className="overlay" onClick={handleClick}></div>

                {/* The popup card */}
                <div className="info-popup">
                    {/* Header of card */}
                    <header>
                        <div className="close" onClick={handleClick}></div>
                        <span>{algorithmName}</span>
                    </header>

                    {/* Body of card */}
                    <section>
                        <p className="info-desc">{algorithmDesc}</p>
                        <ul>{algorithmTimeComplx}</ul>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AlgorithmDescription;
