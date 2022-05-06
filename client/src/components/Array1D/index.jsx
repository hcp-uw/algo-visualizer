/**
 * Handle the display of the 1D array.
 */

import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Array1D.css";

const Array1D = (props) => {
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
                        {[...Array(15).keys()].map((v) => (
                            <td key={v * Math.random()}>{v}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Array1D;
