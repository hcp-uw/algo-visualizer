import React, { useEffect } from "react";
import "./SingleInput.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import {
    resetSingleInput,
    updateSingleInput,
} from "../../redux/inputStateSlice";

const SingleInput = ({ ...props }) => {
    const singleInput = useSelector(
        (state: RootState) => state.input.singleInput
    );
    //const inputBoxRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();

    // // function that update input box
    // const updateTargetBoxValue = (e: React.MouseEvent<HTMLElement>) => {
    //     let inputBox = e.target as HTMLInputElement;
    //     if (inputBoxRef.current) {
    //         inputBoxRef.current.value = inputBox.innerHTML;
    //         setNumInput(inputBox.innerHTML);
    //     }
    // };

    useEffect(() => {
        return () => {
            // reset inputs on component unmount
            dispatch(resetSingleInput());
        };
    }, []);

    return (
        <input
            //ref={inputBoxRef}
            className="single-input blue-box"
            type="number"
            placeholder="Search"
            value={singleInput}
            onChange={(e) => {
                dispatch(updateSingleInput(e.target.value));
            }}
        ></input>
    );
};

export default SingleInput;
