

function PartialBorder({ percentage = 60, children }: { percentage: number, children: React.ReactNode }) {
  return (
    <div className="relative w-64 h-64">
      <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          fill="none"
          stroke="#50589C"
          strokeWidth="30"
          strokeDasharray="100"
          strokeDashoffset={100-percentage%100}
          strokeLinecap="round"
          pathLength="100"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center h-full">
        {children}
      </div>
    </div>
  );
}

export default PartialBorder