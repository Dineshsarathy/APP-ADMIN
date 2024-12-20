import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskReportForm = ({ taskReportToEdit, onSave }) => {
  const [templateId, setTemplateId] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [bugId, setBugId] = useState('');
  const [summary, setSummary] = useState('');
  const [priority, setPriority] = useState('Low');
  const [severity, setSeverity] = useState('Minor');
  const [status, setStatus] = useState('Pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [assignedDueDate, setAssignedDueDate] = useState('');
  const [completedDate, setCompletedDate] = useState('');

  useEffect(() => {
    if (taskReportToEdit) {
      // If editing, pre-fill form with task report data
      setTemplateId(taskReportToEdit.Template_ID);
      setTemplateName(taskReportToEdit.Template_Name);
      setBugId(taskReportToEdit.Bug_ID);
      setSummary(taskReportToEdit.Summary);
      setPriority(taskReportToEdit.Priority);
      setSeverity(taskReportToEdit.Severity);
      setStatus(taskReportToEdit.Status);
      setAssignedTo(taskReportToEdit.Assigned_To);
      setAssignedDate(taskReportToEdit.Assigned_Date);
      setAssignedDueDate(taskReportToEdit.Assigned_Due_Date);
      setCompletedDate(taskReportToEdit.Completed_Date);
    }
  }, [taskReportToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTaskReport = {
      Template_ID: templateId,
      Template_Name: templateName,
      Bug_ID: bugId,
      Summary: summary,
      Priority: priority,
      Severity: severity,
      Status: status,
      Assigned_To: assignedTo,
      Assigned_Date: new Date(assignedDate),
      Assigned_Due_Date: new Date(assignedDueDate),
      Completed_Date: completedDate ? new Date(completedDate) : null,
    };

    // Save the task report (add or edit based on if taskReportToEdit exists)
    if (taskReportToEdit) {
      axios
        .put(`http://localhost:8000/api/taskreports/${taskReportToEdit._id}`, newTaskReport)
        .then((response) => onSave(response.data))
        .catch((error) => console.error('Error updating task report:', error));
    } else {
      axios
        .post('http://localhost:8000/api/taskreports', newTaskReport)
        .then((response) => onSave(response.data))
        .catch((error) => console.error('Error creating task report:', error));
    }
  };

  return (
    <div>
      <h2>{taskReportToEdit ? 'Edit' : 'Create'} Task Report</h2>
      <form onSubmit={handleSubmit}>
        <label>Template ID</label>
        <input
          type="text"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          required
        />
        <br />
        <label>Template Name</label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          required
        />
        <br />
        <label>Bug ID</label>
        <input
          type="text"
          value={bugId}
          onChange={(e) => setBugId(e.target.value)}
          required
        />
        <br />
        <label>Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        ></textarea>
        <br />
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <br />
        <label>Severity</label>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} required>
          <option value="Minor">Minor</option>
          <option value="Major">Major</option>
          <option value="Critical">Critical</option>
        </select>
        <br />
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Delayed">Delayed</option>
        </select>
        <br />
        <label>Assigned To</label>
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        />
        <br />
        <label>Assigned Date</label>
        <input
          type="date"
          value={assignedDate}
          onChange={(e) => setAssignedDate(e.target.value)}
          required
        />
        <br />
        <label>Assigned Due Date</label>
        <input
          type="date"
          value={assignedDueDate}
          onChange={(e) => setAssignedDueDate(e.target.value)}
          required
        />
        <br />
        <label>Completed Date</label>
        <input
          type="date"
          value={completedDate}
          onChange={(e) => setCompletedDate(e.target.value)}
        />
        <br />
        <button type="submit">{taskReportToEdit ? 'Save Changes' : 'Create Task Report'}</button>
      </form>
    </div>
  );
};

export default TaskReportForm;
