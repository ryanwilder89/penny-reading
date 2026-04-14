export type GrowthStatus = 'green' | 'yellow' | 'red';

export interface FluencyDataPoint {
  date: string;
  wcpm: number;
}

export interface GrowthResult {
  growthRatePerWeek: number;
  status: GrowthStatus;
}

export function calculateGrowthRate(data: FluencyDataPoint[]): GrowthResult {
  if (data.length < 2) {
    return { growthRatePerWeek: 0, status: 'yellow' };
  }

  // Filter to last 4 weeks (28 days) if possible
  const today = new Date().getTime();
  const past28Days = data.filter(d => {
     const t = new Date(d.date).getTime();
     return (today - t) <= 28 * 24 * 60 * 60 * 1000;
  });

  const points = past28Days.length >= 2 ? past28Days : data.slice(-2);
  
  // Linear regression: y = mx + c where x is time in weeks, y is WCPM
  const xValues = points.map(d => new Date(d.date).getTime() / (7 * 24 * 60 * 60 * 1000));
  const yValues = points.map(d => d.wcpm);
  
  const n = points.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((a, x, i) => a + x * yValues[i], 0);
  const sumXX = xValues.reduce((a, x) => a + x * x, 0);
  
  // Protect against Division by Zero if all dates are exactly the same
  const denominator = (n * sumXX - sumX * sumX);
  if (denominator === 0) {
    return { growthRatePerWeek: 0, status: 'yellow' };
  }

  const m = (n * sumXY - sumX * sumY) / denominator;
  
  if (isNaN(m) || !isFinite(m)) {
      return { growthRatePerWeek: 0, status: 'yellow' };
  }

  let status: GrowthStatus = 'red';
  if (m >= 2.0) status = 'green';
  else if (m >= 1.0) status = 'yellow';
  
  return {
    growthRatePerWeek: m,
    status
  };
}
