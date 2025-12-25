
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
        relative flex items-center gap-4 px-7 py-5 bg-white rounded-3xl border-b-4 select-none touch-none
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging && !isOverlay ? 'opacity-0' : 'opacity-100'}
        ${isShaking ? 'animate-shake border-red-500 ring-8 ring-red-500/10' : 'border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 hover:border-indigo-400'}
        ${isOverlay ? 'shadow-3xl scale-110 border-indigo-500 rotate-3 ring-12 ring-indigo-500/10 cursor-grabbing' : ''}
      `}
    >
      {Icon && (
        <div className={`p-2.5 rounded-2xl ${isOverlay ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
          <Icon size={22} />
        </div>
      )}
      <span className="font-black text-slate-700 text-lg whitespace-nowrap tracking-tight">{item.label}</span>
      
      {/* Decorative dot */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-300"></div>
    </div>
  );
};
