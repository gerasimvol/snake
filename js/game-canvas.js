import BaseCanvas from './base-canvas.js'

const colors = {
  border: '#749db3',
  bg: '#5587a2',
  snake: '#233c4a'
}

export default class GameCanvas extends BaseCanvas {
  constructor (container) {
    super(container)

    super.childRenderFunction = this.draw
    this.draw()
  }

  draw () {
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

    // board
    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        const square = {
          x: col * this.squareSizePx + (oddXSpace / 2),
          y: row * this.squareSizePx + statsSafeAreaPx + oddYSpace,
          width: this.squareSizePx,
          height: this.squareSizePx
        }
        this.ctx.strokeStyle = colors.border
        this.ctx.strokeRect(square.x, square.y, square.width, square.height)
      }
    }
  }
}
