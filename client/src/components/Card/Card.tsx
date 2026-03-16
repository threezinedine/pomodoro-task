import type { ReactNode, HTMLAttributes } from 'react';
import './Card.scss';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  children,
  padding = 'md',
  shadow = 'sm',
  className = '',
  ...props
}: CardProps) => {
  const baseClass = 'card';
  const paddingClass = `${baseClass}--p-${padding}`;
  const shadowClass = `${baseClass}--shadow-${shadow}`;
  
  const classes = [baseClass, paddingClass, shadowClass, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
