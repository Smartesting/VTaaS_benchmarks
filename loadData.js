export async function loadData() {
    const response = await fetch('./manifest.json');
    const manifest = await response.json();
    const files = manifest.files.map((f) => `./${f}`);
    const testData = {};
    const summary = {};
    for (const file of files) {
        const { build, tests } = await fetch(file).then(response => response.json());
        tests.forEach(test => {
            const name = test.name;
            const duration = test.start && test.end ? new Date(test.end).getTime() - new Date(test.start).getTime() : 0;
            const result = test.status;
            if (!testData[name])
                testData[name] = { builds: [], durations: [], statuses: [], steps: [] };
            testData[name].builds.push(build);
            testData[name].durations.push(duration);
            testData[name].statuses.push(test.status);
            testData[name].steps.push(test.stepStatuses.map(({ end, start, status }) => {
                return {
                    status: status,
                    duration: start && end ? new Date(end).getTime() - new Date(start).getTime() : 0
                };
            }));
            if (!summary[build])
                summary[build] = {
                    waiting: 0,
                    running: 0,
                    success: 0,
                    failed: 0,
                    error: 0,
                    stopped: 0,
                    not_run: 0,
                };
            summary[build][result]++;
        });
    }
    return { summary, testData };
}
