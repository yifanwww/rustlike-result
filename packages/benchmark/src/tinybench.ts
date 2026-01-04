import type { Task } from 'tinybench';

const mToNs = (ms: number) => ms * 1e6;

export function formatTinybenchTask(task: Task) {
    const { name, result } = task;

    if (result.state !== 'completed') {
        return {
            task: name,
            'mean (ns)': 'N/A',
            'median (ns)': 'N/A',
            'mean (op/s)': 'N/A',
            'median (op/s)': 'N/A',
        };
    }

    return {
        task: name,
        'mean (ns)': `${mToNs(result.latency.mean).toFixed(2)} \xb1 ${result.latency.rme.toFixed(2)}%`,
        'median (ns)': `${mToNs(result.latency.p50).toFixed(2)}${Number.parseFloat(mToNs(result.latency.mad).toFixed(2)) > 0 ? ` \xb1 ${mToNs(result.latency.mad).toFixed(2)}` : ''}`,
        'mean (op/s)': `${result.throughput.mean.toFixed(0)} \xb1 ${result.throughput.rme.toFixed(2)}%`,
        'median (op/s)': `${result.throughput.p50.toFixed(0)}${Number.parseInt(result.throughput.mad.toFixed(0), 10) > 0 ? ` \xb1 ${result.throughput.mad.toFixed(0)}` : ''}`,
    };
}
