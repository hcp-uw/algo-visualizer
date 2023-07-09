import { Coordinate, Edge, Node, NodePositions } from "../../CommonTypes";
import Vector2F from "./Vector2F";

class FruchSpring {
    l: number;
    damping: number;
    static a:number = 0.000001;
    static repMult:number = 15000000.0;
    static c:number = 30000.0; // spring constant
    static springLen:number = 40.0; // spring ideal length

    constructor(l: number, damping: number) {
        this.l = l;
        this.damping = damping;
    }

    updateNodes(nodeArray: Node[], graph: Map<Node, Array<Node>>) {
        let nodes = new Set<Node>();

        for (let n of nodeArray) { nodes.add(n)}
        let forces = new Map<Node, Vector2F>();

        for (let n of nodes) {
          forces.set(n, this.netF(n, nodes, graph));
        }

        for (let n of nodes) {
          let force = forces.get(n);
          if (!force) continue;

          n.init.x += FruchSpring.a * this.damping * force.x;
          n.init.y += FruchSpring.a * this.damping * force.y;
        }
    }

    netF(n:Node, nodes:Set<Node>, graph: Map<Node, Array<Node>>): Vector2F {
      let force:Vector2F = new Vector2F(0, 0);
      let children: any = graph.get(n)
      
      for (let b of nodes){
        if (b === n) continue;

        let nVec: Vector2F = new Vector2F(n.init.x, n.init.y);
        let bVec: Vector2F = new Vector2F(b.init.x, b.init.y);
        let fr = this.fRep(nVec, bVec);
        let fa = this.fAttr(nVec, bVec);

        if (children.includes(b)) {
          let fs:Vector2F = this.fSpr(nVec, bVec);
          // Vec2D fs = fSpr(nVec, bVec);
          force.add(fs);
        }

        // forces
        force.add(fr)
        force.add(fa)
      }

      return force;
    }

    fRep(n: Vector2F, o: Vector2F):Vector2F {
      let lsq:number = Math.pow(this.l, 2);
      let dist = Vector2F.distance(n, o);
      let unit = Vector2F.unit(o, n);
      return unit.scale(FruchSpring.repMult *  (lsq / dist));
    }

    fAttr(n: Vector2F, o: Vector2F): Vector2F{
      let dist:number = Vector2F.distance(n, o);
      let dist2: number = Math.pow(dist, 2);
      let unit:Vector2F = Vector2F.unit(n, o);

      return unit.scale(dist2 / this.l);
    }

    fSpr(n: Vector2F, o: Vector2F): Vector2F {
      let dist: number = Vector2F.distance(n, o);
      dist -= FruchSpring.springLen;
      let unit:Vector2F = Vector2F.unit(n, o);
      let disp:Vector2F = unit.scale(dist);
      let F:Vector2F = disp.scale(FruchSpring.c);
      return F;
    }
}

export default FruchSpring;
