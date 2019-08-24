import BaseCanvas from './base-canvas.js'

const copy = obj => JSON.parse(JSON.stringify(obj))

const colors = {
  square: {
    fill: '#5286a3',
    stroke: '#749db3'
  },
  bg: '#507f99',
  snake: '#233c4a'
}

export default class GameCanvas extends BaseCanvas {
  constructor (container) {
    super(container)

    this.snake = {
      direction: 'right',
      speedMs: 500,
      path: [
        { row: 10, col: 5 },
        { row: 10, col: 4 },
        { row: 10, col: 3 }
      ]
    }

    super.childRenderFunction = this.draw
    this.draw()
    this.play()
  }

  draw () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // score and volume on top
    const statsSafeAreaPx = 30

    this.squareSizePx = 20

    // number of squares on X and Y axis
    this.board = {
      cols: Math.floor(this.canvas.width / this.squareSizePx),
      rows: Math.floor((this.canvas.height - statsSafeAreaPx) / this.squareSizePx)
    }

    // to center board
    const oddXSpace = this.canvas.width % this.squareSizePx
    const oddYSpace = (this.canvas.height - statsSafeAreaPx) % this.squareSizePx

    // bg
    this.ctx.fillStyle = colors.bg
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    
    // draw board grid
    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        const square = {
          x: col * this.squareSizePx + (oddXSpace / 2),
          y: row * this.squareSizePx + statsSafeAreaPx + oddYSpace,
          width: this.squareSizePx,
          height: this.squareSizePx
        }

        // square border
        this.ctx.strokeStyle = colors.square.stroke
        this.ctx.strokeRect(square.x, square.y, square.width, square.height)

        // square bg
        this.ctx.fillStyle = colors.square.fill
        this.ctx.fillRect(
          col * this.squareSizePx + (oddXSpace / 2) + 1,
          row * this.squareSizePx + statsSafeAreaPx + oddYSpace + 1,
          this.squareSizePx - 2,
          this.squareSizePx - 2
        )
      }
    }

    // draw snake
    this.ctx.fillStyle = colors.snake
    this.snake.path.forEach(rect => {
      this.ctx.fillRect(
        rect.col * this.squareSizePx + (oddXSpace / 2) + 1,
        rect.row * this.squareSizePx + statsSafeAreaPx + oddYSpace + 1,
        this.squareSizePx - 2,
        this.squareSizePx - 2
      )
    })

    requestAnimationFrame(this.draw.bind(this))
  }

  play () {
    setInterval(() => {
      let prevSquare
      this.snake.path.forEach((square, index) => {
        if (index === 0) {
          prevSquare = copy(square)

          switch (this.snake.direction) {
            case 'up': square.row--; break
            case 'right': square.col++; break
            case 'down': square.row++; break
            case 'left': square.col--; break
          }
        } else {
          const squareBeforeUpdate = copy(this.snake.path[index])
          this.snake.path[index] = copy(prevSquare)
          prevSquare = copy(squareBeforeUpdate)
        }
      })

      // TODO: add arrow keys controls
    }, this.snake.speedMs)
  }
}
