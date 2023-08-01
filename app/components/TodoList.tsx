import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const TodoList = () => {
  const [griddata, setGridData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tasks');
      setGridData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (rowData) => {
    setSelectedItem(rowData);
    setVisible(true);
  };

  const handleEditSubmit = async (updatedItem) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${updatedItem.id}`, updatedItem);
      setVisible(false);
      fetchTasks();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${selectedItem.id}`);
      setVisible(false);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCancelEdit = () => {
    setSelectedItem(null);
    setVisible(false);
  };

  const handleAddNewTask = () => {
    setNewTask({ name: '', description: '' });
    setVisible(true);
  };

  const handleAddNewTaskSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3001/tasks', newTask);
      const addedTask = response.data;
      setGridData((prevData) => [...prevData, addedTask]);
      setVisible(false);
    } catch (error) {
      console.error('Error adding new task:', error);
    }
  };

  const footerContent = (
    <div>
      {selectedItem ? (
        <>
          <Button label="Save" icon="pi pi-save" onClick={ () => handleEditSubmit({ ...selectedItem, name: document.getElementById('name').value, description: document.getElementById('description').value })} />
          <Button label="Cancel" icon="pi pi-times" onClick={handleCancelEdit} />
          <Button label="Delete" icon="pi pi-trash" onClick={handleDelete} />
        </>
      ) : (
        <>
          <Button label="Save" icon="pi pi-save" onClick={handleAddNewTaskSubmit} />
          <Button label="Cancel" icon="pi pi-times" onClick={handleCancelEdit} />
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className="text-center m-5 surface-card p-4 border-round flex align-items-center flex-column justify-content-center">
        <span className="font-medium m-3">To-do list App</span>
        <Button className='w-30rem m-3' label='Add Item to the List' onClick={handleAddNewTask}>
          <i className="pi pi-plus"></i>
        </Button>
      </div>
      <div className="card">
        <DataTable value={griddata}>
          <Column field="name" header="Task Name" />
          <Column field="description" header="Description" />
          <Column
            body={(rowData) => (
              <div>
                <Button label="Edit" icon="pi pi-cog" onClick={() => handleEdit(rowData)} />
              </div>
            )}
          />
        </DataTable>

        {/* Conditional rendering for the edit modal */}
        <Dialog header={selectedItem ? 'Edit Item' : 'Add New Item'} visible={visible} style={{ width: '50vw' }} onHide={handleCancelEdit} footer={footerContent}>
          <form>
            <label htmlFor="name">Task Name: </label>
            <input type="text" id="name" value={selectedItem ? selectedItem.name : newTask.name} onChange={(e) => selectedItem ? setSelectedItem({ ...selectedItem, name: e.target.value }) : setNewTask({ ...newTask, name: e.target.value })} />
            <label htmlFor="description"> Description: </label>
            <input type="text" id="description" value={selectedItem ? selectedItem.description : newTask.description} onChange={(e) => selectedItem ? setSelectedItem({ ...selectedItem, description: e.target.value }) : setNewTask({ ...newTask, description: e.target.value })} />
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default TodoList;
