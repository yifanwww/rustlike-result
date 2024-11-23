export function formatNum(num: number) {
    const formatter = Intl.NumberFormat('en', { notation: 'standard' });
    return formatter.format(num);
}

export function logTestCases(testCases: [string, unknown][]) {
    for (const [name, value] of testCases) {
        console.log(`> ${name}:`);
        console.log(value);
        console.log();
    }
}
