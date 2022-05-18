/**
 * Handle the display of the 1D array.
 */

import "./Array1D.css";
import { useSelector } from "react-redux";

const Array1D = (props) => {
    const array = useSelector((state) => state.global.array);

    return (
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
    );
};

export default Array1D;
