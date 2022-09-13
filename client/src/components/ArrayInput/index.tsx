import React, { useEffect, useState } from "react";
import "./ArrayInput.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import {
    resetArrayInput,
    updateArrayInput,
    updateIsArrayInputValid,
} from "../../redux/inputStateSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { makeRandomArray } from "../../utilities/utilities";

const ArrayInput = ({ ...props }) => {
    const arrayInput = useSelector(
        (state: RootState) => state.input.arrayInput
    );

    const isArrayInputValid = useSelector(
        (state: RootState) => state.input.isArrayInputValid
    );

    // local state
    const [validInputCode, setValidInputCode] = useState<number[]>([]);

    const dispatch = useDispatch();

    const getWarningText = () => {
        let warnings = [];
        if (validInputCode.includes(1))
            warnings.push("Array must have 5-20 elements.");
        if (validInputCode.includes(2))
            warnings.push("Elements must be in range 1-99.");
        if (validInputCode.includes(3))
            warnings.push("Elements must be comma-separated.");
        return warnings;
    };

    const checkArrayInput = (arr: string[]) => {
        let code = [];
        // 5 to 20 elements, range 1-99
        if (arr.length < 5 || arr.length > 20) code.push(1);

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === "" && !code.includes(3)) code.push(3);
            else if (
                (parseInt(arr[i]) < 1 || parseInt(arr[i]) > 99) &&
                !code.includes(2)
            )
                code.push(2);
        }

        return { status: code.length === 0, code: code };
    };

    const randomizeArrayInput = (sorted: boolean) => {
        dispatch(updateArrayInput(makeRandomArray(sorted).toString()));
    };

    useEffect(() => {
        return () => {
            // reset inputs on component unmount
            dispatch(resetArrayInput());
        };
    }, []);

    return (
        <>
            {
                /* array input box  */
                <input
                    className={
                        "array-input " + (isArrayInputValid ? "" : "warning")
                    }
                    placeholder="Array"
                    value={arrayInput}
                    onKeyDown={(e) => {
                        // preventing invalid inputs here, or else the cursor will
                        // move to the end whenever user type wrong input
                        const allowedKeys = [
                            "backspace",
                            "arrowleft",
                            "arrowright",
                            "delete",
                        ];
                        if (
                            /[^\d,]/g.test(e.key) &&
                            !e.ctrlKey &&
                            !allowedKeys.includes(e.key.toLowerCase())
                        ) {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        // a second input check here whenever user copy paste input
                        // behavior: only keep the digits/comma portion of the pasted input
                        let newText = e.target.value.replace(/[^\d,]/g, "");
                        dispatch(updateArrayInput(newText));
                        let t = checkArrayInput(newText.split(","));
                        dispatch(updateIsArrayInputValid(t.status));
                        setValidInputCode(t.code);
                    }}
                ></input>
            }
            {isArrayInputValid ? null : (
                <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip-top">
                            {getWarningText().map((w) => (
                                <li key={w}>{w}</li>
                            ))}
                        </Tooltip>
                    }
                >
                    <div id="warning-icon">
                        <FontAwesomeIcon
                            icon={["fas", "triangle-exclamation"]}
                            className="fa"
                        />
                    </div>
                </OverlayTrigger>
            )}
            {/* Randomize button*/}
            <button
                className="btn"
                title="Randomize input"
                onClick={() => randomizeArrayInput(props.requestSortedArray)}
            >
                <FontAwesomeIcon icon={["fas", "shuffle"]} className="fa" />
            </button>
        </>
    );
};

export default ArrayInput;
