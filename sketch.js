let cols, rows;
let grid;
let tileSize = 30;

let agent;
let food;
let foodCounter = 0;
let noiseScale = 0.45;

let isSearching = true;
let exploredCells = [];

let frontier = [];
let came_from = [];
let path = [];

let searchFunction = 'bfs'; // Default search function

async function highlightExploredCells() {
  for (let cell of exploredCells) {
      let i = cell[0];
      let j = cell[1];
      fill(200, 255, 200, 100); // Set a semi-transparent gray color for explored cells
      noStroke();

      // Conditional stroke for ongoing search
      if (isSearching) {
        stroke(169, 169, 169); // Blue stroke during the search phase
        strokeWeight(2);
      }

      rect(i * tileSize, j * tileSize, tileSize, tileSize);

      // Reset stroke settings after drawing the cell
      noStroke();
  }
}

function getTerrainCost(terrainType) {
  switch (terrainType) {
    case 1:
      return 1; // Cost for type 1
    case 2:
      return 5; // Cost for type 2
    case 3:
      return 10; // Cost for type 3
    default:
      return 1; // Default cost if the type is not recognized
  }
}


async function bfs(start, goal) {
  isSearching = true;

  let frontier = [];
  frontier.push(start);
  let came_from = {};
  came_from[start] = null;

  while (frontier.length > 0 ) {
    let current = frontier.shift();

    if (current[0] === goal[0] && current[1] === goal[1]) {
      break;
    }

    exploredCells.push(current);

    for (let next of neighbors(current)) {
      if (!(next in came_from) ) {
        frontier.push(next);
        came_from[next] = current;
      }
    }
    // add delay to see the search process
    if (isSearching) {
      await new Promise(r => setTimeout(r, 30));
    }
  }

  let current = goal;
  path = [];

  while (current[0] !== start[0] || current[1] !== start[1]) {
    path.push(current);
    current = came_from[current];
  }

  path.push(start); // opcional
  path.reverse();// opcional
  isSearching = false;
}

async function dfs(start, goal) {
  isSearching = true;

  let stack = [];
  stack.push(start);
  let came_from = {};
  came_from[start] = null;

  while (stack.length > 0 ) {
    let current = stack.pop();

    if (current[0] === goal[0] && current[1] === goal[1]) {
      break;
    }

    exploredCells.push(current);

    for (let next of neighbors(current)) {
      if (!(next in came_from) ) {
        stack.push(next);
        came_from[next] = current;
      }
    }

    // add delay to see the search process
    if (isSearching) {
      await new Promise(r => setTimeout(r, 30));
    }
  }

  let current = goal;
  path = [];

  while (current[0] !== start[0] || current[1] !== start[1]) {
    path.push(current);
    current = came_from[current];
  }

  path.push(start);
  path.reverse();
  isSearching = false;
}

async function ucs(start, goal) {
  isSearching = true;
  let priorityQueue = new PriorityQueue();
  priorityQueue.enqueue(start, 0);
  let came_from = {};
  let cost_so_far = {};
  came_from[start] = null;
  cost_so_far[start] = 0;

  while (!priorityQueue.isEmpty() ) {
    let current = priorityQueue.dequeue();

    if (current[0] === goal[0] && current[1] === goal[1]) {
      break;
    }


    for (let next of neighbors(current)) {
      let newCost = cost_so_far[current] + getTerrainCost(grid[current[0]][current[1]].type);
      if (!(next in came_from) || newCost < cost_so_far[next] ) {
        exploredCells.push(next);
        cost_so_far[next] = newCost;
        priorityQueue.enqueue(next, newCost);
        came_from[next] = current;
      }
    }

    // add delay to see the search process
    if (isSearching) {
      await new Promise(r => setTimeout(r, 30));
    }
  }

  let current = goal;
  path = [];

  while (current[0] !== start[0] || current[1] !== start[1]) {
    path.push(current);
    current = came_from[current];
  }

  path.push(start);
  path.reverse();
  isSearching = false;
}

async function heuristic(node, goal) { //distancia de manhattan
  return abs(node[0] - goal[0]) + abs(node[1] - goal[1]);
}

async function greedySearch(start, goal) {
  isSearching = true;

  let priorityQueue = new PriorityQueue();
  priorityQueue.enqueue(start, 0);
  let came_from = {};
  came_from[start] = null;

  while (!priorityQueue.isEmpty() ) {
    let current = priorityQueue.dequeue();

    if (current[0] === goal[0] && current[1] === goal[1]) {
      break;
    }


    for (let next of neighbors(current)) {
      if (!(next in came_from) ) {
        exploredCells.push(next);
        priorityQueue.enqueue(next, heuristic(next, goal) + getTerrainCost(grid[next[0]][next[1]].type));
        came_from[next] = current;
      }
    }

    // add delay to see the search process
    if (isSearching) {
      await new Promise(r => setTimeout(r, 30));
    }
  }

  let current = goal;
  path = [];

  while (current[0] !== start[0] || current[1] !== start[1]) {
    path.push(current);
    current = came_from[current];
  }

  path.push(start);
  path.reverse();
  isSearching = false;
}

