import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GameItem } from '../types';
import { ICONS_MAP } from '../constants';
import { GripVertical } from 'lucide-react';

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
  } : {};

  // If it's the overlay, we want to force visible styles
  // If it's the original item being dragged, we fade it out
  const opacity = isDragging && !isOverlay ? 0.3 : 1;
  const cursor = isOverlay ? 'grabbing' : 'grab';
  
  return (
    <div
      ref={setNodeRef}
      style={{ ...style, opacity, cursor }}
      {...listeners}
      {...attributes}
      className={`
        relative group flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200 
        transition-colors hover:border-slate-400 hover:shadow-md touch-none select-none
        ${isShaking ? 'animate-shake ring-2 ring-red-400' : ''}
        ${isOverlay ? 'ring-2 ring-indigo-500 shadow-xl scale-105 rotate-2 z-50' : ''}
      `}
    >
      <div className="text-slate-400">
        <GripVertical size={20} />
      </div>
      
      {Icon && (
        <div className={`p-2 rounded-lg bg-slate-100 text-slate-600`}>
          <Icon size={20} />
        </div>
      )}
      
      <span className="font-bold text-slate-700 text-lg">{item.label}</span>
      
      {/* Decorative dot */}
      <div className="ml-auto w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
    </div>
  );
};