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

export { ExtraData, Coordinate, Edge };
