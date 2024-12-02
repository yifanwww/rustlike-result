import type { Task } from 'tinybench';

const mToNs = (ms: number) => ms * 1e6;

export function formatTinybenchTask(task: Task) {
    return {
        task: task.name,
        'mean (ns)': `${mToNs(task.result!.latency.mean).toFixed(2)} \xb1 ${task.result!.latency.rme.toFixed(2)}%`,
        'median (ns)': `${mToNs(task.result!.latency.p50!).toFixed(2)}${Number.parseFloat(mToNs(task.result!.latency.mad!).toFixed(2)) > 0 ? ` \xb1 ${mToNs(task.result!.latency.mad!).toFixed(2)}` : ''}`,
        'mean (op/s)': `${task.result!.throughput.mean.toFixed(0)} \xb1 ${task.result!.throughput.rme.toFixed(2)}%`,
        'median (op/s)': `${task.result!.throughput.p50!.toFixed(0)}${Number.parseInt(task.result!.throughput.mad!.toFixed(0), 10) > 0 ? ` \xb1 ${task.result!.throughput.mad!.toFixed(0)}` : ''}`,
        samples: task.result!.latency.samples.length,
    };
}
