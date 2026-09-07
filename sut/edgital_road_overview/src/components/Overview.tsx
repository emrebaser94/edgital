import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

// Define an interface representing the structure of GeoJSON features
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
    eemi_grade: {
      gw: number;
    };
  };
}

const ITEMS_PER_PAGE = 8;

const Overview = () => {
  const [data, setData] = useState<GeoJSONFeature[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ features: GeoJSONFeature[] }>('http://localhost:3000/roads');
        setData(response.data.features);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Calculate total number of pages
  const pageCount = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Get data for the current page
  const currentPageData = data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Road Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Len</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EVNK</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENNK</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentPageData.map((road) => (
            <tr key={road.properties.fid}>
              <td className="px-6 py-4 whitespace-nowrap">{road.properties.fid}</td>
              <td className="px-6 py-4 whitespace-nowrap">{road.properties.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{road.properties.len}</td>
              <td className="px-6 py-4 whitespace-nowrap">{road.properties.evnk}</td>
              <td className="px-6 py-4 whitespace-nowrap">{road.properties.ennk}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    </div>
  );
};

export default Overview;
