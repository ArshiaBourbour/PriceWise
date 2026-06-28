'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts';
import { formatPrice } from '@/utils';

interface PriceChartProps {
  history: (number | null)[];
  labels: string[];
  minPrice: number;
  avgPrice: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length || payload[0].value == null) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-[11px]"
      style={{ background: '#181828', border: '1px solid rgba(255,255,255,0.16)' }}
    >
      <div className="text-white/40 mb-0.5">{label}</div>
      <div className="text-white font-bold">{formatPrice(payload[0].value)} تومان</div>
    </div>
  );
};

export default function PriceChart({ history, labels, minPrice, avgPrice }: PriceChartProps) {
  const data = history.map((price, i) => ({
    date: labels[i] ?? `${i + 1}`,
    price: price ?? undefined,
  }));

  const minIdx = history.reduce((best, v, i) =>
    v != null && (best === -1 || v < (history[best] ?? Infinity)) ? i : best, -1);

  return (
    <div className="h-[140px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)', fontFamily: 'Vazirmatn' }}
            stroke="rgba(255,255,255,0.09)"
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
            stroke="rgba(255,255,255,0.09)"
            width={35}
          />

          <Tooltip content={<CustomTooltip />} />

          {avgPrice > 0 && (
            <ReferenceLine
              y={avgPrice}
              stroke="#f59e0b"
              strokeDasharray="5 4"
              strokeOpacity={0.7}
              label={{ value: 'میانگین', fill: '#f59e0b', fontSize: 9, position: 'right' }}
            />
          )}
          {minPrice > 0 && (
            <ReferenceLine
              y={minPrice}
              stroke="#10b981"
              strokeDasharray="5 4"
              strokeOpacity={0.6}
            />
          )}

          <Area
            type="monotone"
            dataKey="price"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#priceGrad)"
            dot={(props) => {
              const isMin = props.index === minIdx;
              return (
                <circle
                  key={props.index}
                  cx={props.cx} cy={props.cy}
                  r={isMin ? 5 : 3}
                  fill={isMin ? '#10b981' : '#6366f1'}
                  stroke={isMin ? 'white' : '#07070e'}
                  strokeWidth={1.5}
                />
              );
            }}
            activeDot={{ r: 5, fill: '#6366f1', stroke: 'white', strokeWidth: 2 }}
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
