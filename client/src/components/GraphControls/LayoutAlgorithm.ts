import { Coordinate, Edge, Node, NodePositions } from "../../CommonTypes";

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

    updateNodes(nodeArray: Node[]) {
        let nodes = new Set<Node>();

        for (let n of nodeArray) { nodes.add(n)}
        let forces = new Map<Node, Vector2F>();

        for (let n of nodes) {
          forces.set(n, this.netF(n, nodes));
        }

        for (let n of nodes) {
          let force = forces.get(n);
          if (!force) continue;

          n.x += FruchSpring.a * this.damping * force.x;
          n.y += FruchSpring.a * this.damping * force.y;
        }
    }

    netF(n:Node, nodes:Set<Node>): Vector2F {
      let force:Vector2F = new Vector2F(0, 0);
      
      for (let b of nodes){
        if (b === n) continue;

        let nVec: Vector2F = new Vector2F(n.x, n.y);
        let bVec: Vector2F = new Vector2F(b.x, b.y);
        let fr = this.fRep(nVec, bVec);
        let fa = this.fAttr(nVec, bVec);

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
}
//   public void updateNodes(Graph g) {
//     Set<Node> nodes = g.getNodes();
//     HashMap<Node, Vec2D> forces = new HashMap<Node, Vec2D>();
//     for(Node n : nodes){
//       forces.put(n, netF(n, nodes, g));
//     }

//     for (Node n : nodes){
//       Vec2D force = forces.get(n);
//       n.x += a * damping * force.x;
//       n.y += a * damping * force.y;
//     }
//     this.damping *= damping;
//   }

//   private Vec2D netF(Node n, Set<Node> nodes, Graph g) {
//     Vec2D force = new Vec2D(0.0f, 0.0f);
//     Set<Node> children = g.getChildren(n);

//     for (Node b : nodes) {
//       if (b.equals(n)) continue;

//       Vec2D nVec = new Vec2D(n.x, n.y);
//       Vec2D bVec = new Vec2D(b.x, b.y);
//       Vec2D fr = fRep(nVec, bVec);
//       Vec2D fa = fAttr(nVec, bVec);
//       // only apply spring force if there is an edge (probably exists better way to structure this)
//       if (children.contains(b)) {
//         Vec2D fs = fSpr(nVec, bVec);
//         force.add(fs);
//       }

//       force.add(fr);
//       force.add(fa);
//     }

//     return force;
//   }

//   private Vec2D fRep(Vec2D n, Vec2D o) {
//     float lsq = (float) Math.pow(this.l, 2);
//     float dist = Vec2D.distance(n, o);
//     Vec2D unit = Vec2D.unit(o, n);
//     return unit.scale( repMult * (lsq / dist));
//   }

//   private Vec2D fAttr(Vec2D n, Vec2D o) {
//     float dist = Vec2D.distance(n, o);
//     float dist2 = (float) Math.pow(dist, 2);
//     Vec2D unit = Vec2D.unit(n, o);

//     return unit.scale(dist2 / this.l);
//   }

//   private Vec2D fSpr(Vec2D n, Vec2D o) {
//     // f = -k(x - l)
//     float dist = Vec2D.distance(n, o);
//     dist -= springLen;
//     Vec2D unit = Vec2D.unit(n, o);
//     Vec2D disp = unit.scale(dist); // displacement
//     Vec2D F = disp.scale(c);
//     return F;
//   }
  
// }
