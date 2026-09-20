import * as React from 'react';

/**
 * Prop for polymorphic element rendering ('as' prop).
 */
export type AsProp<C extends React.ElementType> = {
  as?: C;
};

/**
 * Strips props from Source that are present in Target.
 */
export type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

/**
 * Complete polymorphic component props without ref.
 */
export type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

/**
 * Element ref type for a polymorphic component.
 */
export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref'];

/**
 * Complete polymorphic component props with ref support.
 */
export type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };
