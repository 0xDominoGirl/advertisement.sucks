/* Large packaging sheets share one working slot. Superseded requests never
   allocate a sheet, and the browser gets an input/paint turn between jobs. */
export const yieldToBrowser = () => globalThis.scheduler?.yield
  ? globalThis.scheduler.yield() : new Promise(resolve => setTimeout(resolve, 0));

export function requireCurrent(isCurrent) {
  if (isCurrent && !isCurrent()) throw new DOMException("Preview superseded", "AbortError");
}

export class RenderQueue {
  pending = [];
  running = false;

  run(task, { isCurrent, priority = () => 1 } = {}) {
    const result = new Promise((resolve, reject) => {
      this.pending.push({ task, isCurrent, priority, resolve, reject });
    });
    if (!this.running) {
      this.running = true;
      void this.drain();
    }
    return result;
  }

  async drain() {
    try {
      while (this.pending.length) {
        await yieldToBrowser();
        this.pending.sort((a, b) => a.priority() - b.priority());
        const job = this.pending.shift();
        try { requireCurrent(job.isCurrent); job.resolve(await job.task()); }
        catch (error) { job.reject(error); }
      }
    } finally { this.running = false; }
  }
}
