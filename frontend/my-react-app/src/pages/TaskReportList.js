import Header from "../components/Header";
import SideBar from "../components/SideBar";
import React, { useState, useEffect, useCallback } from "react";
import { FaPen, FaTrashAlt } from "react-icons/fa"; // Importing icons
import { format } from 'date-fns'; // Importing date-fns for date formatting
import axios from "axios";
import Popup from "reactjs-popup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react/dist/iconify.js";

// Format date function
const formatDate = (date) => {
  return format(new Date(date), "MM/dd/yyyy"); // Formatting date to MM/DD/YYYY
};

const StylishTable = ({ data, columns, handleEdit, handleDelete }) => {
  // State to track the sorting option
  const [sortOption, setSortOption] = useState({
    column: "templateName", // Default sorting column
    direction: "asc", // Default direction is ascending
  });

  // Handle sorting when a column header is clicked
  const handleSort = (column) => {
    setSortOption((prev) => {
      const newDirection =
        prev.column === column && prev.direction === "asc" ? "desc" : "asc";
      return { column, direction: newDirection };
    });
  };

  // Sort data based on the current sort option
  const sortedData = [...data].sort((a, b) => {
    const { column, direction } = sortOption;
    if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
    if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.accessor}
              onClick={() => col.accessor !== "actions" && handleSort(col.accessor)} // Handle sort for all except 'actions'
              style={{ cursor: col.accessor !== "actions" ? "pointer" : "default" }}
            >
              
              <div style={{ display: "inline-flex", alignItems: "center"}}>
                {col.header}
                {col.accessor !== "actions" && (
                  <span style={{ marginLeft: "5px" ,fontSize: "14px", display:"flex",flexDirection:"row"}}>
                    {sortOption.column === col.accessor ? (
                      sortOption.direction === "asc" ? (
                        <span>&#9650;</span> // Up arrow ▲
                      ) : (
                        <span>&#9660;</span> // Down arrow ▼
                      )
                    ) : (
                      <span style={{ color: "#ccc" }}>&#9650; &#9660;</span> // Neutral arrows
                    )}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>No data found</td>
          </tr>
        ) : (
          sortedData.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {col.accessor === "actions" ? (
                    <div className="action-buttons">
                      <button
                        className="edit"
                        style={{ backgroundColor: "rgb(9, 134, 9)" }}
                        onClick={() => handleEdit(row)}
                      >
                        <FaPen className="icon" style={{ fontSize: "14px", margin: 0 }} />
                      </button>
                      <button
                        className="delete"
                        style={{ backgroundColor: "red" }}
                        onClick={() => handleDelete(row)}
                      >
                        <FaTrashAlt className="icon" style={{ fontSize: "14px" }} />
                      </button>
                    </div>
                  ) : (
                    <span>
                      {col.accessor === "Status"
                        ? row[col.accessor]
                          ? "Completed"
                          : "Pending"
                        : col.accessor === "Assigned_Date" || col.accessor === "Completed_Date"
                        ? formatDate(row[col.accessor])
                        : row[col.accessor]}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange,sortOption, onSortChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <span>
        {currentPage} of {totalPages}
      </span>
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default function TaskReportList() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("alphabetic");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [newTask, setNewTask] = useState({
      Template_ID: '',
      Template_Name: '',
      Bug_ID: '',
      Summary: '',
      Priority: 'Low',
      Severity: 'Minor',
      Assigned_To: '',
      Assigned_Date: new Date().toISOString().split('T')[0], // Default to today
      Assigned_Due_Date: '', // Empty by default; you can set a default if needed
    });

  // Generate a unique Bug ID
  const generateTemplateID = () => `T-${Date.now()}`;

  const generateBugID = () => `B-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleAddTask = async (e) => {

     // Validate required fields
  if (!newTask.Template_Name) {
    toast.error('Template Name is required!');
    return;
  }
  if (!newTask.Assigned_To) {
    toast.error('Assigned To is required!');
    return;
  }
    e.preventDefault();
    const task = {
      ...newTask,
      Template_ID: generateTemplateID(),
      Bug_ID: generateBugID(),
    };
    console.log("Task Payload:", task); // Log the payload

    try {
      await axios.post('http://localhost:8000/api/taskreports', task);
      toast.success('Task added successfully!');
      fetchData();
      setNewTask({
        Template_ID: '',
        Template_Name: '',
        Bug_ID: '',
        Summary: '',
        Priority: 'Low',
        Severity: 'Minor',
        Assigned_To: '',
        Assigned_Date: new Date().toISOString().split('T')[0],
        Assigned_Due_Date: '',
      });
    } catch (error) {
      console.error('Error adding task:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to add task.');
    }
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/taskreports");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const filteredData = data.filter((task) =>
      Object.values(task).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSortedData(filteredData);
  }, [searchTerm, data]);

  useEffect(() => {
    const sorted = [...data];
    if (sortOption === "alphabetic") {
      sorted.sort((a, b) => (a.Template_Name || "").localeCompare(b.Template_Name || ""));
    } else if (sortOption === "reverse-alphabetic") {
      sorted.sort((a, b) => (b.Template_Name || "").localeCompare(a.Template_Name || ""));
    }
    setSortedData(sorted);
  }, [sortOption, data]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditPopupOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/taskreports/${editingTask._id}`, editingTask);
      toast.success("Task updated successfully!");
      setIsEditPopupOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete ${task.Template_Name}?`)) {
      try {
        await axios.delete(`http://localhost:8000/api/taskreports/${task._id}`);
        toast.success(`${task.Template_Name} deleted successfully!`);
        fetchData();
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task.");
      }
    }
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Update items per page
    setCurrentPage(1); // Reset to the first page
  };

  const columns = [
    { header: "Template Id", accessor: "Template_ID" },
    { header: "Template Name", accessor: "Template_Name" },
    { header: "Bug ID", accessor: "Bug_ID" },
    { header: "Summary", accessor: "Summary" },
    { header: "Priority", accessor: "Priority" },
    { header: "Severity", accessor: "Severity" },
    { header: "Status", accessor: "Status" },
    { header: "Assigned To", accessor: "Assigned_To" },
    { header: "Actions", accessor: "actions" },
  ];

  return (
    <>
      <SideBar isCollapsed={isCollapsed} />
      <div className={`Tasklist ${isCollapsed ? "Task-collapsed" : ""}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="task-report-list">
          <ToastContainer />
          <h2>Task Report List</h2>
          <div className="table-props">
              <input
                className="search"
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              />
              <div className="filter">
                        <label><Icon className="filter-icon" icon="stash:filter-light" style={{ fontSize: '28px', }}/><span>No of  items :</span></label>
                        {/* <select id="filterDropdown"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}>
                          <option value="alphabetic">Alphabetical Order (A-Z)</option>
                          <option value="reverse-alphabetic">Alphabetical Order (Z-A)</option>
                        </select> */}
                    </div>
                <div className="items-per-page">
                    <label>
                      <select  id="filterDropdown" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                      </select>
                    </label>
            </div>
            <Popup
        trigger={
          <button className="button-add">
            <Icon icon="carbon:add-alt" style={{ fontSize: "23px" }} />
            <span>Add New</span>
          </button>
        }
        modal
        contentStyle={{ padding: '20px', borderRadius: '8px', width: '400px' }}
      >
        {(close) => (
          <div>
            <h2>Add New Task</h2>
            <form onSubmit={(e) => { handleAddTask(e); close(); }}>
              <div>
                <label>Template Name:</label>
                <input
                  type="text"
                  value={newTask.Template_Name}
                  onChange={(e) => setNewTask({ ...newTask, Template_Name: e.target.value })}
                  required
                  placeholder="Enter Template Name"
                />
              </div>
              <div>
                <label>Summary:</label>
                <input
                  value={newTask.Summary}
                  onChange={(e) => setNewTask({ ...newTask, Summary: e.target.value })}
                  required
                  placeholder="Enter Summary"
                />
              </div>
              <div>
                <label>Priority:</label>
                <select
                  value={newTask.Priority}
                  onChange={(e) => setNewTask({ ...newTask, Priority: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label>Severity:</label>
                <select
                  value={newTask.Severity}
                  onChange={(e) => setNewTask({ ...newTask, Severity: e.target.value })}
                >
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label>Assigned To:</label>
                <input
                  type="text"
                  value={newTask.Assigned_To}
                  onChange={(e) => setNewTask({ ...newTask, Assigned_To: e.target.value })}
                  required
                  placeholder="Enter Assignee"
                />
                <label htmlFor="Assigned_Due_Date">Assigned Due Date</label>
                <input
                  type="date"
                  id="Assigned_Due_Date"
                  value={newTask.Assigned_Due_Date}
                  onChange={(e) => setNewTask({ ...newTask, Assigned_Due_Date: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <button
                            type="submit"
                            style={{
                              backgroundColor: '#28a745',
                              color: '#fff',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '30%',
                            }}
                          >
                            Add task
                          </button>
                          <button
                            type="button"
                            onClick={close}
                            style={{
                              backgroundColor: '#dc3545',
                              color: '#fff',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '30%',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
        )}
      </Popup>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <StylishTable
                data={paginatedData}
                columns={columns}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          {isEditPopupOpen && (
            <Popup open={isEditPopupOpen} onClose={() => setIsEditPopupOpen(false)} modal>
              <form onSubmit={handleSave}>
                <h3>Edit Task</h3>
                <label>Template Name:</label>
                <input
                  type="text"
                  value={editingTask?.Template_Name}
                  onChange={(e) => setEditingTask({ ...editingTask, Template_Name: e.target.value })}
                  placeholder="Template Name"
                  required
                />
                <label>Summary:</label>
                <input
                  type="text"
                  value={editingTask?.Summary}
                  onChange={(e) => setEditingTask({ ...editingTask, Summary: e.target.value })}
                  placeholder="Summary"
                  required
                />
                <label>Assigned To:</label>
                <input
                  type="text"
                  value={editingTask?.Assigned_To}
                  onChange={(e) => setEditingTask({ ...editingTask, Assigned_To: e.target.value })}
                  placeholder="Assigned To"
                  required
                />
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{
                              backgroundColor: '#28a745',
                              color: '#fff',
                              padding: '10px 20px',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              width: '80px',
                            }}>Save</button>
                <button type="button" onClick={() => setIsEditPopupOpen(false)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '80px',
                  }}>
                  Cancel
                </button>
              </div>
              </form>
            </Popup>
          )}
        </div>
      </div>
    </>
  );
}
