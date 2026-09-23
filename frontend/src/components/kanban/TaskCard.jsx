import { Draggable } from '@hello-pangea/dnd';
import { Bug, Bookmark, Layers, CheckSquare, CheckCircle2, XCircle } from 'lucide-react';
import Avatar from '../common/Avatar';

const TYPE_ICON = { task: CheckSquare, bug: Bug, story: Bookmark, epic: Layers };

const PRIORITY_HEX = {
  lowest: '#6B7280',
  low: '#60A5FA',
  medium: '#F5A524',
  high: '#FB923C',
  highest: '#F87171',
};

export default function TaskCard({ task, index, onClick, onToggleDone }) {
  const TypeIcon = TYPE_ICON[task.type] || CheckSquare;
  const isDone = task.status === 'done';
  const priorityHex = PRIORITY_HEX[task.priority] || PRIORITY_HEX.medium;

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggleDone(task);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`hover-lift group cursor-pointer rounded-md border border-ink-600 bg-ink-800/60 p-3 backdrop-blur-sm transition-shadow ${
            snapshot.isDragging
              ? 'shadow-glow-cyan'
              : 'hover:border-neon-cyan/40 hover:shadow-glow-sm'
          }`}
          style={{
            borderLeftWidth: '3px',
            borderLeftColor: priorityHex,
            ...provided.draggableProps.style,
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-wide text-slate-500 group-hover:text-neon-cyan/80">
              {task.code}
            </span>
            <TypeIcon size={13} className="text-slate-500" />
          </div>
          <p className="mb-3 text-sm leading-snug text-slate-200">{task.title}</p>
          <div className="flex items-center justify-between">
            <button
              onClick={handleToggle}
              title={isDone ? 'Mark as not done' : 'Mark as done'}
              className="transition-transform duration-150 hover:scale-125"
            >
              {isDone ? (
                <CheckCircle2 size={18} className="text-status-done drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
              ) : (
                <XCircle size={18} className="text-status-blocked" />
              )}
            </button>
            {task.assignees?.length > 0 ? (
              <div className="flex -space-x-1.5">
                {task.assignees.slice(0, 3).map((a) => (
                  <Avatar key={a._id} name={a.name} size={22} />
                ))}
              </div>
            ) : (
              <div className="h-[22px] w-[22px] rounded-full border border-dashed border-ink-500" />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
