// Particle system performance test
//
// Chrome Results:
//  "Drawing 200x times took: 1708.16ms."
//
// Firefox Results:
//  "Drawing 200x times took: 3761.27ms."
//
// Edge Results:
//  "Drawing 200x times took: 8362.05ms."
//
// IE11 Results:
//  "Drawing 200x times took: 8665.79ms."
//
// Editor results:
//  "Drawing 200x times took: 4480.28ms."
function sketch(p5) {
  p5.disableFriendlyErrors = true;

  let iterations = 200;
  let numParticles = 1000;
  let particles = [];

  p5.setup = () => {
    p5.createCanvas(800, 600);
    p5.colorMode(p5.HSB, 100);

    for (var i = 0; i < numParticles; i++) {
      particles.push({
        x: p5.random(0, p5.width),
        y: p5.random(0, p5.height),
        heading: p5.random(0, p5.TWO_PI),
        radius: p5.random(5, 10),
        color: p5.color(p5.random(70, 90), 100, 100),
      });
    }

    var start = p5.millis();
    for (let i = 0; i < iterations; i++) {
      p5.draw();
    }
    var elapsed = p5.millis() - start;
    console.log(
      'Drawing ' + iterations + 'x times took: ' + elapsed.toFixed(2) + 'ms.'
    );
  };

  p5.draw = function draw() {
    // Clear with an alpha for trail effect
    p5.background(0, 20);

    for (var i = 0; i < particles.length; i++) {
      var particle = particles[i];

      // p5.randomly adjust the heading
      particle.heading += p5.random(-p5.PI / 12, p5.PI / 12);

      // Move the particle
      particle.x += 5 * p5.cos(particle.heading);
      particle.y += 5 * p5.sin(particle.heading);

      // Wrap particles around the edges of the screen
      if (particle.x > p5.width) particle.x = particle.x - p5.width;
      else if (particle.x < 0) particle.x = p5.width + particle.x;
      if (particle.y > p5.height) particle.y = particle.y - p5.height;
      else if (particle.y < 0) particle.y = p5.height + particle.y;

      // Draw particle
      p5.fill(particle.color);
      p5.ellipse(particle.x, particle.y, particle.radius, particle.radius);
    }
  };
}

export default sketch;
