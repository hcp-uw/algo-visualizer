import { Edge } from "../CommonTypes";

export const DEFAULT_NODES_1 = (center: { x: number; y: number }) => {
    return {
        "a": {
            init: { x: 150 + center.x, y: 150 + center.y },
            x: 0,
            y: 0,
        },
        "b": {
            init: { x: 150 + center.x, y: 250 + center.y },
            x: 0,
            y: 0,
        },
        "c": {
            init: { x: 250 + center.x, y: 325 + center.y },
            x: 0,
            y: 0,
        },
        "d": {
            init: { x: 250 + center.x, y: 150 + center.y },
            x: 0,
            y: 0,
        },
        "e": {
            init: { x: 250 + center.x, y: 250 + center.y },
            x: 0,
            y: 0,
        },
        "f": {
            init: { x: 350 + center.x, y: 250 + center.y },
            x: 0,
            y: 0,
        },
        "g": {
            init: { x: 450 + center.x, y: 250 + center.y },
            x: 0,
            y: 0,
        },
        "h": {
            init: { x: 450 + center.x, y: 150 + center.y },
            x: 0,
            y: 0,
        },
        "i": {
            init: { x: 350 + center.x, y: 150 + center.y },
            x: 0,
            y: 0,
        },
        "j": {
            init: { x: 300 + center.x, y: 50 + center.y },
            x: 0,
            y: 0,
        },
        "k": {
            init: { x: 350 + center.x, y: 325 + center.y },
            x: 0,
            y: 0,
        },
    };
};

export const DEFAULT_EDGES_1: Edge[] = [
    { n1: "a", n2: "b" },
    { n1: "a", n2: "d" },
    { n1: "a", n2: "f" },
    { n1: "b", n2: "c" },
    { n1: "b", n2: "e" },
    { n1: "b", n2: "i" },
    { n1: "c", n2: "g" },
    { n1: "c", n2: "k" },
    { n1: "d", n2: "f" },
    { n1: "d", n2: "j" },
    { n1: "e", n2: "f" },
    { n1: "g", n2: "h" },
    { n1: "h", n2: "i" },
    { n1: "i", n2: "j" },
];

export const DEFAULT_EDGES_2: Edge[] = [
    { n1: "a", n2: "b" , weight: 1},
    { n1: "a", n2: "d" , weight: 1},
    { n1: "a", n2: "f" , weight: 1},
    { n1: "b", n2: "c" , weight: 1},
    { n1: "b", n2: "e" , weight: 1},
    { n1: "b", n2: "i" , weight: 1},
    { n1: "c", n2: "g" , weight: 1},
    { n1: "c", n2: "k" , weight: 1},
    { n1: "d", n2: "f" , weight: 1},
    { n1: "d", n2: "j" , weight: 1},
    { n1: "e", n2: "f" , weight: 1},
    { n1: "g", n2: "h" , weight: 1},
    { n1: "h", n2: "i" , weight: 1},
    { n1: "i", n2: "j" , weight: 1},
];
