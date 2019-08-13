import BaseCanvas from './base-canvas.js'

const colors = {
  line: '#88abbe',
  bg: '#5587a2',
  snake: '#233c4a'
}

const speedSettings = {
  default: 500,
  fast: 100
}

export default class SnakeCanvas extends BaseCanvas {
  constructor (container) {
    super(container)

    this.board = []

    this.squareSize = 20
    this.snake = [
      { x: this.canvas.width / 2, y: this.canvas.height / 2 },
      { x: this.canvas.width / 2 + 22, y: this.canvas.height / 2 },
      { x: this.canvas.width / 2 + 44, y: this.canvas.height / 2 },
      { x: this.canvas.width / 2 + 66, y: this.canvas.height / 2 },
      { x: this.canvas.width / 2 + 88, y: this.canvas.height / 2 }
    ]

    this.speed = speedSettings.default
    this.direction = 'left'

    this.holdedKey = null
    this.interval = null

    super.childRenderFunction = this.draw
    this.draw()
    this.play()

    this.listenEvents()
  }

  listenEvents () {
    document.addEventListener('keyup', this.onKeyUp.bind(this))
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  onKeyUp (e) {
    if (!e.key.includes('Arrow')) return

    this.holdedKey = null

    this.speed = speedSettings.default
    this.play()
  }

  onKeyDown (e) {
    if (!e.key.includes('Arrow')) return

    const newDirection = e.key.replace('Arrow', '').toLowerCase()

    // no reverse
    if (
      (this.direction === 'left' && newDirection === 'right') ||
      (this.direction === 'right' && newDirection === 'left') ||
      (this.direction === 'up' && newDirection === 'down') ||
      (this.direction === 'down' && newDirection === 'up')
    ) return

    this.direction = newDirection

    if (this.holdedKey === e.key) return

    this.speed = speedSettings.fast
    this.play()

    this.holdedKey = e.key
  }

  play () {
    clearInterval(this.interval)

    this.interval = setInterval(() => {
      // set direction
        if (this.direction === 'left') {
          this.snake[0].x-=this.squareSize
        } else if (this.direction === 'right') {
          this.snake[0].x+=this.squareSize
        } else if (this.direction === 'up') {
          this.snake[0].y-=this.squareSize
        } else if (this.direction === 'down') {
          this.snake[0].y+=this.squareSize
        }

        // TODO: continue here
        for (let square = 1; square < this.snake.length - 1; square++) {
          this.snake[square].x = this.snake[square-1].x
          this.snake[square].y = this.snake[square-1].y
        }
    }, this.speed)
  }

  draw () {
    this.ctx.save()

    this.ctx.fillStyle = colors.bg
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.restore()

    this.ctx.strokeStyle = colors.line
    this.ctx.lineWidth = 3
    this.ctx.strokeRect(2, 2, this.canvas.width - 3, this.canvas.height - 3);
    this.ctx.beginPath()
    this.ctx.moveTo(0, this.canvas.height * 0.05)
    this.ctx.lineTo(this.canvas.width, this.canvas.height * 0.05)
    this.ctx.stroke()
    this.ctx.restore()

    this.ctx.fillStyle = colors.snake
    this.snake.forEach(square => {
      this.ctx.rect(square.x, square.y, this.squareSize, this.squareSize)
      this.ctx.fill()
    })

    requestAnimationFrame(this.draw.bind(this))
  }
}
