import { Node } from "../../CommonTypes";
import Vector2F from "./Vector2F";

class FruchSpring {
  l: number;
  damping: number;
  center: Vector2F;
  static a: number = 0.000001; // scalar affecting net force
  static repMult: number = 15000000.0; // strenght of repulsive force
  static c: number = 30000.0; // spring constant
  static springLen: number = 40.0; // spring ideal length
  static centerScalar = 10000; // pull towards center
  static attrScalar = 0.1; // strength of attractive force

  constructor(l: number, damping: number, centerx: number, centery: number) {
    this.l = l;
    this.damping = damping;
    this.center = new Vector2F(centerx, centery);
  }

  updateNodes(nodeArray: Node[], graph: Map<Node, Array<Node>>) {
    let nodes = new Set<Node>();

    for (let n of nodeArray) nodes.add(n);
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

  netF(n: Node, nodes: Set<Node>, graph: Map<Node, Array<Node>>): Vector2F {
    let force: Vector2F = new Vector2F(0, 0);
    let children: any = graph.get(n);

    for (let b of nodes) {
      if (b === n) continue;

      let nVec: Vector2F = new Vector2F(n.init.x, n.init.y);
      let bVec: Vector2F = new Vector2F(b.init.x, b.init.y);
      let fr = this.fRep(nVec, bVec);
      let fa = this.fAttr(nVec, bVec);

      // spring force between pairs of nodes
      if (children?.includes(b)) {
        // note this only does spring force along one direction,
        // the other direction will be handled when child's net
        // force is processed
        let fs: Vector2F = this.fSpr(nVec, bVec);
        force.add(fs);
      }

      force.add(fr);
      force.add(fa);
    }

    force.add(this.fCenter(new Vector2F(n.init.x, n.init.y)));
    return force;
  }

  fRep(n: Vector2F, o: Vector2F): Vector2F {
    let lsq: number = Math.pow(this.l, 2);
    let dist = Vector2F.distance(n, o);
    let unit = Vector2F.unit(o, n);
    return unit.scale(FruchSpring.repMult * (lsq / dist));
  }

  fAttr(n: Vector2F, o: Vector2F): Vector2F {
    let dist: number = Vector2F.distance(n, o);
    let dist2: number = Math.pow(dist, 2);
    let unit: Vector2F = Vector2F.unit(n, o);

    return unit.scale(dist2 / FruchSpring.attrScalar);
  }

  fSpr(n: Vector2F, o: Vector2F): Vector2F {
    let dist: number = Vector2F.distance(n, o);
    dist -= FruchSpring.springLen;
    let unit: Vector2F = Vector2F.unit(n, o);
    let disp: Vector2F = unit.scale(dist);
    let F: Vector2F = disp.scale(FruchSpring.c);
    return F;
  }

  fCenter(n: Vector2F): Vector2F {
    let dist: number = Vector2F.distance(n, this.center);
    let unit = Vector2F.unit(n, this.center);
    return unit.scale(dist * FruchSpring.centerScalar);
  }
}

export default FruchSpring;
