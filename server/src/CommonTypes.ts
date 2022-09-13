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

type Node = {
    init: Coordinate;
    id: string;
    x: number;
    y: number;
};

type NodeMap = {
    [key: string]: Node;
};

type Edge = {
    n1: string;
    n2: string;
    weight?: number | string;
};

export { ExtraData, Coordinate, Node, NodeMap, Edge };
