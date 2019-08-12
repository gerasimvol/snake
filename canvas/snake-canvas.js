import BaseCanvas from './base-canvas.js'

const colors = {
  line: '#88abbe',
  bg: '#5587a2'
}

export default class SnakeCanvas extends BaseCanvas {
  constructor (container) {
    super(container)

    this.board = []

    this.speed = 500
    this.direction = 'left'

    this.holdedKey = null
    this.interval = null

    super.childRenderFunction = this.draw
    this.draw()
    // this.play()

    this.listenEvents()
  }

  listenEvents () {
    document.addEventListener('keyup', this.onKeyUp.bind(this))
    document.addEventListener('keydown', this.onKeyDown.bind(this))
  }

  onKeyUp (e) {
    if (!e.key.includes('Arrow')) return

    this.holdedKey = null

    this.speed = 500
    this.play()
  }

  onKeyDown (e) {
    if (!e.key.includes('Arrow')) return

    this.direction = e.key.replace('Arrow', '').toLowerCase()

    if (this.holdedKey === e.key) return

    this.speed = 100
    this.play()

    this.holdedKey = e.key
  }

  play () {
    clearInterval(this.interval)

    this.interval = setInterval(() => {
      console.log(this.direction)
    }, this.speed)
  }

  draw () {
    this.ctx.fillStyle = colors.bg
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.strokeStyle = colors.line
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(1, 1, this.canvas.width - 2, this.canvas.height - 2);
    this.ctx.beginPath()
    this.ctx.moveTo(0, this.canvas.height * 0.05)
    this.ctx.lineTo(this.canvas.width, this.canvas.height * 0.05)
    this.ctx.stroke()

    // TODO: continue here
    this.ctx.fillStyle = '#000'
    this.ctx.font = "30px Arial"
    this.ctx.fillText(this.direction, 100, 100)

    requestAnimationFrame(this.draw.bind(this))
  }
}
