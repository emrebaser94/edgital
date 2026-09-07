import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { CloseOutline, CreateOutline, SaveOutline, TrashOutline } from 'react-ionicons'

interface Todo {
  id: string;
  title: string;
  description: string;
  author: string;
  status: string;
  road_fid: number;
}

const TodoList = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [todosPerPage] = useState(8);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<Todo | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Todo[]>("http://localhost:3000/todos");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/todos/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEdit = (id: string) => {
    setEditingItemId(id);
    const itemToEdit = data.find((item) => item.id === id);
    if (itemToEdit) {
      setEditedItem({ ...itemToEdit });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3000/todos/${editedItem?.id}`, editedItem);
      setEditingItemId(null);
      setEditedItem(null);
      fetchData();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleCancel = () => {
    setEditingItemId(null);
    setEditedItem(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem!,
      [name]: value,
    }));
  };

  const offset = currentPage * todosPerPage;
  const currentTodos = data.slice(offset, offset + todosPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentTodos.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">{editingItemId === item.id ? <input type="text" name="title" value={editedItem?.title} onChange={handleInputChange} className="w-full border border-gray-400 rounded px-2 py-1" /> : item.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{editingItemId === item.id ? <input type="text" name="description" value={editedItem?.description} onChange={handleInputChange} className="w-full border border-gray-400 rounded px-2 py-1" /> : item.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">{editingItemId === item.id ? <input type="text" name="author" value={editedItem?.author} onChange={handleInputChange} className="w-full border border-gray-400 rounded px-2 py-1" /> : item.author}</td>
              <td className="px-6 py-4 whitespace-nowrap">{editingItemId === item.id ? <input type="text" name="status" value={editedItem?.status} onChange={handleInputChange} className="w-full border border-gray-400 rounded px-2 py-1" /> : item.status}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingItemId === item.id ? (
                  <div className="flex items-center cursor-pointer">
                    <SaveOutline
                      color={'#e36209'} 
                      title={'Save'}
                      height="25px"
                      width="25px"
                      onClick={handleSave}
                    />
                    <CloseOutline
                      color={'#e36209'} 
                      title={'Cancel'}
                      height="25px"
                      width="25px"
                      onClick={handleCancel}
                    />
                  </div>
                ) : (
                  <div className="flex items-center cursor-pointer">
                    <CreateOutline
                      color={'#e36209'} 
                      title={'Edit'}
                      height="25px"
                      width="25px"
                      onClick={() => handleEdit(item.id)}
                    />
                    <TrashOutline
                      color={'#e36209'} 
                      title={'Delete'}
                      height="25px"
                      width="25px"
                      onClick={() => handleDelete(item.id)}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={Math.ceil(data.length / todosPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default TodoList;