async function aStar(start, goal) {
  isSearching = true;

  let priorityQueue = new PriorityQueue();
  priorityQueue.enqueue(start, 0);
  let came_from = {};
  let cost_so_far = {};
  came_from[start] = null;
  cost_so_far[start] = 0;

  while (!priorityQueue.isEmpty() ) {
    let current = priorityQueue.dequeue();

    if (current[0] === goal[0] && current[1] === goal[1]) {
      break;
    }


    for (let next of neighbors(current)) {
      let newCost = cost_so_far[current] + getTerrainCost(grid[current[0]][current[1]].type);
      if (!(next in cost_so_far) || newCost < cost_so_far[next] ) {
        exploredCells.push(next);
        cost_so_far[next] = newCost;
        let priority = newCost + heuristic(next, goal) + getTerrainCost(grid[next[0]][next[1]].type);
        priorityQueue.enqueue(next, priority);
        came_from[next] = current;
      }
    }

    // add delay to see the search process
    if (isSearching) {
      await new Promise(r => setTimeout(r, 30));
    }
  }

  let current = goal;
  path = [];

  while (current[0] !== start[0] || current[1] !== start[1]) {
    path.push(current);
    current = came_from[current];
  }

  path.push(start);
  path.reverse();
  isSearching = false;
}

function neighbors(current) {
  let n = [];
  if (current[0] + 1 <= 19 && grid[current[0] + 1][current[1]].type !== 0) {
    n.push([current[0] + 1, current[1]]);
  }

  if (current[0] - 1 >= 0 && grid[current[0] - 1][current[1]].type !== 0) {
    n.push([current[0] - 1, current[1]]);
  }

  if (current[1] + 1 <= 19 && grid[current[0]][current[1] + 1].type !== 0) {
    n.push([current[0], current[1] + 1]);
  }

  if (current[1] - 1 >= 0 && grid[current[0]][current[1] - 1].type !== 0) {
    n.push([current[0], current[1] - 1]);
  }
  return n;
}

async function setup() {
  createCanvas(800, 800);
  cols = floor(600 / tileSize);
  rows = floor(600 / tileSize);

  // Inicializa o grid com terrenos aleatórios
  grid = createRandomGrid(cols, rows);

  // Inicializa o agente em uma posição aleatória
  agent = createAgent();

  // Inicializa a comida em uma posição aleatória
  food = createFood();

  // Create buttons for search functions
  let bfsButton = createButton('BFS');
  bfsButton.position(610, 60);
  bfsButton.mousePressed(async () => {
    searchFunction = 'bfs';
    resetAgentAndFood();
  });

  let dfsButton = createButton('DFS');
  dfsButton.position(610, 90);
  dfsButton.mousePressed(async () => {
    searchFunction = 'dfs';
    resetAgentAndFood();
  });

  let ucsButton = createButton('UCS');
  ucsButton.position(610, 120);
  ucsButton.mousePressed(async () => {
    searchFunction = 'ucs';
    resetAgentAndFood();
  });

  let greedySearchButton = createButton('Greedy Search');
  greedySearchButton.position(610, 150);
  greedySearchButton.mousePressed(async () => {
    searchFunction = 'greedySearch';
    resetAgentAndFood();
  });

  let aStarButton = createButton('A*');
  aStarButton.position(610, 180);
  aStarButton.mousePressed(async () => {
    searchFunction = 'aStar';
    resetAgentAndFood();
  });

  await searchProcess(searchFunction);
}

async function draw() {
  background(255);

  // Exibe o grid
  displayGrid();

  // Exibe o agente
  agent.display();

  // Exibe a comida
  displayFood();

  // Atualiza a posição do agente
  agent.update();

  // Verifica se o agente alcançou a comida
  await agent.eat();

  // Exibe o contador de comidas na tela
  fill(0);
  textSize(20);
  text("Comidas: " + foodCounter, 610, 30);
  // Exibe a função de busca na tela
  text("Busca: " + searchFunction, 610, 50);

  if (!isSearching) {
    agent.move();
  }
    highlightExploredCells();
}

