import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import 'primereact/resources/primereact.min.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import { v4 as uuidv4 } from 'uuid'

const TodoList = () => {
  const [griddata, setGridData] = useState(() => {
    const localData = localStorage.getItem('tasks');
    return localData ? JSON.parse(localData) : [];
  });
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(griddata));
  }, [griddata]);

  const handleEdit = (rowData) => {
    setSelectedItem(rowData);
    setVisible(true);
  };

  const handleEditSubmit = (updatedItem) => {
    setGridData(prevData => prevData.map(item => item.id === updatedItem.id ? updatedItem : item));
    setVisible(false);
    setSelectedItem(null);
  };

  const handleDelete = () => {
    setGridData(prevData => prevData.filter(item => item.id !== selectedItem.id));
    setVisible(false);
    setSelectedItem(null);
  };

  const handleCancelEdit = () => {
    setSelectedItem(null);
    setNewTask({ name: '', description: '' });
    setVisible(false);
  };

  const handleAddNewTask = () => {
    setNewTask({ name: '', description: '' });
    setVisible(true);
  };

  const handleAddNewTaskSubmit = () => {
    setGridData(prevData => [...prevData, { ...newTask, id: uuidv4() }]);
    setVisible(false);
  };

  const footerContent = (
    <div>
      {selectedItem ? (
        <>
          <Button label="Save" icon="pi pi-save" onClick={() => handleEditSubmit({ ...selectedItem, name: document.getElementById('name').value, description: document.getElementById('description').value })} />
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
    <div className="p-grid p-justify-center">
      <div className="text-center m-5 surface-card p-4 border-round flex flex-column align-items-center justify-content-center">
        <span className="font-medium m-3">To-do list App</span>
          <Button className='custom-button m-3' label='Add Item to the List' onClick={handleAddNewTask}>
          <i className="pi pi-plus"></i>
          </Button>
      </div>
      <div className="p-col-12 p-md-10 p-lg-8 card">
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
