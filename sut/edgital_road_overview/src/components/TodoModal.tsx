import React, { useState } from 'react';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todoData: any) => void;
  selectedRoad: Todo | null;
}

interface Todo {
  id: string;
  title: string;
  description: string;
  author: string;
  status: string;
  road_fid: number;
}

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onSave, selectedRoad }) => {
  // State variables for form fields
  const [title, setTitle] = useState(selectedRoad ? selectedRoad.title : '');
  const [description, setDescription] = useState(selectedRoad ? selectedRoad.description : '');
  const [status, setStatus] = useState(selectedRoad ? selectedRoad.status : '');
  const [author, setAuthor] = useState(selectedRoad ? selectedRoad.author : '');
  const [roadFid, setRoadFid] = useState(selectedRoad ? selectedRoad.road_fid.toString() : '');

  const handleSave = () => {
    const todoData = {
      title,
      description,
      status,
      author,
      road_fid: parseInt(roadFid)
    };
    onSave(todoData);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'} fixed inset-0 z-50 overflow-auto bg-opacity-75 flex justify-center items-center`}>
      <div className="modal-dialog">
        <div className="modal-content bg-white border border-gray-300 rounded-lg shadow-md w-80 p-4">
          <div className="modal-header py-2 px-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-xl font-semibold">Todo Details</h2>
            <button className="text-gray-500 cursor-pointer" onClick={onClose}>
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className="modal-body py-4 px-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400 mb-2"
              disabled={!!selectedRoad?.title} // Disable input if selectedRoad is provided
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400 mb-2 resize-none"
            />
            <input
              type="text"
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400 mb-2"
            />
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400 mb-2"
            />
            <input
              type="text"
              placeholder="Road Fid"
              value={roadFid}
              onChange={(e) => setRoadFid(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400 mb-2"
              disabled={!!selectedRoad} // Disable input if selectedRoad is provided
            />
          </div>
          <div className={`modal-footer py-2 px-4 rounded-b-lg flex justify-end items-end text-gray-900`}>
            <button className="p-2 text-black rounded-l-md focus:outline-none cursor-pointer" onClick={onClose}>
              Close
            </button>
            <button className="ml-2 p-2 text-white-700 bg-gray-200 rounded-r-md hover:bg-orange-300 focus:outline-none cursor-pointer" onClick={handleSave}>
              {selectedRoad ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;
