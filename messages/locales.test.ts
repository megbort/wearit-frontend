import { describe, expect, it } from 'vitest';
import en from './en.json';
import fr from './fr.json';

function keys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === 'object' && value !== null
      ? keys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );
}

describe('locale message parity', () => {
  it('fr.json has the same keys as en.json', () => {
    expect(keys(fr).sort()).toEqual(keys(en).sort());
  });
});
