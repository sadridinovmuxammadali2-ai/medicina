import React from 'react';
import { Oval, ThreeDots, DNA, TailSpin, RotatingLines } from 'react-loader-spinner';

interface LoaderSpinnerProps {
  type?: 'oval' | 'threedots' | 'dna' | 'tailspin' | 'rotating';
  color?: string;
  size?: number;
  label?: string;
}

export const LoaderSpinner: React.FC<LoaderSpinnerProps> = ({
  type = 'oval',
  color = '#14b8a6', // Teal 500
  size = 36,
  label = "Server bilan aloqa o'rnatilmoqda..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-3 animate-in fade-in duration-300">
      {type === 'oval' && (
        <Oval
          height={size}
          width={size}
          color={color}
          secondaryColor="#334155"
          strokeWidth={4}
          strokeWidthSecondary={4}
          visible={true}
          ariaLabel="loading-oval"
        />
      )}

      {type === 'threedots' && (
        <ThreeDots
          height={size}
          width={size * 1.5}
          color={color}
          radius="9"
          ariaLabel="loading-dots"
          visible={true}
        />
      )}

      {type === 'dna' && (
        <DNA
          visible={true}
          height={size * 1.2}
          width={size * 1.2}
          ariaLabel="loading-dna"
        />
      )}

      {type === 'tailspin' && (
        <TailSpin
          height={size}
          width={size}
          color={color}
          radius="1"
          visible={true}
          ariaLabel="loading-tailspin"
        />
      )}

      {type === 'rotating' && (
        <RotatingLines
          strokeColor={color}
          strokeWidth="5"
          animationDuration="0.75"
          width={String(size)}
          visible={true}
        />
      )}

      {label && (
        <span className="text-xs font-bold text-teal-300 animate-pulse tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};
