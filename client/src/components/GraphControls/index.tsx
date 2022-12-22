import React, {useState, useEffect, useRef} from 'react';
import "./GraphControls.css";
// onClick would be in GraphControls and import redux to this file

const GraphControls = ({...props}) => {


  return (
    <>
      <div>
        <div className="dfs-graph-controls">
          <p>
            Add Node:
          </p>
          <input type="text"></input>
        </div>
        <div className="dfs-graph-controls">
          <p>
            Remove Node:
          </p>
          <select>

          </select>
        </div>
        <div className="dfs-graph-controls">
          <p>
            Add Edge:
          </p>
          <select>
          </select>
          <select>
          </select>
        </div>
        <div className="dfs-graph-controls">
          <p>
            Remove Edge:
          </p>
          <select>
          </select>
          <select>
          </select>
        </div>
      </div>
    </>
  )
}

export default GraphControls;