let cols, rows;
let grid;
let tileSize = 30;

let agent;
let food;
let noiseScale = 0.3;
function setup() {
  createCanvas(600, 600);
  cols = floor(width / tileSize);
  rows = floor(height / tileSize);

  // Inicializa o grid com terrenos aleatórios
  grid = createRandomGrid(cols, rows);

  // Inicializa o agente em uma posição aleatória
  agent = createAgent();

  // Inicializa a comida em uma posição aleatória
  food = createFood();
}

function draw() {
  background(255);

  // Exibe o grid
  displayGrid();

  // Move o agente
  agent.move();

  // Exibe o agente
  agent.display();

  // Exibe a comida
  displayFood();
}

// Função para criar um grid com terrenos gerados usando Perlin Noise
function createRandomGrid(cols, rows) {
  let grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      let terrainType = map(noise(i * noiseScale, j * noiseScale), 0, 1, 0, 4); // 0-4 correspondendo aos tipos de terreno
      grid[i][j] = new Terrain(i, j, floor(terrainType));
    }
  }
  return grid;
}

// Função para exibir o grid
function displayGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].display();
    }
  }
}

// Função para criar o agente em uma posição aleatória, evitando obstáculos
function createAgent() {
  let x, y;
  do {
    x = floor(random(cols));
    y = floor(random(rows));
  } while (grid[x][y].type === 0); // Repete até encontrar uma posição sem obstáculo
  return new Agent(x, y);
}

// Função para exibir a comida
function displayFood() {
  fill(255, 0, 0);
  noStroke();
  star(food.x * tileSize + tileSize / 2, food.y * tileSize + tileSize / 2, 8, 15, 5);
}

// Função para desenhar uma estrela
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI / 2; a < PI * 1.5; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// Classe para representar terrenos
class Terrain {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  // Função para exibir o terreno
  display() {
    if (this.type === 0) {
      fill("#a9a9a9"); // Obstáculo (cinza)
      stroke(0);
      strokeWeight(2);
      ellipse(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize * 0.8, tileSize * 0.8);
    } else if (this.type === 1) {
      fill("#ffd700"); // Areia (amarelo)
      noStroke();
      rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    } else if (this.type === 2) {
      fill("#8b4513"); // Atoleiro (marrom)
      noStroke();
      rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    } else {
      fill("#0000ff"); // Água (azul)
      noStroke();
      rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    }
  }
}

// Classe para representar o agente
class Agent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.energy = 100; // Energia inicial do agente
  }

  // Função para mover o agente
  move() {
    // Implemente lógica de movimento aqui
    // (por exemplo, permitir movimento apenas para terrenos acessíveis e atualizar a energia)
  }

  // Função para exibir o agente
  display() {
    fill("#00ff00"); // Cor verde para o agente
    noStroke();
    triangle(
      this.x * tileSize + tileSize / 2, this.y * tileSize,
      this.x * tileSize, (this.y + 1) * tileSize,
      (this.x + 1) * tileSize, (this.y + 1) * tileSize
    );
  }

  // Função para verificar se o agente alcançou a comida
  eat(food) {
    // Implemente lógica de verificação aqui
    // (por exemplo, verificar se a posição do agente é a mesma que a posição da comida)
  }
}

// Função para criar a comida em uma posição aleatória, evitando obstáculos
function createFood() {
  let x, y;
  do {
    x = floor(random(cols));
    y = floor(random(rows));
  } while (grid[x][y].type === 0); // Repete até encontrar uma posição sem obstáculo
  return createVector(x, y);
}
