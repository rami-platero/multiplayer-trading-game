import { forwardRef } from 'react';

type GameContainerProps = {
  id: string;
};

export const StickGame = forwardRef<HTMLDivElement, GameContainerProps>(
  ({ id }, ref) => (
    <div ref={ref} id={id}>
    </div>
  )
);
