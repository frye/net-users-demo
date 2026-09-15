const decode = (value) => value.replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export function readResults(xml) {
  return [...xml.matchAll(/<UnitTestResult\b([^>]+)\/?>/g)].map((match) => {
    const attributes = Object.fromEntries(
      [...match[1].matchAll(/([\w:]+)="([^"]*)"/g)].map((attribute) => [attribute[1], decode(attribute[2])]),
    );
    if (!attributes.testName || !attributes.outcome) throw new Error('Incomplete TRX test result.');
    return { name: attributes.testName, outcome: attributes.outcome };
  });
}

export function verifyResults(results, requiredNames = []) {
  if (results.length === 0) throw new Error('No executed tests: this is not passing evidence.');
  const unsuccessful = results.filter((result) => result.outcome !== 'Passed');
  if (unsuccessful.length) {
    throw new Error(`Failed, skipped, or incomplete tests: ${unsuccessful.map((result) => `${result.name}: ${result.outcome}`).join(', ')}`);
  }
  const missing = requiredNames.filter((name) =>
    !results.some((result) => result.name === name || result.name.startsWith(`${name}(`)));
  if (missing.length) throw new Error(`Required exercise tests were not executed: ${missing.join(', ')}`);
  return results.length;
}
