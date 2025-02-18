class Enemy {
    constructor(x, y, speed, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = speed;
        this.dy = speed;
        this.type = type || 'basic'; // 'basic', 'fast', 'tough'
        this.health = type === 'tough' ? 3 : 1;
        this.dx = 0; // Movimiento lateral
        this.shootTimer = 0; // Para controlar la frecuencia de disparo
        this.shootInterval = getRandomInt(1000, 3000); // Intervalo de disparo aleatorio
    }

    // Movimiento básico
    update() {
        this.y += this.dy;
        
        // Movimiento lateral basado en el tipo de enemigo
        if (this.type === 'fast') {
            this.x += Math.sin(Date.now() / 200) * 2; // Movimiento en zigzag
        } else if (this.type === 'tough') {
            this.x += this.dx; // Movimiento recto
            if (this.x <= 0 || this.x >= 800 - this.width) this.dx = -this.dx; // Rebote
        } else {
            this.x += getRandomInt(-1, 1); // Movimiento aleatorio
        }

        // Reaparecer si sale de la pantalla
        if (this.y > 600) {
            this.y = -this.height;
            this.x = getRandomInt(0, 800 - this.width);
        }

        // Lógica de disparo para algunos enemigos
        if (this.type !== 'basic') {
            this.shootTimer += 16; // Aproximadamente el tiempo de un frame a 60fps
            if (this.shootTimer >= this.shootInterval) {
                this.shoot();
                this.shootTimer = 0;
            }
        }
    }

    draw(ctx, color) {
        // Dibujamos el enemigo según su tipo
        if (this.type === 'basic') {
            ctx.fillStyle = color || '#ff0000';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, this.height - 20);
        } else if (this.type === 'fast') {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        } else if (this.type === 'tough') {
            ctx.fillStyle = '#ff00ff';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            // Barra de salud
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x, this.y - 5, this.width * (this.health / 3), 3);
        }
    }

    takeDamage() {
        this.health--;
        if (this.health <= 0) {
            return true; // El enemigo debe ser eliminado
        }
        return false;
    }

    // Función para disparar
    shoot() {
        // Aquí deberíamos crear una nueva clase Bullet para los enemigos
        // Por ahora, solo logeamos que el enemigo dispara
        console.log('Enemigo disparando desde', this.x, this.y);
        // Implementación futura: bullets.push(new EnemyBullet(this.x + this.width / 2, this.y + this.height, 5, Math.PI / 2));
    }
}