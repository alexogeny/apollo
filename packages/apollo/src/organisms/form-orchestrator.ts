export type Validator<Value, Values> = (
  value: Value,
  context: FormContext<Values>,
) => string | null | undefined;

export type AsyncValidator<Value, Values> = (
  value: Value,
  context: FormContext<Values>,
) => Promise<string | null | undefined>;

export interface FieldRegistration<Value, Values> {
  initialValue: Value;
  validate?: Validator<Value, Values> | Array<Validator<Value, Values>>;
  validateAsync?: AsyncValidator<Value, Values> | Array<AsyncValidator<Value, Values>>;
  describedBy?: string[];
}

export interface FieldSnapshot<Value> {
  name: string;
  id: string;
  value: Value;
  initialValue: Value;
  touched: boolean;
  dirty: boolean;
  errors: string[];
  validating: boolean;
  describedBy: string[];
  ariaDescribedBy: string | undefined;
  ariaInvalid: boolean;
  errorId: string;
}

export interface FormSnapshot<Values extends Record<string, unknown>> {
  values: Values;
  errors: Record<string, string[]>;
  touched: Set<string>;
  dirty: Set<string>;
  submitting: boolean;
  validating: boolean;
  submitCount: number;
  valid: boolean;
}

export interface SubmitResult<Values extends Record<string, unknown>> {
  values: Values;
  errors: Record<string, string[]>;
  valid: boolean;
  submitCount: number;
}

export interface FormContext<Values> {
  values: Values;
  name: string;
  touched: boolean;
  dirty: boolean;
}

interface FieldState<Value, Values> {
  name: string;
  id: string;
  errorId: string;
  value: Value;
  initialValue: Value;
  touched: boolean;
  dirty: boolean;
  errors: string[];
  validating: boolean;
  validators: Array<Validator<Value, Values>>;
  asyncValidators: Array<AsyncValidator<Value, Values>>;
  describedBy: Set<string>;
}

type FieldListener<Value> = (snapshot: FieldSnapshot<Value>) => void;

let fieldIdSeed = 0;