async function searchProcess(searchFunction) {
  isSearching = false;
  console.log({ searchFunction });
  // Reinicia o processo de busca
  switch (searchFunction) {
    case 'bfs':
      console.log('bfs');
      await bfs([agent.pos.x, agent.pos.y], [food.x, food.y]);
      break;
    case 'dfs':
      console.log('dfs');
      await dfs([agent.pos.x, agent.pos.y], [food.x, food.y]);
      break;
    case 'ucs':
      console.log('ucs');
      await ucs([agent.pos.x, agent.pos.y], [food.x, food.y]);
      break;
    case 'greedySearch':
      console.log('greedySearch');
      await greedySearch([agent.pos.x, agent.pos.y], [food.x, food.y]);
      break;
    case 'aStar':
      console.log('aStar');
      await aStar([agent.pos.x, agent.pos.y], [food.x, food.y]);
      break;
    default:
      await bfs([agent.pos.x, agent.pos.y], [food.x, food.y]);
      break;
  }
}

async function resetAgentAndFood() {
  // Reset explored cells
  exploredCells = [];
  // Reset agent position
  agent = createAgent();
  // Reset food position
  food = createFood();
  // Reset search phase
  isSearching = true;
  await searchProcess(searchFunction);
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
      for (let cord of path) {
        if (cord[0] === i && cord[1] === j) {
          grid[i][j].displayPath();
        }
      }

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

// Função para criar a comida em uma posição aleatória, evitando obstáculos
function createFood() {
  let x, y;
  do {
    x = floor(random(cols));
    y = floor(random(rows));
  } while (grid[x][y].type === 0); // Repete até encontrar uma posição sem obstáculo
  return createVector(x, y);
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

  displayPath() {
    if (this.type === 1) {
      fill("#ffd700"); // Areia (amarelo)
      stroke("#FF0000");
      rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    } else if (this.type === 2) {
      fill("#8b4513"); // Atoleiro (marrom)
      stroke("#FF0000");
      rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    } else {
      fill("#0000ff"); // Água (azul)
      stroke("#FF0000");
      rect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    }
  }
}

// Classe para representar o agente
class Agent {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.direction = true;
    this.maxSpeed = 1;
    this.maxForce = 0.25;
    this.energy = 100; // Energia inicial do agente
  }

  seek(target, speed) {
    let force = p5.Vector.sub(target, this.pos);
    force.setMag(this.maxSpeed * speed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  // Função para mover o agente
  move() {
    // Verifica se há um caminho disponível para a comida
    if (path.length > 0) {
      // Obtém a próxima posição no caminho
      let nextPosition = path[0];

      // Verifica o tipo de terreno da próxima posição
      let nextTerrainType = grid[nextPosition[0]][nextPosition[1]].type;

      // Define a velocidade com base no tipo de terreno
      let speed = 0.1; // Velocidade padrão
      if (nextTerrainType === 2) {
        speed = 0.05; // Atoleiro (velocidade reduzida)
      } else if (nextTerrainType === 3) {
        speed = 0.025; // Água (velocidade reduzida)
      }

      // Move o agente em direção à próxima posição no caminho
      this.seek(createVector(nextPosition[0], nextPosition[1]), speed);

      // Atualiza a energia do agente com base na velocidade
      this.energy -= speed;

      // Verifica se o agente chegou próximo o suficiente à posição intermediária
      if (dist(this.pos.x, this.pos.y, nextPosition[0], nextPosition[1]) <= 1) {
        // Remove a próxima posição do caminho
        path.shift();
      }
    }
  }

  // Função para exibir o agente
  display() {
    fill("#00ff00"); // Cor verde para o agente
    noStroke();
    triangle(
      this.pos.x * tileSize + tileSize / 2, this.pos.y * tileSize,
      this.pos.x * tileSize, (this.pos.y + 1) * tileSize,
      (this.pos.x + 1) * tileSize, (this.pos.y + 1) * tileSize
    );
  }

  // Função para verificar se o agente alcançou a comida
  async eat() {
    // Calcula a distância entre a posição do agente e a posição da comida
    let distance = dist(this.pos.x, this.pos.y, food.x, food.y);

    // Verifica se a distância é menor ou igual a 1
    if (distance <= 1) {
      // Se a distância for menor ou igual a 1, o agente pode comer a comida

      // Remove a comida do terreno
      grid[food.x][food.y].type = 1; // Define o tipo de terreno como "areia" (ou qualquer outro tipo adequado)
      // Remove o stroke da comida
      noStroke();

      // Incrementa o contador de comidas
      foodCounter++;
      await resetAgentAndFood();
    }
  }
}

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  // Enqueue a new element with a priority
  enqueue(element, priority) {
    this.queue.push({ element, priority });
    this.sortQueue();
  }

  // Dequeue the element with the highest priority
  dequeue() {
    return this.queue.shift().element;
  }

  // Check if the priority queue is empty
  isEmpty() {
    return this.queue.length === 0;
  }

  // Sort the queue based on priorities (ascending order)
  sortQueue() {
    this.queue.sort((a, b) => a.priority - b.priority);
  }
}
