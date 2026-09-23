import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import * as taskApi from '../../api/taskApi';
import KanbanColumn from '../../components/kanban/KanbanColumn';
import TaskDetailModal from '../../components/task/TaskDetailModal';
import CreateTaskModal from '../../components/task/CreateTaskModal';
import Spinner from '../../components/common/Spinner';
import { STATUS_COLUMNS } from '../../utils/constants';

export default function BoardPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [createModal, setCreateModal] = useState({ open: false, status: 'backlog' });

  const load = useCallback(() => {
    setLoading(true);
    taskApi
      .getTasks(projectId, { limit: 200, sort: 'order' })
      .then((res) => setTasks(res.data.tasks))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(load, [load]);

  const tasksByStatus = (statusId) =>
    tasks.filter((t) => t.status === statusId).sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI update
    const newStatus = destination.droppableId;
    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus, order: destination.index } : t))
    );

    try {
      await taskApi.updateTaskStatus(projectId, draggableId, {
        status: newStatus,
        order: destination.index,
      });
    } catch {
      load(); // revert to server state on failure
    }
  };

  const handleTaskCreated = (task) => setTasks((prev) => [...prev, task]);

  const handleTaskUpdated = (updated) =>
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  const handleTaskDeleted = (taskId) => setTasks((prev) => prev.filter((t) => t._id !== taskId));

  const handleToggleDone = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';

    // Optimistic UI update
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));

    try {
      await taskApi.updateTaskStatus(projectId, task._id, { status: newStatus });
    } catch {
      load(); // revert to server state on failure
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden p-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex h-full gap-4 overflow-x-auto scrollbar-thin">
          {STATUS_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus(column.id)}
              onTaskClick={(task) => setSelectedTaskId(task._id)}
              onAddTask={(statusId) => setCreateModal({ open: true, status: statusId })}
              onToggleDone={handleToggleDone}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onUpdated={handleTaskUpdated}
        onDeleted={handleTaskDeleted}
      />

      <CreateTaskModal
        isOpen={createModal.open}
        initialStatus={createModal.status}
        onClose={() => setCreateModal({ open: false, status: 'backlog' })}
        onCreated={handleTaskCreated}
      />
    </div>
  );
}
