export default class MemoryHistory {
  history = [] as string[]
  stack = [] as string[]

  fire<T>(type: string, state?: T) {
    const event = new CustomEvent<T>(type, { detail: state })
    window.dispatchEvent(event)
  }

  get length() {
    return this.history.length
  }

  get state(): string | null {
    return this.history[this.history.length - 1] ?? null
  }

  go(step: number) {
    if (!step) {
      return
    }

    const oldURL = this.state
    if (step < 0) {
      this.stack.push(...this.history.splice(step))
    } else if (step > 0) {
      this.history.push(...this.stack.splice(0, step))
    }
    const newURL = this.state
    this.fire('pushState', { oldURL, newURL })
    this.fire('stateChange', { oldURL, newURL })
  }

  back() {
    this.go(-1)
  }

  forward() {
    this.go(1)
  }

  pushState(state: string) {
    if (state !== this.state) {
      const oldURL = this.state
      this.history.push(state)
      this.stack = []
      this.fire('pushState', { oldURL, newURL: state })
      this.fire('stateChange', { oldURL, newURL: state })
    }
    return this
  }

  replaceState(state: string) {
    const oldURL = this.state
    this.history.splice(this.length - 1, 1, state)
    this.fire('replaceState', { oldURL, newURL: state })
    this.fire('stateChange', { oldURL, newURL: state })
    return this
  }
}
