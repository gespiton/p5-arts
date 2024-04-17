import { Vector } from "p5"
import p5 from 'p5';
import { PerlinNoise } from "../../utils/PerlinNoise";

type BoidConfig = {
  p: p5,
  position: Vector,
  maxSpeed: number,
  maxForce: number,
  radius: number,
  velocity: Vector,
  separationRadius?: number,
  alignmentRadius?: number,
  cohesionRadius?: number,
  render?: (b: Boid) => void,
  color?: Vector
}

class Boid {
  acceleration: Vector
  velocity: Vector
  position: Vector
  boidRadius: number
  maxSpeed: number
  maxForce: number
  config: BoidConfig
  separationRadius: number
  alignmentRadius: number
  cohesionRadius: number
  livenessNoise: PerlinNoise
  color: Vector
  colorAcc: Vector = new Vector(0, 0, 0)

  constructor(config: BoidConfig) {
    this.acceleration = new Vector(0, 0)
    this.velocity = config.velocity
    this.position = config.position
    this.boidRadius = config.radius
    this.maxSpeed = config.maxSpeed
    this.maxForce = config.maxForce
    this.config = config
    this.separationRadius = config.separationRadius ?? 25
    this.alignmentRadius = config.alignmentRadius ?? 50
    this.cohesionRadius = config.cohesionRadius ?? 10
    this.livenessNoise = new PerlinNoise({
      p: config.p,
      step: 0.1,
      xOffset: config.p.random(10000),
      range: [0, 1]
    })
    this.color = config.color ?? new Vector(255, 255, 255)
  }

  applyForce(force: Vector) {
    this.acceleration.add(force)
  }

  update() {
    this.acceleration.limit(this.maxForce)
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxSpeed)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
    this.color = this.color.add(this.colorAcc)
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target: Vector) {
    const desired = target.copy().sub(this.position)
    desired.setMag(this.maxSpeed)
    const steer = desired.copy().sub(this.velocity)
    steer.limit(this.maxForce)
    return steer
  }

  flock(boids: Boid[]) {
    const alignment = this.align(boids)
    const cohesion = this.cohesion(boids)
    const separation = this.separation(boids)
    this.colorAcc = this.getColor(boids)
    alignment.mult(1)
    cohesion.mult(1)
    separation.mult(0.5)
    this.applyForce(alignment)
    this.applyForce(cohesion)
    this.applyForce(separation)
  }

  borders() {
    const width = this.config.p.width
    const height = this.config.p.height
    if (this.position.x < -this.boidRadius) this.position.x = width + this.boidRadius
    if (this.position.y < -this.boidRadius) this.position.y = height + this.boidRadius
    if (this.position.x > width + this.boidRadius) this.position.x = -this.boidRadius
    if (this.position.y > height + this.boidRadius) this.position.y = -this.boidRadius
  }

  // Separation
  // Method checks for nearby boids and steers away
  separation(boids: Boid[]) {
    const perceptionRadius = this.separationRadius
    const steering = new Vector()
    let total = 0
    for (const other of boids) {
      const distance = this.position.dist(other.position)
      if (other !== this && distance < perceptionRadius) {
        const diff = this.position.copy().sub(other.position)
        diff.div(distance)
        steering.add(diff)
        total++
      }
    }
    if (total > 0) {
      steering.div(total)
    }

    if (steering.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steering.setMag(this.maxSpeed)
      steering.sub(this.velocity)
      steering.limit(this.maxForce)
    }
    return steering
  }

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  align(boids: Boid[]) {
    const perceptionRadius = this.alignmentRadius
    const steering = new Vector()
    let total = 0
    for (const other of boids) {
      const distance = this.position.dist(other.position)
      if (other !== this && distance < perceptionRadius) {
        steering.add(other.velocity)
        total++
      }
    }
    if (total > 0) {
      steering.div(total)
      steering.setMag(this.maxSpeed)
      steering.sub(this.velocity)
      steering.limit(this.maxForce)
    }
    return steering
  }

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  cohesion(boids: Boid[]) {
    const perceptionRadius = this.cohesionRadius
    const steering = new Vector()
    let total = 0
    for (const other of boids) {
      const distance = this.position.dist(other.position)
      if (other !== this && distance < perceptionRadius) {
        steering.add(other.position)
        total++
      }
    }
    if (total > 0) {
      steering.div(total)
      steering.sub(this.position)
      steering.setMag(this.maxSpeed)
      steering.sub(this.velocity)
      steering.limit(this.maxForce)
    }
    return steering
  }

  getColor(boids: Boid[]) {
    let newColorAcc = this.color.copy()
    let neighborCount = 0;
    for (const other of boids) {
      if (other === this) continue
      if (this.position.dist(other.position) < 30) {
        newColorAcc.add(other.color)
        neighborCount++
      }
    }
    if (neighborCount > 0) {
      newColorAcc.div(neighborCount)
      // newColorAcc.setMag(10)
      newColorAcc.sub(this.color)
      newColorAcc.limit(10)
    }
    return newColorAcc
  }

  run(boids: Boid[]) {
    this.flock(boids)
    this.update()
    this.borders()
    this.render()
  }

  render() {
    if (this.config.render) {
      this.config.render(this)
      return
    }
    const p = this.config.p
    const theta = this.velocity.heading() + p.PI / 2
    p.push()
    p.translate(this.position.x, this.position.y)
    p.rotate(theta)
    p.beginShape()
    p.vertex(0, -this.boidRadius * 2)
    p.vertex(-this.boidRadius, this.boidRadius * 2)
    p.vertex(this.boidRadius, this.boidRadius * 2)
    p.endShape(p.CLOSE)
    p.pop()
  }
}
export { Boid }