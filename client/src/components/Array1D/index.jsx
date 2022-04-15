/**
 * Handle the display of the 1D array.
 */

import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Array1D.css";

class Array1D extends React.Component {
    render = () => {
        return (
            <div className="table-container">
                <table ref={this.props.boardRef} className="elements">
                    <tbody>
                        {/* Draw the individual array elements.
                         * Using the drawBlock() function from the parent component.
                         */}
                        <tr className="value-row">
                            <td></td>
                            {this.props.drawBlocks()}
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
}

export default Array1D;
