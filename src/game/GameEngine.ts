export const ELEMENTS = {
  FIRE: 'FIRE',
  FROST: 'FROST',
  ARCANE: 'ARCANE',
  LIGHTNING: 'LIGHTNING',
} as const;

export type ElementType = keyof typeof ELEMENTS;

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  pos: Vector2;
  radius: number;
  hp: number;
  maxHp: number;
}

export interface Projectile {
  id: string;
  pos: Vector2;
  vel: Vector2;
  radius: number;
  elements: ElementType[];
  ownerId: string;
  lifetime: number;
  damage: number;
  color: string;
  particles: any[];
}

export interface Particle {
  pos: Vector2;
  vel: Vector2;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  
  width: number;
  height: number;
  
  player: Entity;
  enemy: Entity;
  projectiles: Projectile[] = [];
  particles: Particle[] = [];

  lastTime: number = 0;
  running: boolean = false;
  
  // Joystick input from React (-1 to 1)
  playerInput: Vector2 = { x: 0, y: 0 };
  
  onGameOver?: (won: boolean) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;

    this.player = {
      id: 'player',
      pos: { x: this.width * 0.2, y: this.height * 0.5 },
      radius: 20,
      hp: 100,
      maxHp: 100,
    };

    this.enemy = {
      id: 'enemy',
      pos: { x: this.width * 0.8, y: this.height * 0.5 },
      radius: 20,
      hp: 100,
      maxHp: 100,
    };
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
    // Keep entities somewhat in bounds on resize
    this.player.pos.x = Math.min(this.player.pos.x, this.width / 2 - 20);
    this.enemy.pos.x = Math.max(this.enemy.pos.x, this.width / 2 + 20);
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
  }

  loop = (time: number) => {
    if (!this.running) return;
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop);
  };

  update(dt: number) {
    // Player Movement
    const speed = 250;
    this.player.pos.x += this.playerInput.x * speed * dt;
    this.player.pos.y += this.playerInput.y * speed * dt;

    // Bounds player inside left half
    this.player.pos.x = Math.max(20, Math.min(this.player.pos.x, this.width / 2 - 20));
    this.player.pos.y = Math.max(20, Math.min(this.player.pos.y, this.height - 20));

    // Simple AI Enemy
    const enemySpeed = 150;
    const distToPlayerY = this.player.pos.y - this.enemy.pos.y;
    // Move towards player Y, slightly evade X
    this.enemy.pos.y += Math.sign(distToPlayerY) * enemySpeed * dt * 0.8;
    
    // Periodically Enemy Casts
    if (Math.random() < 0.01) {
      this.castEnemySpell();
    }

    // Bounds enemy inside right half
    this.enemy.pos.x = Math.max(this.width / 2 + 20, Math.min(this.enemy.pos.x, this.width - 20));
    this.enemy.pos.y = Math.max(20, Math.min(this.enemy.pos.y, this.height - 20));

    // Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.lifetime -= dt;
      if (p.lifetime <= 0) {
        this.projectiles.splice(i, 1);
        continue;
      }
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;

      // Add trail particles
      if (Math.random() < 0.3) {
        this.addParticle(p.pos.x, p.pos.y, p.color);
      }

      // Collisions
      const target = p.ownerId === 'player' ? this.enemy : this.player;
      const dx = p.pos.x - target.pos.x;
      const dy = p.pos.y - target.pos.y;
      if (Math.sqrt(dx*dx + dy*dy) < p.radius + target.radius) {
        // Hit
        target.hp -= p.damage;
        this.createExplosion(p.pos.x, p.pos.y, p.color);
        this.projectiles.splice(i, 1);
        
        if (target.hp <= 0 && this.running) {
          this.running = false;
          if (this.onGameOver) this.onGameOver(target.id === 'enemy');
        }
        continue;
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw Center Line
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.setLineDash([10, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Particles
    this.ctx.globalCompositeOperation = 'lighter';
    for (const p of this.particles) {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life / p.maxLife;
      this.ctx.beginPath();
      this.ctx.arc(p.pos.x, p.pos.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = 'source-over';

    // Projectiles
    for (const p of this.projectiles) {
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = p.color;
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // Entities (Wizards)
    this.drawWizard(this.player, '#4f46e5'); // Indigo
    this.drawWizard(this.enemy, '#e11d48'); // Rose
  }

  drawWizard(entity: Entity, color: string) {
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = color;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(entity.pos.x, entity.pos.y, entity.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
    
    // simple ring
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(entity.pos.x, entity.pos.y, entity.radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // HP Bar
    const hpPerc = Math.max(0, entity.hp / entity.maxHp);
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillRect(entity.pos.x - 20, entity.pos.y - 35, 40, 6);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(entity.pos.x - 20, entity.pos.y - 35, 40 * hpPerc, 6);
  }

  addParticle(x: number, y: number, color: string) {
    this.particles.push({
      pos: { x, y },
      vel: { x: (Math.random() - 0.5) * 50, y: (Math.random() - 0.5) * 50 },
      life: 0.5 + Math.random() * 0.5,
      maxLife: 1,
      color,
      size: 2 + Math.random() * 3
    });
  }

  createExplosion(x: number, y: number, color: string) {
    for(let i=0; i<20; i++) {
        this.particles.push({
          pos: { x, y },
          vel: { x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 300 },
          life: 0.3 + Math.random() * 0.4,
          maxLife: 0.7,
          color,
          size: 3 + Math.random() * 5
        });
    }
  }

  castSpell(ownerId: string, elements: ElementType[]) {
    if (elements.length === 0) return;
    
    const isPlayer = ownerId === 'player';
    const sourcePos = isPlayer ? this.player.pos : this.enemy.pos;
    
    // Determine combo effects
    let color = '#fff';
    let speed = 400;
    let duration = 3;
    let radius = 8;
    let damage = 5;

    // Simple combination logic
    if (elements.includes('FIRE')) { color = '#f97316'; damage += 5; radius += 2; }
    if (elements.includes('FROST')) { color = '#38bdf8'; speed -= 100; duration += 2; radius += 2; }
    if (elements.includes('ARCANE')) { color = '#a855f7'; speed += 200; damage += 2; }
    if (elements.includes('LIGHTNING')) { color = '#fef08a'; speed += 300; damage += 8; radius -= 2; }

    if (elements.includes('FIRE') && elements.includes('LIGHTNING')) {
      // Thunderstorm
      color = '#fb923c';
      radius = 15;
      damage = 25;
    }

    const dirX = isPlayer ? 1 : -1;

    this.projectiles.push({
      id: Math.random().toString(),
      pos: { x: sourcePos.x + (dirX * 30), y: sourcePos.y },
      vel: { x: dirX * speed, y: (Math.random() - 0.5) * 50 }, // slight vertical spread
      radius,
      elements,
      ownerId,
      lifetime: duration,
      damage,
      color,
      particles: []
    });
    
    // Recoil or cast flash
    this.createExplosion(sourcePos.x + (dirX * 20), sourcePos.y, color);
  }

  castEnemySpell() {
    const spellTypes: ElementType[][] = [
      ['FIRE'],
      ['ARCANE', 'LIGHTNING'],
      ['FROST'],
      ['FIRE', 'FROST']
    ];
    const picked = spellTypes[Math.floor(Math.random() * spellTypes.length)];
    this.castSpell('enemy', picked);
  }
}