const toArray = <T>(value?: T | T[]): T[] => {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const isEventLike = <T>(value: unknown): value is { target: { value: T } } =>
  typeof value === 'object' && value !== null && 'target' in value;

export class FormOrchestrator<
  Values extends Record<string, unknown> = Record<string, unknown>,
> {
  private readonly fields = new Map<string, FieldState<unknown, Values>>();

  private readonly formListeners = new Set<(snapshot: FormSnapshot<Values>) => void>();

  private readonly fieldListeners = new Map<string, Set<FieldListener<unknown>>>();

  private submitting = false;

  private submitCount = 0;

  registerField<Name extends keyof Values & string>(
    name: Name,
    config: FieldRegistration<Values[Name], Values>,
  ): () => void {
    const validators = toArray(config.validate);
    const asyncValidators = toArray(config.validateAsync);
    const id = `apollo-field-${++fieldIdSeed}`;
    const state: FieldState<Values[Name], Values> = {
      name,
      id,
      errorId: `${id}-error`,
      value: config.initialValue,
      initialValue: config.initialValue,
      touched: false,
      dirty: false,
      errors: [],
      validating: false,
      validators,
      asyncValidators,
      describedBy: new Set(config.describedBy ?? []),
    };
    this.fields.set(name, state as FieldState<unknown, Values>);
    this.notifyForm();
    this.notifyField(name);
    return () => {
      this.fields.delete(name);
      this.fieldListeners.delete(name);
      this.notifyForm();
    };
  }

  unregisterField(name: keyof Values & string): void {
    this.fields.delete(name);
    this.fieldListeners.delete(name);
    this.notifyForm();
  }

  subscribe(listener: (snapshot: FormSnapshot<Values>) => void): () => void {
    this.formListeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.formListeners.delete(listener);
    };
  }

  subscribeField<Name extends keyof Values & string>(
    name: Name,
    listener: (snapshot: FieldSnapshot<Values[Name]>) => void,
  ): () => void {
    const set = this.ensureListenerSet(name);
    set.add(listener);
    const snapshot = this.getFieldSnapshot(name);
    if (snapshot) {
      listener(snapshot);
    }
    return () => {
      const listeners = this.fieldListeners.get(name) as
        | Set<FieldListener<Values[Name]>>
        | undefined;
      listeners?.delete(listener);
    };
  }

  getSnapshot(): FormSnapshot<Values> {
    const values = this.getValues();
    const errors = this.getErrors();
    const touched = new Set<string>();
    const dirty = new Set<string>();
    for (const field of this.fields.values()) {
      if (field.touched) touched.add(field.name);
      if (field.dirty) dirty.add(field.name);
    }
    const validating = Array.from(this.fields.values()).some((field) => field.validating);
    const valid = Object.values(errors).every((fieldErrors) => fieldErrors.length === 0);
    return {
      values,
      errors,
      touched,
      dirty,
      submitting: this.submitting,
      validating,
      submitCount: this.submitCount,
      valid,
    };
  }

  getFieldSnapshot<Name extends keyof Values & string>(
    name: Name,
  ): FieldSnapshot<Values[Name]> | null {
    const field = this.getField(name);
    if (!field) return null;
    const describedBy = Array.from(field.describedBy);
    const ariaIds = [...describedBy];
    if (field.errors.length > 0) {
      ariaIds.push(field.errorId);
    }
    return {
      name,
      id: field.id,
      value: field.value,
      initialValue: field.initialValue,
      touched: field.touched,
      dirty: field.dirty,
      errors: [...field.errors],
      validating: field.validating,
      describedBy,
      ariaDescribedBy: ariaIds.length ? ariaIds.join(' ') : undefined,
      ariaInvalid: field.errors.length > 0,
      errorId: field.errorId,
    };
  }

  setFieldValue<Name extends keyof Values & string>(
    name: Name,
    valueOrEvent: Values[Name] | { target: { value: Values[Name] } },
    options: { validate?: boolean } = {},
  ): void {
    const field = this.getField(name);
    if (!field) return;
    const value = isEventLike<Values[Name]>(valueOrEvent)
      ? valueOrEvent.target.value
      : valueOrEvent;
    field.value = value;
    field.dirty = !Object.is(field.initialValue, value);
    this.notifyField(name);
    this.notifyForm();
    if (options.validate !== false) {
      void this.validateField(name);
    }
  }

  touchField<Name extends keyof Values & string>(
    name: Name,
    touched = true,
    options: { validate?: boolean } = {},
  ): void {
    const field = this.getField(name);
    if (!field) return;
    field.touched = touched;
    this.notifyField(name);
    this.notifyForm();
    if (options.validate !== false) {
      void this.validateField(name);
    }
  }

  resetField<Name extends keyof Values & string>(name: Name): void {
    const field = this.getField(name);
    if (!field) return;
    field.value = field.initialValue;
    field.touched = false;
    field.dirty = false;
    field.errors = [];
    field.validating = false;
    this.notifyField(name);
    this.notifyForm();
  }

  reset(): void {
    for (const [name] of this.fields) {
      this.resetField(name as keyof Values & string);
    }
    this.submitting = false;
    this.submitCount = 0;
    this.notifyForm();
  }

  async validateField<Name extends keyof Values & string>(
    name: Name,
  ): Promise<FieldSnapshot<Values[Name]> | null> {
    const field = this.getField(name);
    if (!field) return null;
    const context = this.getContext(name);
    const errors: string[] = [];
    for (const validator of field.validators) {
      const result = validator(field.value, context);
      if (typeof result === 'string' && result) {
        errors.push(result);
      }
    }
    field.errors = errors;
    if (errors.length === 0 && field.asyncValidators.length > 0) {
      field.validating = true;
      this.notifyField(name);
      this.notifyForm();
      try {
        const asyncResults = await Promise.all(
          field.asyncValidators.map((validator) => validator(field.value, context)),
        );
        for (const result of asyncResults) {
          if (typeof result === 'string' && result) {
            errors.push(result);
          }
        }
      } finally {
        field.validating = false;
      }
    }
    field.errors = errors;
    this.notifyField(name);
    this.notifyForm();
    return this.getFieldSnapshot(name);
  }

  async validateAll(): Promise<FormSnapshot<Values>> {
    await Promise.all(Array.from(this.fields.keys()).map((name) => this.validateField(name)));
    return this.getSnapshot();
  }

  async submit(onValid?: (values: Values) => void | Promise<void>): Promise<SubmitResult<Values>> {
    this.submitCount += 1;
    this.submitting = true;
    this.notifyForm();
    const snapshot = await this.validateAll();
    if (snapshot.valid && onValid) {
      await onValid(snapshot.values);
    }
    this.submitting = false;
    this.notifyForm();
    return {
      values: snapshot.values,
      errors: snapshot.errors,
      valid: snapshot.valid,
      submitCount: this.submitCount,
    };
  }

  linkDescribedBy<Name extends keyof Values & string>(name: Name, id: string): void {
    const field = this.getField(name);
    if (!field) return;
    field.describedBy.add(id);
    this.notifyField(name);
  }

  unlinkDescribedBy<Name extends keyof Values & string>(name: Name, id: string): void {
    const field = this.getField(name);
    if (!field) return;
    field.describedBy.delete(id);
    this.notifyField(name);
  }

  getAriaDescribedBy<Name extends keyof Values & string>(name: Name): string | undefined {
    return this.getFieldSnapshot(name)?.ariaDescribedBy;
  }

  getFieldErrorId<Name extends keyof Values & string>(name: Name): string | undefined {
    const field = this.getField(name);
    return field?.errorId;
  }

  bindInput<Name extends keyof Values & string>(name: Name): {
    id: string;
    value: Values[Name];
    onChange: (
      value: Values[Name] | { target: { value: Values[Name] } },
    ) => void;
    onBlur: () => void;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean;
    'data-dirty': boolean;
    'data-touched': boolean;
    errorId: string | undefined;
  } | null {
    const snapshot = this.getFieldSnapshot(name);
    if (!snapshot) return null;
    return {
      id: snapshot.id,
      value: snapshot.value,
      onChange: (value) => this.setFieldValue(name, value),
      onBlur: () => this.touchField(name, true),
      'aria-describedby': snapshot.ariaDescribedBy,
      'aria-invalid': snapshot.ariaInvalid,
      'data-dirty': snapshot.dirty,
      'data-touched': snapshot.touched,
      errorId: snapshot.errorId,
    };
  }

  setFieldErrors<Name extends keyof Values & string>(name: Name, errors: string[]): void {
    const field = this.getField(name);
    if (!field) return;
    field.errors = [...errors];
    this.notifyField(name);
    this.notifyForm();
  }

  private getValues(): Values {
    const values = {} as Values;
    for (const [name, field] of this.fields) {
      (values as Record<string, unknown>)[name] = field.value;
    }
    return values;
  }

  private getErrors(): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    for (const [name, field] of this.fields) {
      errors[name] = [...field.errors];
    }
    return errors;
  }

  private getContext<Name extends keyof Values & string>(name: Name): FormContext<Values> {
    const field = this.getField(name);
    const values = this.getValues();
    return {
      values,
      name,
      touched: Boolean(field?.touched),
      dirty: Boolean(field?.dirty),
    };
  }

  private notifyField<Name extends keyof Values & string>(name: Name): void {
    const listeners = this.fieldListeners.get(name) as
      | Set<FieldListener<Values[Name]>>
      | undefined;
    if (!listeners || !listeners.size) return;
    const snapshot = this.getFieldSnapshot(name);
    if (!snapshot) return;
    for (const listener of listeners) {
      listener(snapshot);
    }
  }

  private notifyForm(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.formListeners) {
      listener(snapshot);
    }
  }

  private getField<Name extends keyof Values & string>(
    name: Name,
  ): FieldState<Values[Name], Values> | undefined {
    const field = this.fields.get(name);
    return field as FieldState<Values[Name], Values> | undefined;
  }

  private ensureListenerSet<Name extends keyof Values & string>(
    name: Name,
  ): Set<FieldListener<Values[Name]>> {
    let listeners = this.fieldListeners.get(name);
    if (!listeners) {
      listeners = new Set<FieldListener<unknown>>();
      this.fieldListeners.set(name, listeners);
    }
    return listeners as Set<FieldListener<Values[Name]>>;
  }
}
