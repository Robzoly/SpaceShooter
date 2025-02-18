```markdown
# Space Shooters

Space Shooter es un juego retro futurista de disparos espaciales, inspirado en clásicos arcade como Space Invaders y Galaga. Desarrollado con HTML5, CSS3, JavaScript y Bootstrap, este juego combina una estética de pixel art con gráficos modernos para ofrecer una experiencia desafiante y visualmente atractiva.

## Características

- **Estilo Retro Futurista**
  - Paleta de colores oscuros con acentos de neón (verde, azul, morado).
  - Uso de fuentes tipo arcade (*Orbitron*, *Press Start 2P*).
  - Sprites pixelados y animaciones sutiles para naves y enemigos.
  - Fondos dinámicos con estrellas en movimiento para simular el espacio.

- **Mecánicas del Juego**
  - Movimiento del jugador controlado con las teclas de flecha y WASD.
  - Sistema de disparo sencillo mediante la barra espaciadora; posibilidad de power-ups que habilitan disparos múltiples o especiales.
  - Diferentes tipos de enemigos (básico, rápido, resistente) con patrones de movimiento variados.
  - Detección de colisiones entre disparos y enemigos, y entre el jugador y power-ups.
  - Escalado de dificultad: aumento progresivo en el número y velocidad de enemigos por ronda.
  - Jefes finales con patrones de ataque únicos y múltiples fases.

- **Interfaz y Sonido**
  - Menú de inicio y menú de pausa diseñados con Bootstrap para una experiencia responsiva.
  - Interfaz de usuario que muestra puntaje, vidas y nivel en tiempo real.
  - Música de fondo estilo *chiptune* y efectos de sonido para disparos, explosiones y colisiones.

## Estructura del Proyecto

```
/game-project
│── index.html
│── css/
│   └── styles.css
│── js/
│   ├── utils.js
│   ├── player.js
│   ├── bullet.js
│   ├── enemy.js
│   ├── powerup.js
│   └── game.js
```

- **index.html:**  
  Contiene la estructura base de la aplicación, incluyendo el canvas principal para el juego, menús de inicio y pausa, y la interfaz de usuario.

- **css/styles.css:**  
  Define los estilos visuales y la estética retro futurista del juego.

- **js/utils.js:**  
  Funciones auxiliares (por ejemplo, generación de números aleatorios) utilizadas en varias partes del juego.

- **js/player.js:**  
  Lógica y métodos de la clase `Player`, encargada del movimiento, disparo y manejo de colisiones del jugador.

- **js/bullet.js:**  
  Definición de la clase `Bullet` para el manejo y renderizado de los disparos.

- **js/enemy.js:**  
  Implementación de la clase `Enemy` que gestiona el comportamiento y la animación de los enemigos.

- **js/powerup.js:**  
  Lógica para los power-ups, incluyendo su aparición, movimiento y efectos sobre el jugador.

- **js/game.js:**  
  Núcleo del juego: inicialización, bucle principal usando `requestAnimationFrame`, manejo de eventos (teclado y menús) y actualización de la interfaz de usuario.

## Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/robzoly/space-shooter.git
   ```

2. **Navegar al directorio del proyecto:**
   ```bash
   cd space-shooters
   ```

3. **Abrir el archivo `index.html` en tu navegador favorito:**
   - Puedes abrirlo directamente haciendo doble clic en el archivo o utilizando un servidor local para mayor compatibilidad.

## Uso y Controles

- **Movimiento del Jugador:**  
  Usa las teclas de **flechas** o **WASD** para mover la nave.

- **Disparo:**  
  Presiona la **barra espaciadora** para disparar.

- **Menú de Pausa:**  
  Haz clic en el botón de pausa para detener el juego y acceder a opciones adicionales (como la configuración de audio y controles).

## Contribuciones

¡Las contribuciones son bienvenidas!  
Si deseas mejorar el juego o agregar nuevas funcionalidades, por favor abre un *issue* o envía un *pull request* con tus sugerencias.

## Licencia

Este proyecto se distribuye bajo la [Licencia MIT](LICENSE).

---

¡Disfruta de Space Shooter y que la fuerza te acompañe!
```