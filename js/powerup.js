class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.type = type; // 'life', 'multiShot', 'speed', 'shield'
        this.speed = 2;
        this.duration = 0; // Duración para power-ups temporales
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        switch(this.type) {
            case 'life':
                ctx.fillStyle = '#00ff00'; // Verde para vida
                break;
            case 'multiShot':
                ctx.fillStyle = '#0000ff'; // Azul para disparo múltiple
                break;
            case 'speed':
                ctx.fillStyle = '#ff00ff'; // Morado para velocidad extra
                break;
            case 'shield':
                ctx.fillStyle = '#ffff00'; // Amarillo para campo de fuerza
                break;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // Aplicar el power-up al jugador
    apply(player) {
        switch(this.type) {
            case 'life':
                if (player.lives < 3) {
                    player.lives++;
                }
                break;
            case 'multiShot':
                player.multiShot = true;
                this.duration = 10000; // Duración del poder de disparo múltiple en milisegundos
                break;
            case 'speed':
                player.speed *= 1.5; // Aumentamos la velocidad del jugador
                this.duration = 5000; // Duración de la velocidad extra
                break;
            case 'shield':
                player.shield = true;
                this.duration = 5000; // Duración del campo de fuerza
                break;
        }
    }

    // Método para decrementar la duración del power-up
    decreaseDuration(deltaTime) {
        if (this.duration > 0) {
            this.duration -= deltaTime;
            if (this.duration <= 0) {
                this.duration = 0;
                return true; // Indica que el efecto del power-up ha terminado
            }
        }
        return false;
    }
}