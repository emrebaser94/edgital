import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface GeoJSONFeature {
  type: string;
  properties: {
    fid: number;
    idsec: number;
    evnk: string;
    ennk: string;
    len: number;
    name: string;
    eemi_area: Record<string, Record<string, { area_rel: number }>>;
    eemi_grade: Record<string, number>;
  };
}

interface EemiStatistic {
  attribute: string;
  total: number;
  average: number;
}

type Metric = 'total' | 'average';

interface StatisticsDisplayMode {
  showTable?: boolean;
}

// GW is part of the comparison: the requirement names it explicitly.
const EEMI_ATTRIBUTES = ['gw', 'twgeb', 'twofs', 'twrio', 'twsub', 'tweben'];

const METRICS: Metric[] = ['total', 'average'];

const METRIC_LABELS: Record<Metric, string> = {
  total: 'Total',
  average: 'Average',
};

const BAR_COLORS: Record<Metric, { fill: string; stroke: string }> = {
  total: { fill: 'rgba(255, 99, 132, 0.2)', stroke: 'rgba(255, 99, 132, 1)' },
  average: { fill: 'rgba(54, 162, 235, 0.2)', stroke: 'rgba(54, 162, 235, 1)' },
};

// Chart geometry in viewBox units; the SVG scales to the width of its container.
const WIDTH = 600;
const HEIGHT = 300;
const MARGIN = { top: 16, right: 48, bottom: 72, left: 64 };
const MAX_GRADE = 5;

/**
 * Bar chart drawn as SVG, so every bar is a DOM element that carries its value
 * (data-series, data-metric, data-value). Totals and averages differ by three
 * orders of magnitude, so each metric is scaled to its own axis: totals left,
 * averages (grade 0-5) right. Like a Chart.js legend, clicking a legend entry
 * hides or shows the bars of that metric.
 */
