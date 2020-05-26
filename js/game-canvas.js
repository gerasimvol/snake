import BaseCanvas from './base-canvas.js'
import { copy, random } from './helpers.js'

// TODO: add speed up if key is holded

const MAX_SPEED = 40
const BONUS_SPEED_PER_LEVEL = 4

const colors = {
  square: {
    fill: '#5286a3',
    stroke: '#749db3'
  },
  bg: '#507f99',
  snake: '#233c4a',
  apple: '#c31808',
}

export default class GameCanvas extends BaseCanvas {
  constructor (container) {
    super(container)

    this.score = { record: 0, current: 0}
    this.score = new Proxy(this.score, {
      set (obj, prop, value) {
        obj[prop] = value
        document.querySelector(`.${prop}-score`).innerHTML = value
        return true
      }
    })
    this.score.record = localStorage.getItem('snake-record-score') || 0

    this.apple = { row: 0, col: 0 }

    this.snake = {
      direction: 'right',
      speedMs: 150,
      path: [
        { row: 1, col: 2 },
        { row: 1, col: 1 },
        { row: 1, col: 0 }
      ]
    }

    document.addEventListener('keydown', e => {
      const allowedKeys = [
        'ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'
      ]

      if (!allowedKeys.includes(e.key)) return

      const opositeDirections = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      }

      const newDirection = e.key.replace('Arrow', '').toLowerCase().trim()

      this.snake.direction = opositeDirections[newDirection] === this.snake.direction
        ? this.snake.direction
        : newDirection
    })

    super.childRenderFunction = this._draw
    this._draw()
    this._play()
  }

  _getRandomSquare() {
    return {
      row: random(0, this.board.rows),
      col: random(0, this.board.cols)
    }
  }
  
  _drawSquare(x, y) {
    this.ctx.fillRect(
      x * this.squareSizePx + (this.oddXSpace / 2) + 1,
      y * this.squareSizePx + this.statsSafeAreaPx + this.oddYSpace + 1,
      this.squareSizePx - 2,
      this.squareSizePx - 2
    )
  }

  _draw () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // score and volume on top
    this.statsSafeAreaPx = 30

    this.squareSizePx = 20

    // number of squares on X and Y axis
    this.board = {
      cols: Math.floor(this.canvas.width / this.squareSizePx),
      rows: Math.floor((this.canvas.height - this.statsSafeAreaPx) / this.squareSizePx)
    }

    // to center board
    this.oddXSpace = this.canvas.width % this.squareSizePx
    this.oddYSpace = (this.canvas.height - this.statsSafeAreaPx) % this.squareSizePx

    // bg
    this.ctx.fillStyle = colors.bg
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    
    // draw board grid
    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        const square = {
          x: col * this.squareSizePx + (this.oddXSpace / 2),
          y: row * this.squareSizePx + this.statsSafeAreaPx + this.oddYSpace,
          width: this.squareSizePx,
          height: this.squareSizePx
        }

        // square border
        this.ctx.strokeStyle = colors.square.stroke
        this.ctx.strokeRect(square.x, square.y, square.width, square.height)

        // square bg
        this.ctx.fillStyle = colors.square.fill
        this._drawSquare(col, row)
      }
    }

    // draw apple
    this.ctx.fillStyle = colors.apple
    this._drawSquare(this.apple.col, this.apple.row)

    // draw snake
    this.ctx.fillStyle = colors.snake
    this.snake.path.forEach(rect => {
      this._drawSquare(rect.col, rect.row)
    })

    requestAnimationFrame(this._draw.bind(this))
  }

  _play () {
    this.apple = this._getRandomSquare()

    const engine = () => {
      let prevSquare
      this.snake.path.forEach((square, index) => {
        const isHead = index === 0

        if (isHead) {
          prevSquare = copy(square)

          switch (this.snake.direction) {
            case 'up': square.row--; break
            case 'right': square.col++; break
            case 'down': square.row++; break
            case 'left': square.col--; break
          }
          
          // change board side
          if (square.col === this.board.cols) {
            square.col = 0
          } else if (square.col === -1) {
            square.col = this.board.cols - 1
          } else if (square.row === this.board.rows) {
            square.row = 0
          } else if (square.row === -1) {
            square.row = this.board.rows - 1
          }

          // game over
          if (this.snake.path.slice(1).some(bodyPart => bodyPart.row === square.row && bodyPart.col === square.col)) {
            clearTimeout(this.timeout)
            alert(`GAME OVER with ${this.score.current} score!`)
            localStorage.setItem('snake-record-score', this.score.record)
            window.location.reload()
          } else if (square.row === this.apple.row && square.col === this.apple.col) {
            // eat at apple
            this.score.current++
            if (this.score.current > this.score.record) {
              this.score.record = this.score.current
            }

            const tail = this.snake.path[this.snake.path.length - 1]
            this.snake.path.push(tail)
            // create new apple
            this.apple = this._getRandomSquare()
            // speed up game
            this.snake.speedMs = this.snake.speedMs < MAX_SPEED
              ? MAX_SPEED
              : this.snake.speedMs - BONUS_SPEED_PER_LEVEL
          }
        } else {
          const squareBeforeUpdate = copy(this.snake.path[index])
          this.snake.path[index] = copy(prevSquare)
          prevSquare = copy(squareBeforeUpdate)
        }
      })
      this.timeout = setTimeout(engine, this.snake.speedMs)
    }
    setTimeout(engine, this.snake.speedMs)
  }
}
