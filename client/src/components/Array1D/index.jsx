/**
 * Handle the display of the 1D array.
 */

import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Array1D.css";
import { useSelector } from "react-redux";

const Array1D = (props) => {
    let array = useSelector((state) => state.global.array);

    return (
        <div className="table-container">
            <table className="elements">
                <tbody>
                    {/* Draw the individual array elements.
                     * Using the drawBlock() function from the parent component.
                     */}
                    <tr className="value-row">
                        <td></td>
                        {props.drawBlocks()}
                    </tr>
                    {/* Draw the indexes below the main array. Currently hardcoded for 15 elements */}
                    <tr className="index-row">
                        <td>Index</td>
                        {[...Array(array.length).keys()].map((v) => (
                            <td key={v * Math.random()}>{v}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Array1D;
