'use client';

import { useRef } from 'react';

type DonutPercentPickerProps = {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  size?: number;
};

export function DonutPercentPicker({
  value,
  onChange,
  step = 5,
  size = 200,
}: DonutPercentPickerProps) {
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - pct / 100);

  const center = size / 2;
  const knobAngle = (pct / 100) * 360 - 90;
  const rad = (knobAngle * Math.PI) / 180;
  const knobX = center + radius * Math.cos(rad);
  const knobY = center + radius * Math.sin(rad);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    let angle = Math.atan2(y, x);
    angle += Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;
    const raw = (angle / (2 * Math.PI)) * 100;
    const snapped = Math.round(raw / step) * step;
    onChange(Math.max(0, Math.min(100, snapped)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromPointer(e.clientX, e.clientY);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        tabIndex={0}
        className="touch-none select-none"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(Math.min(100, pct + step));
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(Math.max(0, pct - step));
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <circle cx={center} cy={center} r={radius} stroke="#E0E2E4" strokeWidth="22" fill="none" />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#111827"
          strokeWidth="22"
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <circle cx={knobX} cy={knobY} r="14" fill="#111827" />
        <circle cx={knobX} cy={knobY} r="8" fill="white" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-gray-800"
          style={{ fontSize: 28, fontWeight: 800 }}
        >
          {pct}%
        </text>
      </svg>
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg border border-gray-100 px-3 py-1 text-sm font-medium text-gray-600 focus:bg-gray-100"
          onClick={() => onChange(Math.max(0, pct - step))}
        >
          -{step}%
        </button>
        <button
          className="rounded-lg border border-gray-100 px-3 py-1 text-sm font-medium text-gray-600 focus:bg-gray-100"
          onClick={() => onChange(Math.min(100, pct + step))}
        >
          +{step}%
        </button>
      </div>
    </div>
  );
}
