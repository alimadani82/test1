export const nowMs = () => Date.now();

export const msToSeconds = (ms: number) => Math.max(0, Math.ceil(ms / 1000));
