import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Overview from './Overview';
import RoadEvaluation from './RoadEvaluation';
import TodoList from './TodoList';
import Statistics from './Statistics';

const Main: React.FC = () => (
  <div>
   <Routes>
      <Route path='/' element={<RoadEvaluation />} />
      <Route path='/roads' element={<RoadEvaluation />} />
      <Route path='/overview' element={<Overview />} />
      <Route path='/statistics' element={<Statistics />} />
      <Route path='/todos' element={<TodoList/>}/>
    </Routes>
  </div>
)

export default Main;
