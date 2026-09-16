import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

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

interface StatisticsDisplayMode {
  showTable?: boolean;
}

// GW is part of the comparison: the requirement names it explicitly.
const EEMI_ATTRIBUTES = ['gw', 'twgeb', 'twofs', 'twrio', 'twsub', 'tweben'];

const Statistics: React.FC<StatisticsDisplayMode> = ({ showTable = true }) => {
  const [data, setData] = useState<GeoJSONFeature[]>([]);
  const [tableStatistics, setTableStatistics] = useState<any>(null);
  const [chartStatistics, setChartStatistics] = useState<EemiStatistic[]>([]);
  // Keep the chart instance so it can be destroyed before the canvas is reused.
  const chartRef = useRef<Chart | null>(null);

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

      // Create a chart - drop the previous one first, a canvas can only hold one
      const ctx = document.getElementById('statisticsChart') as HTMLCanvasElement;
      chartRef.current?.destroy();
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: eemiStatistics.map(stat => stat.attribute.toUpperCase()),
          datasets: [{
            label: 'Total',
            data: eemiStatistics.map(stat => stat.total),
            yAxisID: 'yTotal',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }, {
            label: 'Average',
            data: eemiStatistics.map(stat => stat.average),
            // Averages (1-5) would vanish next to the totals, so they get their own axis
            yAxisID: 'yAverage',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'EEMI Attribute'
              }
            },
            yTotal: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total'
              }
            },
            yAverage: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              suggestedMax: 5,
              grid: {
                drawOnChartArea: false
              },
              title: {
                display: true,
                text: 'Average grade'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
          }
        }
      });

      // Generate table statistics
      const statistics = calculateStatistics(data, averageGW);
      setTableStatistics(statistics);
    }
  }, [data]);

  // Release the chart when the component goes away, so the canvas stays reusable
  useEffect(() => () => {
    chartRef.current?.destroy();
    chartRef.current = null;
  }, []);

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
          <canvas
            id="statisticsChart"
            role="img"
            aria-label="Total and average EEMI grade per evaluation"
          ></canvas>
          {/* The canvas is pixels only: the same numbers as a table, readable by
              screen readers and assertable in tests. */}
          {chartStatistics.length > 0 && (
            <table className="chart-data table-auto w-full border-collapse border border-gray-200 mt-2 text-sm">
              <caption className="text-left text-xs text-gray-500 mb-1">Chart values</caption>
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-1 text-left">Evaluation</th>
                  <th className="px-2 py-1 text-right">Average</th>
                  <th className="px-2 py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {chartStatistics.map(stat => (
                  <tr key={stat.attribute} data-series={stat.attribute}>
                    <td className="series-label border px-2 py-1">{stat.attribute.toUpperCase()}</td>
                    <td className="series-average border px-2 py-1 text-right" data-value={stat.average}>{stat.average.toFixed(2)}</td>
                    <td className="series-total border px-2 py-1 text-right" data-value={stat.total}>{stat.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
