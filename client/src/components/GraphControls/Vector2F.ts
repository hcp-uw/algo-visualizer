/*
* A Vector2F represents a 2-dimensional vector 
* with an x component and a y component
*/
class Vector2F{
    x: number = 0
    y: number = 0
    
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }

  sum(other: Vector2F) : Vector2F {
    return new Vector2F(this.x + other.x, this.y + other.y);
  }

  add(other: Vector2F) : void {
    this.x += other.x;
    this.y += other.y;
  }

  diff(other: Vector2F) : Vector2F {
    return new Vector2F(this.x - other.x, this.y - other.y);
  }

  scale(scalar: number) : Vector2F {
    return new Vector2F(this.x * scalar, this.y * scalar);
  }

  static unit(a: Vector2F, b:Vector2F): Vector2F {
    let diff:Vector2F = b.diff(a);
    return diff.scale( 1.0 / Vector2F.distance(a, b));
  }

  static distance(a:Vector2F, b:Vector2F):number {
    let diff: Vector2F = a.diff(b)
    return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
  }
}

export default Vector2F
