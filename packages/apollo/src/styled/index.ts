import * as React from 'react';

type Primitive = string | number;

export type StyleObject = {
  [property: string]: Primitive | StyleObject | null | undefined | false;
};

const camelToKebab = (value: string): string =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();

type StyleValue = Primitive | StyleObject | null | undefined | false;

const isStyleObject = (value: StyleValue): value is StyleObject =>
  typeof value === 'object' && value !== null;

const isCssProperties = (value: unknown): value is React.CSSProperties =>
  typeof value === 'object' && value !== null;

const isReactNode = (value: unknown): value is React.ReactNode => {
  if (
    value === undefined ||
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isReactNode);
  }

  return React.isValidElement(value);
};

const serializeStyles = (style: StyleObject, selector: string): string => {
  let declarations = '';
  let nested = '';

  for (const [prop, value] of Object.entries(style)) {
    if (value === undefined || value === null || value === false) {
      continue;
    }

    if (isStyleObject(value)) {
      const nestedSelector = prop.includes('&')
        ? prop.replace(/&/g, selector)
        : prop.startsWith('@')
        ? prop
        : `${selector} ${prop}`;
      if (prop.startsWith('@')) {
        nested += `${nestedSelector}{${serializeStyles(value, selector)}}`;
      } else {
        nested += serializeStyles(value, nestedSelector);
      }
    } else {
      declarations += `${camelToKebab(prop)}:${String(value)};`;
    }
  }

  const baseRule = declarations ? `${selector}{${declarations}}` : '';
  return baseRule + nested;
};

const hashString = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

export class StyleRegistry {
  private cache = new Map<string, string>();

  private rules: string[] = [];

  private styleElement?: HTMLStyleElement;

  register(style: StyleObject): string {
    const cacheKey = JSON.stringify(style);
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const className = `ap-${hashString(cacheKey)}`;
    const rule = serializeStyles(style, `.${className}`);
    const finalClassName = rule ? className : '';
    this.cache.set(cacheKey, finalClassName);
    if (rule) {
      this.rules.push(rule);
      this.flush();
    }
    return finalClassName;
  }

  clear(): void {
    this.cache.clear();
    this.rules = [];
    if (this.styleElement) {
      this.styleElement.textContent = '';
    }
  }

  getStyles(): string {
    return this.rules.join('');
  }

  private flush(): void {
    if (typeof document === 'undefined') {
      return;
    }
    if (!this.styleElement || !this.styleElement.isConnected) {
      const existing = document.head.querySelector<HTMLStyleElement>('style[data-apollo-styled]');
      this.styleElement = existing ?? document.createElement('style');
      this.styleElement.setAttribute('data-apollo-styled', 'true');
      if (!existing) {
        document.head.appendChild(this.styleElement);
      }
    }
    this.styleElement.textContent = this.getStyles();
  }
}

export const styleRegistry = new StyleRegistry();

export const cx = (...classNames: Array<string | false | null | undefined>): string =>
  classNames.filter(Boolean).join(' ');

type VariantsConfig = Record<string, Record<string, StyleObject>>;

export type EmptyVariants = Record<never, Record<string, StyleObject>>;

type StyledElementType = React.ElementType;

type Simplify<T> = { [Key in keyof T]: T[Key] } & {};

const resolveElementType = <TTag extends StyledElementType>(
  tag: TTag,
  override?: StyledElementType,
): StyledElementType => override ?? tag;

const isElementType = (value: unknown): value is StyledElementType =>
  typeof value === 'string' || typeof value === 'function' || value instanceof Object;

type VariantSelection<Variants extends VariantsConfig> = {
  [K in keyof Variants]?: keyof Variants[K];
};

type InferComponentProps<TTag extends StyledElementType> = TTag extends React.ForwardRefExoticComponent<
  infer Props
>
  ? Props
  : TTag extends React.MemoExoticComponent<infer Component>
  ? InferComponentProps<Component>
  : TTag extends React.ComponentType<infer Props>
  ? Props
  : TTag extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TTag]
  : never;

type WithoutRef<Props> = Props extends object
  ? Omit<Props, keyof React.RefAttributes<unknown>>
  : Props;

type BaseProps<TTag extends StyledElementType> = WithoutRef<InferComponentProps<TTag>>;

export type StyledComponentProps<
  TTag extends StyledElementType,
  Variants extends VariantsConfig,
> = Simplify<
  Omit<BaseProps<TTag>, 'className' | 'style' | 'children'> &
    VariantSelection<Variants> & {
      as?: StyledElementType;
      className?: string | undefined;
      style?: React.CSSProperties | undefined;
      children?: React.ReactNode;
    }
>;

interface StyledConfig<
  Variants extends VariantsConfig,
  ComponentProps extends Record<string, unknown>,
> {
  base?: StyleObject;
  variants?: Variants;
  compoundVariants?: Array<{
    variants: Partial<VariantSelection<Variants>>;
    style: StyleObject;
  }>;
  defaultVariants?: Partial<VariantSelection<Variants>>;
  dataAttributes?: (
    variantValues: Readonly<VariantSelection<Variants>>,
    props: Readonly<React.PropsWithoutRef<ComponentProps>>,
  ) => Record<string, string | number | boolean | null | undefined>;
}

