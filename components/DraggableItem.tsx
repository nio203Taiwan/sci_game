import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GameItem } from '../types';
import { ICONS_MAP } from '../constants';

interface Props {
  item: GameItem;
  isShaking?: boolean;
  isOverlay?: boolean;
}

export const DraggableItem: React.FC<Props> = ({ item, isShaking, isOverlay }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const Icon = ICONS_MAP[item.id];

  const style: React.CSSProperties = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isOverlay ? 1000 : 100,
  } : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border-b-4 select-none touch-none
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging && !isOverlay ? 'opacity-0' : 'opacity-100'}
        ${isShaking ? 'animate-shake border-red-500 ring-4 ring-red-100' : 'border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400'}
        ${isOverlay ? 'shadow-2xl scale-110 border-indigo-500 rotate-2 ring-8 ring-indigo-500/10 cursor-grabbing' : ''}
      `}
    >
      {Icon && (
        <div className={`p-2 rounded-xl ${isOverlay ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
          <Icon size={18} />
        </div>
      )}
      <span className="font-black text-slate-700 whitespace-nowrap">{item.label}</span>
    </div>
  );
};