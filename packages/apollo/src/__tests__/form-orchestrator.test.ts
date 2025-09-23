import { describe, expect, it } from 'bun:test';

import { FormOrchestrator } from '../organisms/form-orchestrator';

describe('FormOrchestrator', () => {
  it('tracks field lifecycle and validation', async () => {
    const form = new FormOrchestrator<{ email: string }>();
    form.registerField('email', {
      initialValue: '',
      describedBy: ['email-hint'],
      validate: (value: string) => (value ? null : 'Required'),
      validateAsync: async (value: string) => {
        await Promise.resolve();
        return value.includes('@') ? null : 'Must include @ symbol';
      },
    });

    let field = form.getFieldSnapshot('email');
    expect(field?.ariaDescribedBy).toBe('email-hint');

    form.touchField('email');
    form.setFieldValue('email', 'user');
    await form.validateField('email');
    field = form.getFieldSnapshot('email');
    expect(field?.errors).toContain('Must include @ symbol');
    expect(field?.ariaInvalid).toBe(true);
    expect(field?.ariaDescribedBy?.includes(field?.errorId ?? '')).toBe(true);

    form.setFieldValue('email', 'user@example.com');
    await form.validateField('email');
    field = form.getFieldSnapshot('email');
    expect(field?.errors.length).toBe(0);
    expect(field?.dirty).toBe(true);

    const binding = form.bindInput('email');
    binding?.onChange({ target: { value: 'second@example.com' } });
    binding?.onBlur();
    const snapshot = form.getSnapshot();
    expect(snapshot.dirty.has('email')).toBe(true);
    expect(snapshot.touched.has('email')).toBe(true);

    const result = await form.submit();
    expect(result.valid).toBe(true);
  });
});
