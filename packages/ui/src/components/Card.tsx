import { HTMLAttributes, forwardRef } from 'react';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`bg-white rounded-lg shadow p-6 ${className}`} {...props}>
      {children}
    </div>
  )
);

Card.displayName = 'Card';

export { Card };
