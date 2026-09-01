import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendChartProps {
  simulatedWeeks: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ simulatedWeeks }) => {
  const chartData = [
    { week: 'Wk -4', predictedRisk: 42000, preventedRevenue: 31000, lostRevenue: 4200 },
    { week: 'Wk -3', predictedRisk: 46500, preventedRevenue: 38200, lostRevenue: 3800 },
    { week: 'Wk -2', predictedRisk: 44100, preventedRevenue: 36900, lostRevenue: 3100 },
    { week: 'Wk -1', predictedRisk: 49800, preventedRevenue: 43500, lostRevenue: 2900 },
    { week: `Sim Wk ${simulatedWeeks}`, predictedRisk: 52400 + simulatedWeeks * 2100, preventedRevenue: 46200 + simulatedWeeks * 2800, lostRevenue: 2100 },
  ];

  return (
    <div className="rounded-2xl border border-[#23304D] bg-[#131B2E] p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Predicted Risk vs. Prevented Revenue Timeline
          </h3>
          <p className="text-xs text-[#94A3B8]">
            Simulated trajectory comparing flagged risk volume to successfully pre-empted revenue
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-[#10B981]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" /> Prevented Revenue
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Predicted Risk
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="preventedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#23304D" vertical={false} />
            <XAxis dataKey="week" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#0B0F17',
                borderColor: '#23304D',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
            />

            <Area
              type="monotone"
              dataKey="predictedRisk"
              name="Predicted Risk"
              stroke="#F59E0B"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#riskGrad)"
            />
            <Area
              type="monotone"
              dataKey="preventedRevenue"
              name="Prevented Revenue"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#preventedGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
