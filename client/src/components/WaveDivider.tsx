/*
 * Design: Terra Viva — Ondas suaves como divisores de seção
 */

interface WaveDividerProps {
  color: string;
  flip?: boolean;
}

export default function WaveDivider({ color, flip }: WaveDividerProps) {
  return (
    <div className={`relative w-full overflow-hidden ${flip ? "rotate-180" : ""}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-12 sm:h-16 md:h-20"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C120,100 360,20 600,50 C840,80 1080,20 1320,60 C1380,70 1410,80 1440,75 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
