import BaseCanvas from './base-canvas.js'

export default class SnakeCanvas extends BaseCanvas {
  constructor (container) {
    super(container)

    this.direction = 'left'

    super.childRenderFunction = this.draw
    this.draw()

    this.listenEvents()
  }

  listenEvents () {
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyUp (e) {
    if (!e.key.includes('Arrow')) return

    this.direction = e.key.replace('Arrow', '').toLowerCase()
  }

  draw () {
    // CONTINUE HERE
    console.log('direction', this.direction)
    requestAnimationFrame(this.draw.bind(this))
  }
}
