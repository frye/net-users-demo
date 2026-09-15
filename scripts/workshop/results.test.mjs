import assert from 'node:assert/strict';
import test from 'node:test';
import { readResults, verifyResults } from './results.mjs';

test('reads actual TRX outcomes, including quoted theory parameters', () => {
  const results = readResults('<UnitTestResult testName="Tests.Delete(id: &quot;1&quot;)" outcome="Passed" />');
  assert.deepEqual(results, [{ name: 'Tests.Delete(id: "1")', outcome: 'Passed' }]);
  assert.equal(verifyResults(results, ['Tests.Delete']), 1);
});

test('no test results cannot pass', () => {
  assert.throws(() => verifyResults(readResults('<TestRun/>')), /No executed tests/);
});

test('baseline-only results cannot stand in for feature checks', () => {
  assert.throws(() => verifyResults([{ name: 'Tests.Get', outcome: 'Passed' }], ['Tests.Delete']), /not executed/);
});

test('failed and skipped required tests cannot pass', () => {
  for (const outcome of ['Failed', 'NotExecuted', 'Inconclusive']) {
    assert.throws(() => verifyResults([{ name: 'Tests.Delete', outcome }], ['Tests.Delete']), /incomplete tests/);
  }
});

test('malformed test results fail explicitly', () => {
  assert.throws(() => readResults('<UnitTestResult testName="Tests.Delete"/>'), /Incomplete TRX/);
});

test('similar names cannot impersonate required tests', () => {
  assert.throws(() => verifyResults([{ name: 'Tests.DeleteIgnored', outcome: 'Passed' }], ['Tests.Delete']), /not executed/);
});
