import React, { useState, useEffect } from 'react';
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

interface StatisticsDisplayMode {
  showTable?: boolean;
}

const Statistics: React.FC<StatisticsDisplayMode> = ({ showTable = true }) => {
  const [data, setData] = useState<GeoJSONFeature[]>([]);
  const [tableStatistics, setTableStatistics] = useState<any>(null);

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
      const eemiAttributes = ['twgeb', 'twofs', 'twrio', 'twsub', 'tweben'];
      const eemiStatistics = eemiAttributes.map(attr => {
        const roadsWithAttr = data.filter(road => road.properties.eemi_grade && road.properties.eemi_grade[attr] !== undefined);
        const totalAttrValue = roadsWithAttr.reduce((acc, road) => acc + road.properties.eemi_grade[attr], 0);
        const averageAttrValue = totalAttrValue / roadsWithAttr.length;
        return { attribute: attr, total: totalAttrValue, average: averageAttrValue };
      });

      // Calculate average gw value
      const gwValues = data.map(road => road.properties.eemi_grade['gw']);
      const averageGW = gwValues.reduce((total, value) => total + value, 0) / gwValues.length;

      // Create a chart
      const ctx = document.getElementById('statisticsChart') as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: eemiStatistics.map(stat => stat.attribute),
          datasets: [{
            label: 'Total',
            data: eemiStatistics.map(stat => stat.total),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }, {
            label: 'Average',
            data: eemiStatistics.map(stat => stat.average),
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
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Value'
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
          <canvas id="statisticsChart"></canvas>
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
