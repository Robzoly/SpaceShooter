class Player {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
        this.angle = 0;
        this.multiShot = false;
        this.charging = false;
        this.chargeTime = 0;
        this.maxChargeTime = 1000; // Tiempo máximo para cargar el disparo en milisegundos
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0) this.x = 0;
        if (this.x > 800 - this.width) this.x = 800 - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > 600 - this.height) this.y = 600 - this.height;

        if (this.dx !== 0 || this.dy !== 0) {
            this.angle = Math.atan2(-this.dy, this.dx);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, this.height / 2);
        ctx.lineTo(this.width / 2, this.height / 2);
        ctx.lineTo(0, -this.height / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    shoot() {
        if (this.multiShot) {
            // Disparo múltiple: 3 balas en diferentes direcciones
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 10, this.angle));
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 10, this.angle + Math.PI / 6));
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 10, this.angle - Math.PI / 6));
        } else if (this.charging) {
            // Disparo cargado
            let chargeLevel = Math.min(this.chargeTime / this.maxChargeTime, 1);
            let bulletSize = 5 + (chargeLevel * 10); // Aumenta el tamaño de la bala según el nivel de carga
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 10 * (1 + chargeLevel), this.angle, bulletSize));
            this.charging = false;
            this.chargeTime = 0;
        } else {
            bullets.push(new Bullet(this.x + this.width / 2, this.y + this.height / 2, 10, this.angle));
        }
    }

    startCharge() {
        this.charging = true;
    }

    stopCharge() {
        this.charging = false;
        this.shoot();
    }

    updateCharge(deltaTime) {
        if (this.charging) {
            this.chargeTime += deltaTime;
            if (this.chargeTime >= this.maxChargeTime) {
                this.stopCharge();
            }
        }
    }
}