export const createStyled = <
  TTag extends StyledElementType,
  Variants extends VariantsConfig = EmptyVariants,
  AdditionalProps extends Record<string, unknown> = Record<never, never>,
>(
  tag: TTag,
  config: StyledConfig<Variants, StyledComponentProps<TTag, Variants> & AdditionalProps> = {},
): React.ForwardRefExoticComponent<
  React.PropsWithoutRef<StyledComponentProps<TTag, Variants> & AdditionalProps> &
    React.RefAttributes<React.ElementRef<TTag>>
> => {
  type Props = StyledComponentProps<TTag, Variants> & AdditionalProps;
  type VariantKey = keyof Variants;
  type VariantValueMap = VariantSelection<Variants>;

  const StyledComponent = React.forwardRef<React.ElementRef<TTag>, Props>((props, ref) => {
    const restProps: Record<string, unknown> = { ...props };
    const asCandidate = restProps.as;
    const classNameCandidate = restProps.className;
    const styleCandidate = restProps.style;
    const childrenCandidate = restProps.children;
    delete restProps.as;
    delete restProps.className;
    delete restProps.style;
    delete restProps.children;
    const variantKeys = config.variants
      ? (Object.keys(config.variants) as VariantKey[])
      : ([] as VariantKey[]);
    const variantKeySet = new Set<string>(variantKeys.map((key) => String(key)));
    const variantValues: VariantValueMap = {};
    const cleanedProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(restProps)) {
      if (variantKeySet.has(key)) {
        if (typeof value === 'string') {
          variantValues[key as VariantKey] = value as VariantValueMap[VariantKey];
        }
        continue;
      }
      cleanedProps[key] = value;
    }

    if (config.defaultVariants) {
      for (const [variantKey, variantValue] of Object.entries(config.defaultVariants) as Array<
        [VariantKey, VariantValueMap[VariantKey]]
      >) {
        if (variantValues[variantKey] === undefined) {
          variantValues[variantKey] = variantValue;
        }
      }
    }

    const classes: string[] = [];
    if (config.base) {
      const baseClass = styleRegistry.register(config.base);
      if (baseClass) {
        classes.push(baseClass);
      }
    }

    if (config.variants) {
      for (const [variantName, variantMap] of Object.entries(config.variants) as Array<[
        VariantKey,
        Record<string, StyleObject>,
      ]>) {
        const selected = variantValues[variantName];
        if (selected === undefined) {
          continue;
        }
        const variantStyle = variantMap[selected as keyof typeof variantMap];
        if (variantStyle) {
          const variantClass = styleRegistry.register(variantStyle);
          if (variantClass) {
            classes.push(variantClass);
          }
        }
      }
    }

    if (config.compoundVariants) {
      for (const compound of config.compoundVariants) {
        const matches = (Object.entries(compound.variants) as Array<[
          VariantKey,
          VariantValueMap[VariantKey],
        ]>).every(([variantKey, expected]) => variantValues[variantKey] === expected);
        if (matches) {
          const compoundClass = styleRegistry.register(compound.style);
          if (compoundClass) {
            classes.push(compoundClass);
          }
        }
      }
    }

    if (config.dataAttributes) {
      const attrs = config.dataAttributes(variantValues, props);
      for (const attrKey of Object.keys(attrs)) {
        const attrValue = attrs[attrKey];
        if (attrValue === undefined || attrValue === null || attrValue === false) {
          continue;
        }
        const normalizedKey = attrKey.startsWith('data-')
          ? attrKey
          : `data-${camelToKebab(attrKey)}`;
        cleanedProps[normalizedKey] = attrValue === true ? '' : attrValue;
      }
    }

    const overrideElement = isElementType(asCandidate) ? asCandidate : undefined;
    const Element = resolveElementType(tag, overrideElement);
    const safeClassName =
      typeof classNameCandidate === 'string' ? classNameCandidate : undefined;
    const mergedClassName = cx(...classes, safeClassName);
    const safeStyle = isCssProperties(styleCandidate) ? styleCandidate : undefined;

    const elementProps: React.Attributes &
      Record<string, unknown> & {
        className?: string | undefined;
        style?: React.CSSProperties | undefined;
        ref: typeof ref;
        children?: React.ReactNode;
      } = {
      ...cleanedProps,
      className: mergedClassName || undefined,
      style: safeStyle,
      ref,
    };

    if (isReactNode(childrenCandidate)) {
      elementProps.children = childrenCandidate;
    }

    return React.createElement(Element, elementProps);
  });

  const tagName =
    typeof tag === 'string'
      ? `Styled(${String(tag)})`
      : (tag as { displayName?: string }).displayName ??
        (tag as { name?: string }).name ??
        'Component';
  StyledComponent.displayName = tagName;

  return StyledComponent;
};

export type VariantProps<Variants extends VariantsConfig> = VariantSelection<Variants>;
