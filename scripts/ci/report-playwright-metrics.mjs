#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return '—';
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const rest = seconds - minutes * 60;
  return `${minutes}m ${rest.toFixed(0)}s`;
}

function aggregateSuites(suites = []) {
  return suites.reduce(
    (acc, suite) => {
      if (Array.isArray(suite.tests)) {
        for (const test of suite.tests) {
          const results = Array.isArray(test.results) ? test.results : [];
          const duration = results.reduce((sum, result) => sum + (result.duration ?? 0), 0);
          acc.duration += duration;

          const status = results[results.length - 1]?.status ?? test.status;
          if (status === 'skipped') {
            acc.skipped += 1;
          } else if (status === 'passed') {
            acc.expected += 1;
          } else if (status === 'flaky') {
            acc.flaky += 1;
            acc.expected += 1;
          } else {
            acc.unexpected += 1;
          }
          acc.total += 1;
        }
      }

      if (Array.isArray(suite.suites)) {
        const nested = aggregateSuites(suite.suites);
        acc.duration += nested.duration;
        acc.expected += nested.expected;
        acc.unexpected += nested.unexpected;
        acc.skipped += nested.skipped;
        acc.flaky += nested.flaky;
        acc.total += nested.total;
      }

      return acc;
    },
    { duration: 0, expected: 0, unexpected: 0, skipped: 0, flaky: 0, total: 0 },
  );
}

async function main() {
  const reportPath = path.resolve('test-results', 'results.json');

  try {
    const content = await fs.readFile(reportPath, 'utf8');
    const data = JSON.parse(content);

    const stats = data.stats ?? aggregateSuites(data.suites ?? []);
    const total = stats.total ?? stats.expected + stats.unexpected + stats.skipped + stats.flaky;
    const expected = stats.expected ?? 0;
    const unexpected = stats.unexpected ?? 0;
    const skipped = stats.skipped ?? 0;
    const flaky = stats.flaky ?? 0;
    const duration = stats.duration ?? data.duration ?? 0;
    const passRate = total > 0 ? ((expected / total) * 100).toFixed(1) : '100.0';

    const summary = [
      '### Playwright отчёт о тестах',
      '| Статус | Количество |',
      '| --- | --- |',
      `| Успешно | ${expected} |`,
      `| Сбоев | ${unexpected} |`,
      `| Пропущено | ${skipped} |`,
      `| Flaky | ${flaky} |`,
      '',
      `**Всего:** ${total} • **Pass rate:** ${passRate}% • **Время:** ${formatDuration(duration)}`,
    ].join('\n');

    if (process.env.GITHUB_STEP_SUMMARY) {
      await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
    }

    console.log(summary);
  } catch (error) {
    console.log('Playwright: отчёт не найден или повреждён, пропускаем метрики.');
  }
}

main();
