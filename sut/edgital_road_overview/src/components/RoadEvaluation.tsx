import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import TodoModal from './TodoModal';
import { Feature, Geometry } from 'geojson';
import Statistics from './Statistics';
import { InformationCircleOutline } from 'react-ionicons'

interface Todo {
  id: string;
  title: string;
  description: string;
  author: string;
  status: string;
  road_fid: number;
}

interface RoadFeature extends Feature<Geometry, any> {
  properties: {
    fid: number;
    evnk: string;
    ennk: string;
    len: number;
    name: string;
    eemi_grade: { [x: string]: any };
  };
}

const RoadEvaluation = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [center, setCenter] = useState<LatLngExpression | undefined>([50.0549113,10.2393629]); // Default center coordinates
  const [evaluation, setEvaluation] = useState('gw'); // Default evaluation
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoad, setSelectedRoad] = useState<Todo | null>(null);
  const [roadExists, setRoadExistance] = useState(false);

  useEffect(() => {
    const fetchGeojsonData = async () => {
      try {
        const response = await fetch('http://localhost:3000/roads');
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON data');
        }
        const data = await response.json();
        // Calculate center coordinates from GeoJSON data
        const centerCoordinates = calculateCenter(data);
        setGeojsonData(data);
        setCenter(centerCoordinates);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
      }
    };

    fetchGeojsonData();
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const todos = await response.json();
      setTodoList(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleRoadClick = async (road: any) => {
    // had to fetch a fresh list as setTodoList did not refresh todoList for the next call
    const response = await fetch('http://localhost:3000/todos');
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    const todos = await response.json();
    await fetchTodos();

    // Check if the selected road already exists in the todoList
    const existingTodo = todos.find((todo: { road_fid: any; }) => todo.road_fid === road.properties.fid);
    // If the selected road exists in the todoList, set it as the selectedRoad
    if (existingTodo) {
      setRoadExistance(true);
      setSelectedRoad(existingTodo);
    } else {
      // If the selected road doesn't exist in the todoList, create a new todo item
      const newTodoData = {
        id: '', // This will be assigned by the server
        title: road.properties.name,
        description: '',
        status: '',
        author: '',
        road_fid: road.properties.fid,
      };
  
      // Set the new todo data as the selectedRoad
      setSelectedRoad(newTodoData);
      setRoadExistance(false);
    }
  
    // Open the modal
    setModalOpen(true);
  };
  

  const handleSaveTodo = async (todoData: Todo) => {
    try {
      if (roadExists) {
        // Update existing todo
        const response = await fetch(`http://localhost:3000/todos/${selectedRoad?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(todoData),
        });
        if (!response.ok) {
          throw new Error('Failed to update todo');
        }
        const updatedTodo = await response.json();
        const updatedTodoList = todoList.map(todo => (todo.road_fid === selectedRoad?.road_fid ? updatedTodo : todo));
        setTodoList(updatedTodoList);
      } else {
        // Create new todo
        const response = await fetch('http://localhost:3000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(todoData),
        });
        if (!response.ok) {
          throw new Error('Failed to add todo');
        }
        const newTodo = await response.json();
        setTodoList([...todoList, newTodo]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const calculateCenter = (geojsonData: { features: { geometry: any; }[]; }) => {
    // Assuming GeoJSON data is a FeatureCollection with one Feature
    const geometry = geojsonData.features[0].geometry;
    if (geometry.type === 'Point') {
      // For Point geometry, use the coordinates directly
      return geometry.coordinates.reverse(); // Reverse lat and lon for Leaflet
    } else {
      // Calculate center of bounding box
      const bbox = geometry.coordinates.reduce((acc: number[], coord: number[]) => {
        return [
          Math.min(acc[0], coord[0]),
          Math.min(acc[1], coord[1]),
          Math.max(acc[2], coord[0]),
          Math.max(acc[3], coord[1])
        ];
      }, [Infinity, Infinity, -Infinity, -Infinity]);
      const centerLat = (bbox[1] + bbox[3]) / 2;
      const centerLon = (bbox[0] + bbox[2]) / 2;
      return [centerLat, centerLon];
    }
  };

  const getStyle = (feature: GeoJSON.Feature<any, any> | null | undefined) => {
    const eemi = feature?.properties.eemi_grade[evaluation];
    let color = 'blue'; // Default color
    if (eemi >= 1 && eemi < 1.5) {
      color = 'blue';
    } else if (eemi >= 1.5 && eemi < 2.5) {
      color = 'lightgreen';
    } else if (eemi >= 2.5 && eemi < 3.5) {
      color = 'darkgreen';
    } else if (eemi >= 3.5 && eemi < 4.5) {
      color = 'yellow';
    } else if (eemi >= 4.5 && eemi <= 5) {
      color = 'red';
    }
    return { color: color };
  };

  const onDropdownChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    const selectedEvaluation = event.target.value;
    setEvaluation(selectedEvaluation);
  };

  const Legend = () => {
    return (
      <div className="legend grid grid-cols-2 gap-2 m-6">
        <div className="flex items-center ml-6">
            <span className="legend-color bg-blue-500"></span>
            <span className="ml-1 mr-6">Grade 1 - 1.49</span>
        </div>
        <div className="flex items-center">
            <span className="legend-color bg-green-300"></span>
            <span className="ml-1 mr-6">Grade 1.5 - 2.49</span>
        </div>
        <div className="flex items-center">
            <span className="legend-color bg-green-800"></span>
            <span className="ml-1 mr-6">Grade 2.5 - 3.49</span>
        </div>
        <div className="flex items-center">
            <span className="legend-color bg-yellow-500"></span>
            <span className="ml-1 mr-6">Grade 3.5 - 4.49</span>
        </div>
        <div className="flex items-center">
            <span className="legend-color bg-red-500"></span>
            <span className="ml-1">Grade 4.5 - 5.00</span>
        </div>
      </div>
  
    );
  };

  const onEachFeature = (feature: RoadFeature, layer: L.Layer) => {
    // Bind mouseover event
    layer.on({
      mouseover: (event: any) => {
        const layer = event.target;
        layer.setStyle({
          weight: 5,
          color: 'orange',
          dashArray: '',
          fillOpacity: 0.7
        });
        // Show tooltip with attributes and evaluations
        layer.bindTooltip(`
          <div>
            <p>Road ID: ${feature.properties.fid}</p>
            <p>Name: ${feature.properties.name ?? '-'}</p>
            <p>EVNK: ${feature.properties.evnk}</p>
            <p>ENNK: ${feature.properties.ennk}</p>
            <p>EEMI Grade (${evaluation}): ${feature.properties.eemi_grade[evaluation]}</p>
          </div>
        `).openTooltip();
      },
      // Reset style and close tooltip on mouseout
      mouseout: (event: any) => {
        const layer = event.target;
        layer.setStyle({
          weight: 3,
          dashArray: '',
          fillOpacity: 0.5,
          color: getStyle(feature).color
        });
        layer.unbindTooltip();
      },
      click: () => handleRoadClick(feature),
    });
  };

  return (
    <div className="flex">
      <div className="flex flex-col z-30 w-3/5 ml-4">
        <div className="h-80 w-full">

          <div className="flex items-center mt-4 mb-2">
            <label className="mr-4">Select Evaluation: </label>
          <select
            value={evaluation}
            onChange={onDropdownChange}
            className="w-48 p-2 border border-gray-300 rounded mr-4 focus:outline-none focus:ring focus:border-orange-400 appearance-none"
          >
            <option className='p-2 text-sm' value="gw">GW</option>
            <option className='p-2 text-sm' value="twgeb">TWGEB</option>
            <option className='p-2 text-sm' value="twofs">TWOFS</option>
            <option className='p-2 text-sm' value="twrio">TWRIO</option>
            <option className='p-2 text-sm' value="twsub">TWSUB</option>
            <option className='p-2 text-sm' value="tweben">TWEBEN</option>
          </select>

            <div className="flex items-center ml-auto">
                <InformationCircleOutline
                  color={'#e36209'} 
                  title={'Hover on road to see more details.'}
                  height="25px"
                  width="25px"
                />
                <div className="ml-2">
                  <i className='text-sm'>Click on the road to add more information</i>
                </div>
            </div>
          </div>

          <MapContainer
            center={center} // Set center coordinates
            zoom={14} // Set initial zoom level
            className="w-full"
            style={{ height: 'calc(100vh - 240px)' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {geojsonData &&
            <GeoJSON
              data={geojsonData}
              style={getStyle}
              interactive={true}
              onEachFeature={onEachFeature}/>}
          </MapContainer>
          <div className="flex text-right">
            <Legend />
          </div>
        </div>
      </div>

      <div className="w-2/5 flex flex-col justify-center">
        <div className="chart p-4">
          <Statistics showTable={false} />
        </div>
      </div>

      {modalOpen && (
        <div className={`modal-container ${modalOpen ? 'block' : 'hidden'} fixed inset-0 z-50 overflow-auto`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
          <TodoModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveTodo}
            selectedRoad={selectedRoad}
          />
        </div>
      )}
    </div>
  );
};


export default RoadEvaluation;  
