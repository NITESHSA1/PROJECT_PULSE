import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { STATUS_DOT } from '../../utils/constants';

const PULSING = ['progress', 'review'];

export default function KanbanColumn({ column, tasks, onTaskClick, onAddTask, onToggleDone }) {
  const dotColor = STATUS_DOT[column.id];
  const shouldPulse = ['in_progress', 'in_review'].includes(column.id);

  return (
    <div className="flex h-full w-72 shrink-0 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {shouldPulse && (
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dotColor} opacity-60`} />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
          </span>
          <span className="font-display text-xs font-medium uppercase tracking-wide text-slate-400">
            {column.label}
          </span>
          <span className="font-mono text-xs text-slate-600">{tasks.length}</span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="rounded px-1.5 text-slate-500 transition-colors hover:bg-ink-800 hover:text-neon-cyan"
          title="Add task"
        >
          +
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 overflow-y-auto rounded-md p-1 scrollbar-thin transition-colors ${
              snapshot.isDraggingOver ? 'bg-neon-cyan/5 ring-1 ring-neon-cyan/20' : ''
            }`}
            style={{ minHeight: 80 }}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onClick={() => onTaskClick(task)}
                onToggleDone={onToggleDone}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
