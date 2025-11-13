#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

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

async function main() {
  const resultsDir = path.resolve('test-results');
  let files = [];

  try {
    files = await fs.readdir(resultsDir);
  } catch (error) {
    console.log('Vitest: директория с результатами не найдена, пропускаем отчёт.');
    return;
  }

  const reportFiles = files.filter((file) => file.startsWith('vitest-report') && file.endsWith('.json'));

  if (reportFiles.length === 0) {
    console.log('Vitest: JSON-отчёты не найдены.');
    return;
  }

  const rows = [];

  for (const file of reportFiles) {
    try {
      const fullPath = path.join(resultsDir, file);
      const data = await readJson(fullPath);

      const total = Number(data.numTotalTests ?? data.numTotal ?? 0);
      const passed = Number(
        data.numPassedTests ?? data.numPassed ?? (data.success === true ? total - Number(data.numFailedTests ?? 0) - Number(data.numPendingTests ?? 0) : 0),
      );
      const failed = Number(data.numFailedTests ?? data.numFailed ?? 0);
      const pending = Number(data.numPendingTests ?? data.numPending ?? 0);
      const duration = Number(
        data.totalTime ??
          data.duration ??
          (Array.isArray(data.testResults)
            ? data.testResults.reduce((sum, suite) => sum + (suite?.perfStats?.runtime ?? suite?.duration ?? 0), 0)
            : 0),
      );

      const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '100.0';
      const label = file.replace('vitest-report', '').replace(/\.json$/, '') || '-overall';
      rows.push({ label: label.replace(/^-/, '') || 'overall', passed, failed, pending, total, passRate, duration });
    } catch (error) {
      console.warn(`Vitest: не удалось обработать ${file}:`, error);
    }
  }

  if (rows.length === 0) {
    console.log('Vitest: нет корректных отчётов для агрегации.');
    return;
  }

  const header = '| Набор | Успешно/Всего | Ошибок | Пропущено | Pass rate | Время |';
  const separator = '| --- | --- | --- | --- | --- | --- |';
  const table = rows
    .map((row) =>
      `| ${row.label} | ${row.passed}/${row.total} | ${row.failed} | ${row.pending} | ${row.passRate}% | ${formatDuration(row.duration)} |`,
    )
    .join('\n');

  const summary = ['### Vitest отчёт о тестах', header, separator, table].join('\n');

  if (process.env.GITHUB_STEP_SUMMARY) {
    await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
  }

  console.log(summary);
}

main().catch((error) => {
  console.error('Vitest: не удалось собрать метрики:', error);
  process.exitCode = 1;
});
