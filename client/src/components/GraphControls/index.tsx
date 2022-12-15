import React, {useState, useEffect, useRef} from 'react';
import "./GraphControls.css";

const GraphControls = ({...props}) => {


  return (
    <>
      <div id="body">
        <div className="dfs-graph-controls">
          <input type="text"></input>
          <button>
            Add Node
          </button>
        </div>
        <div className="dfs-graph-controls">
          <select>
          </select>
          <button>
            Remove Node
          </button>
        </div>
        <div className="dfs-graph-controls">
          <select className="select_two">
          </select>
          <select className="select_two">
          </select>
          <button>
            Add Edge
          </button>
        </div>
        <div className="dfs-graph-controls">
          <select className="select_two">
          </select>
          <select className="select_two">
          </select>
          <button>
            Remove Edge
          </button>
        </div>
      </div>
    </>
  )
}

export default GraphControls;