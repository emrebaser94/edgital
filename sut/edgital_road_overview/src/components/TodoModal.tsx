import React, { useEffect, useState } from 'react';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** `existingId` is null when a new Todo should be created. */
  onSave: (todoData: any, existingId: string | number | null) => void;
  /** Every Todo already stored for the clicked road. */
  todos: Todo[];
  /** Blank Todo for the clicked road, pre-filled with the road name. */
  newTodo: Todo;
}

interface Todo {
  id: string;
  title: string;
  description: string;
  author: string;
  status: string;
  road_fid: number;
}

/** Index used while a new Todo is being entered. */
const NEW_TODO = -1;

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onSave, todos, newTodo }) => {
  // A road can carry several Todos, so the form pages through them; -1 means "new Todo".
  const [index, setIndex] = useState(todos.length > 0 ? 0 : NEW_TODO);
  const current = index === NEW_TODO ? newTodo : todos[index];
  const isExistingTodo = index !== NEW_TODO;

  // State variables for form fields
  const [title, setTitle] = useState(current?.title ?? '');
  const [description, setDescription] = useState(current?.description ?? '');
  const [status, setStatus] = useState(current?.status ?? '');
  const [author, setAuthor] = useState(current?.author ?? '');
  const [roadFid, setRoadFid] = useState(current ? String(current.road_fid) : '');

  // Show the fields of the Todo that is currently paged to.
  useEffect(() => {
    setTitle(current?.title ?? '');
    setDescription(current?.description ?? '');
    setStatus(current?.status ?? '');
    setAuthor(current?.author ?? '');
    setRoadFid(current ? String(current.road_fid) : '');
  }, [index, current]);

  const handleSave = () => {
    const todoData = {
      title,
      description,
      status,
      author,
      road_fid: parseInt(roadFid)
    };
    onSave(todoData, isExistingTodo ? current.id : null);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'} fixed inset-0 z-50 overflow-auto bg-opacity-75 flex justify-center items-center`}>
      <div className="modal-dialog">
        <div className="modal-content bg-white border border-gray-300 rounded-lg shadow-md w-80 p-4">
          <div className="modal-header py-2 px-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-xl font-semibold">Todo Details</h2>
            <div className="flex items-center">
              {isExistingTodo && (
                <div className="flex items-center mr-4">
                  <button
                    className="px-2 text-gray-500 focus:outline-none cursor-pointer disabled:text-gray-300"
                    aria-label="Previous todo"
                    onClick={() => setIndex(index - 1)}
                    disabled={index === 0}
                  >
                    &lsaquo;
                  </button>
                  <span className="todo-counter text-sm">{index + 1} / {todos.length}</span>
                  <button
                    className="px-2 text-gray-500 focus:outline-none cursor-pointer disabled:text-gray-300"
                    aria-label="Next todo"
                    onClick={() => setIndex(index + 1)}
                    disabled={index === todos.length - 1}
                  >
                    &rsaquo;
                  </button>
                </div>
              )}
              <button className="text-gray-500 cursor-pointer" onClick={onClose}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>
          </div>
          <div className="modal-body py-4 px-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-400 mb-2"
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
              disabled // the road is chosen by clicking it on the map
            />
          </div>
          <div className={`modal-footer py-2 px-4 rounded-b-lg flex justify-between items-end text-gray-900`}>
            <div>
              {isExistingTodo && (
                <button
                  className="p-2 text-black rounded-md focus:outline-none cursor-pointer"
                  aria-label="New todo"
                  onClick={() => setIndex(NEW_TODO)}
                >
                  New Todo
                </button>
              )}
            </div>
            <div className="flex items-end">
              <button className="p-2 text-black rounded-l-md focus:outline-none cursor-pointer" onClick={onClose}>
                Close
              </button>
              <button className="ml-2 p-2 text-white-700 bg-gray-200 rounded-r-md hover:bg-orange-300 focus:outline-none cursor-pointer" onClick={handleSave} disabled={!title.trim()}>
                {isExistingTodo ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;