const GradeBarChart: React.FC<{ statistics: EemiStatistic[] }> = ({ statistics }) => {
  const [visible, setVisible] = useState<Record<Metric, boolean>>({ total: true, average: true });
  const toggle = (metric: Metric) => setVisible(current => ({ ...current, [metric]: !current[metric] }));
  const visibleMetrics = METRICS.filter(metric => visible[metric]);

  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const plotBottom = MARGIN.top + plotHeight;
  const maxTotal = Math.max(...statistics.map(stat => stat.total), 1);
  const band = plotWidth / statistics.length;
  const barWidth = band * 0.35;
  const yFor = (share: number) => MARGIN.top + plotHeight * (1 - share);

  const bar = (stat: EemiStatistic, metric: Metric, index: number) => {
    const value = stat[metric];
    const share = metric === 'total' ? value / maxTotal : value / MAX_GRADE;
    // Centre the visible bars of a group in their band
    const groupWidth = barWidth * visibleMetrics.length;
    const x = MARGIN.left + index * band + (band - groupWidth) / 2 + visibleMetrics.indexOf(metric) * barWidth;
    return (
      <rect
        key={metric}
        className="bar"
        data-series={stat.attribute}
        data-metric={metric}
        data-value={value}
        x={x}
        y={yFor(share)}
        width={barWidth}
        height={plotHeight * share}
        fill={BAR_COLORS[metric].fill}
        stroke={BAR_COLORS[metric].stroke}
      >
        <title>{`${stat.attribute.toUpperCase()} ${metric}: ${value.toFixed(2)}`}</title>
      </rect>
    );
  };

  return (
    <svg
      id="statisticsChart"
      role="img"
      aria-label="Total and average EEMI grade per evaluation"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
    >
      {/* axes */}
      <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={plotBottom} stroke="#9CA3AF" />
      <line x1={WIDTH - MARGIN.right} y1={MARGIN.top} x2={WIDTH - MARGIN.right} y2={plotBottom} stroke="#9CA3AF" />
      <line x1={MARGIN.left} y1={plotBottom} x2={WIDTH - MARGIN.right} y2={plotBottom} stroke="#9CA3AF" />
      {visible.total && (
        <>
          {[0, 0.5, 1].map(share => (
            <text key={`total-${share}`} x={MARGIN.left - 6} y={yFor(share)} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#6B7280">
              {Math.round(maxTotal * share)}
            </text>
          ))}
          <text transform={`rotate(-90 14 ${MARGIN.top + plotHeight / 2})`} x={14} y={MARGIN.top + plotHeight / 2} textAnchor="middle" fontSize="11">
            Total
          </text>
        </>
      )}
      {visible.average && (
        <>
          {[0, 1, 2, 3, 4, 5].map(grade => (
            <text key={`average-${grade}`} x={WIDTH - MARGIN.right + 6} y={yFor(grade / MAX_GRADE)} dominantBaseline="middle" fontSize="10" fill="#6B7280">
              {grade}
            </text>
          ))}
          <text transform={`rotate(90 ${WIDTH - 12} ${MARGIN.top + plotHeight / 2})`} x={WIDTH - 12} y={MARGIN.top + plotHeight / 2} textAnchor="middle" fontSize="11">
            Average grade
          </text>
        </>
      )}

      {/* bars */}
      {statistics.map((stat, index) => (
        <g key={stat.attribute} className="bar-group" data-series={stat.attribute}>
          {visibleMetrics.map(metric => bar(stat, metric, index))}
          <text x={MARGIN.left + index * band + band / 2} y={plotBottom + 16} textAnchor="middle" fontSize="11">
            {stat.attribute.toUpperCase()}
          </text>
        </g>
      ))}
      <text x={MARGIN.left + plotWidth / 2} y={plotBottom + 36} textAnchor="middle" fontSize="11">
        EEMI Attribute
      </text>

      {/* legend ("chart-legend": the map page already has a ".legend"); click to hide/show */}
      <g className="chart-legend">
        {METRICS.map((metric, index) => (
          <g
            key={metric}
            className="chart-legend-item"
            data-metric={metric}
            role="button"
            tabIndex={0}
            aria-pressed={visible[metric]}
            aria-label={`${visible[metric] ? 'Hide' : 'Show'} the ${METRIC_LABELS[metric]} bars`}
            transform={`translate(${WIDTH / 2 - 70 + index * 90} ${HEIGHT - 14})`}
            opacity={visible[metric] ? 1 : 0.4}
            style={{ cursor: 'pointer' }}
            onClick={() => toggle(metric)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggle(metric);
              }
            }}
          >
            {/* transparent hit area, so a click anywhere on the entry counts */}
            <rect x={-4} y={-14} width={80} height={20} fill="transparent" />
            <rect width={12} height={12} y={-10} fill={BAR_COLORS[metric].fill} stroke={BAR_COLORS[metric].stroke} />
            <text x={18} fontSize="11" textDecoration={visible[metric] ? undefined : 'line-through'}>
              {METRIC_LABELS[metric]}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

const Statistics: React.FC<StatisticsDisplayMode> = ({ showTable = true }) => {
  const [data, setData] = useState<GeoJSONFeature[]>([]);
  const [tableStatistics, setTableStatistics] = useState<any>(null);
  const [chartStatistics, setChartStatistics] = useState<EemiStatistic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/roads');
        setData(response.data.features);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const eemiStatistics = EEMI_ATTRIBUTES.map(attr => {
        const roadsWithAttr = data.filter(road => road.properties.eemi_grade && road.properties.eemi_grade[attr] !== undefined);
        const totalAttrValue = roadsWithAttr.reduce((acc, road) => acc + road.properties.eemi_grade[attr], 0);
        const averageAttrValue = totalAttrValue / roadsWithAttr.length;
        return { attribute: attr, total: totalAttrValue, average: averageAttrValue };
      });
      setChartStatistics(eemiStatistics);

      // Calculate average gw value
      const gwValues = data.map(road => road.properties.eemi_grade['gw']);
      const averageGW = gwValues.reduce((total, value) => total + value, 0) / gwValues.length;

      // Generate table statistics
      const statistics = calculateStatistics(data, averageGW);
      setTableStatistics(statistics);
    }
  }, [data]);

  const calculateStatistics = (roadsData: GeoJSONFeature[], averageGW: number) => {
    // Initialize variables for statistics
    let totalRoads = roadsData.length;
    let totalLength = 0;
    let maxLength = Number.MIN_SAFE_INTEGER;
    let minLength = Number.MAX_SAFE_INTEGER;
    let lengthDistribution = {
      '0-30m': 0,
      '31-60m': 0,
      '61-90m': 0
    };

    // Calculate statistics for each road
    roadsData.forEach(road => {
      let roadLength = road.properties.len;
      totalLength += roadLength;
      maxLength = Math.max(maxLength, roadLength);
      minLength = Math.min(minLength, roadLength);

      // Update length distribution
      if (roadLength <= 30) {
        lengthDistribution['0-30m']++;
      } else if (roadLength <= 60) {
        lengthDistribution['31-60m']++;
      } else {
        lengthDistribution['61-90m']++;
      }
    });

    // Calculate average length
    let averageLength = totalLength / totalRoads;

    return {
      totalRoads,
      totalLength,
      averageLength,
      maxLength,
      minLength,
      lengthDistribution,
      averageGW
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">EEMI Attributes Comparison</h2>
      <div className={`flex flex-col md:flex-row items-center justify-center ${showTable ? 'md:items-start' : ''}`}>
        <div className={`chart-container mb-4 ${showTable ? 'md:mb-0 md:mr-4 w-full md:w-1/2' : 'w-full'}`}>
          {chartStatistics.length > 0 && <GradeBarChart statistics={chartStatistics} />}
        </div>
        {showTable && tableStatistics && (
          <div className="table-container">
            <table className="table-auto w-full border-collapse border border-gray-200 mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Metric</th>
                  <th className="px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Total Roads</td>
                  <td className="border px-4 py-2">{tableStatistics.totalRoads}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Total Length (m)</td>
                  <td className="border px-4 py-2">{tableStatistics.totalLength}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Average Length (m)</td>
                  <td className="border px-4 py-2">{tableStatistics.averageLength}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Max Length (m)</td>
                  <td className="border px-4 py-2">{tableStatistics.maxLength}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Min Length (m)</td>
                  <td className="border px-4 py-2">{tableStatistics.minLength}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Length Distribution</td>
                  <td className="border px-4 py-2">
                    <ul>
                      {Object.entries(tableStatistics.lengthDistribution).map(([range, count]) => (
                        <li key={range}>{range}: {count as any}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Average GW</td>
                  <td className="border px-4 py-2">{tableStatistics.averageGW}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
