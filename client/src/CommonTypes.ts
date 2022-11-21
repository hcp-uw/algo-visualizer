type ExtraData =
    | {
        key: string;
        data: unknown;
        updater: Function;
    }[]
    | [];

type Coordinate = {
    x: number;
    y: number;
};

type Edge = {
    n1: string;
    n2: string;
    weight?: number | string;
};

// contains position of Node
type Node = {
    // when dragging, Draggable translate css of node instead of changing its svg x,y
    // the initial coordinate on create is important
    init: Coordinate;
    // this x,y is to make the new edge creation follows the mouse
    // and make dragging more continuous. onDragEnd can be used to set the x,y coordinate
    // of node at the end of drag, but state update takes time and it can appears that the
    // element is jumping.
    x: number;
    y: number;
};

type NodePositions = {
    [key: string]: Node;
};

export { ExtraData, Coordinate, Edge };
