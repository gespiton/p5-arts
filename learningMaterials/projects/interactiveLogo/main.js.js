/*
Interactive logos

jasonlabbe3d.com
twitter.com/russetPotato
*/

const SPIN_MULTIPLIER = 45;
const MIN_PARTICLE_COUNT = 200;
const MAX_PARTICLE_COUNT = 700;
const MIN_PARTICLE_SIZE = 12;
const MAX_PARTICLE_SIZE = 50;
const MIN_FORCE = 0.4;
const MAX_FORCE = 0.6;
const REPULSION_RADIUS = 100;
const REPULSION_STRENGTH = 0.25;
const IMG_RESIZED_WIDTH = 300;
const IMG_SCAN_STEPS = 2;

const DrawTypes = {
	Rect: 0,
	Ellipse: 1,
	Triangle: 2
};

var imgNames = ["facebook.png", "amazon.png", "twitter.png", "visa.png", "mcdonalds.png", "mastercard.png"];
var particles = [];
var indices = [];
var imgIndex = 0;
var drawType = 0;
var particleCount = 550;
var maxSize = 0;
var img;

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.canvas.oncontextmenu = () => false;
	loadImg(imgNames[0]);
}

function draw() {
	background(0);
	
	fill(255);
	noStroke();
	text(
		`
		** How to interact **
		Move mouse over to interact with it.
		
		** Controls **
		Left-click : Switch image
		Right-click: Show source image
		+ : Increase count
		- : Decrease count
		Space: Change particle type`, 
		50, 50);
	
	if (img == null) {
		return;
	}
	
	push();
	translate(width / 2 - img.width / 2, height / 2 - img.height / 2);
	
	fill(255);
	noStroke();
	
	rectMode(CENTER);
	
	particles.forEach(particle => {
		particle.move();
		
		push();
		translate(particle.pos.x, particle.pos.y);
		
		let spin = particle.vel.mag() * SPIN_MULTIPLIER;
		rotate(radians(particle.mapped_angle + spin));
		
		fill(particle.color);
		
		switch(drawType) {
			case DrawTypes.Ellipse:
				ellipse(0, 0, particle.size, particle.size);
				break;
			case DrawTypes.Rect:
				rect(0, 0, particle.size, particle.size);
				break;
			case DrawTypes.Triangle:
				triangle(
					particle.size * -0.5, particle.size * -0.5, 
					0, particle.size, 
					particle.size * 0.5, particle.size * -0.5);
		}
		
		pop();
	});
	
	rectMode(CORNER);
	
	if (mouseIsPressed && mouseButton == RIGHT) {
		image(img, 0, 0);
	}
	
	pop();
}

function keyPressed() {
	if (key == '+') {
		particleCount = min(particleCount + 50, MAX_PARTICLE_COUNT);
		spawnParticles();
	}
	
	if (key == '-') {
		particleCount = max(particleCount - 50, MIN_PARTICLE_COUNT);
		spawnParticles();
	}
	
	if (key == ' ') {
		nextDrawType();
	}
}

function mousePressed() {
	if (mouseButton == LEFT) {
		loadNextImg();
	}
}