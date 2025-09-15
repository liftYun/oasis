'use client';

interface Props {
  latitude: number;
  longitude: number;
}

export function StayMap({ latitude, longitude }: Props) {
  return (
    <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-400 text-sm">
        지도: ({latitude}, {longitude})
      </p>
    </div>
  );
}
