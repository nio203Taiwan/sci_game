import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { BucketDef, GameItem } from '../types';
import { DraggableItem } from './DraggableItem';

interface Props {
  bucket: BucketDef;
  items: GameItem[];
}

export const Bucket: React.FC<Props> = ({ bucket, items }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: bucket.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col h-full min-h-[300px] rounded-2xl border-2 transition-all duration-200
        ${bucket.bgColor}
        ${isOver ? 'scale-[1.02] ring-4 ring-opacity-50 ring-indigo-300 border-indigo-500 shadow-xl' : bucket.borderColor}
      `}
    >
      {/* Header */}
      <div className={`p-4 border-b ${bucket.borderColor} bg-white/50 rounded-t-2xl`}>
        <div className="flex items-center gap-2 mb-1">
          <bucket.icon className={`w-6 h-6 ${bucket.color}`} />
          <h2 className={`text-xl font-bold ${bucket.color}`}>{bucket.title}</h2>
        </div>
        <div className="text-sm font-semibold text-slate-600 mb-1">{bucket.subtitle}</div>
        <p className="text-xs text-slate-500 leading-tight">{bucket.description}</p>
      </div>

      {/* Drop Area Content */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {items.length === 0 && !isOver && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-slate-400/50">
              <div className="text-4xl mb-2 font-bold opacity-20">?</div>
              <span className="text-sm">拖曳卡片到這裡</span>
            </div>
          </div>
        )}
        
        {items.map((item) => (
          <div key={item.id} className="animate-pop">
            {/* We disable dragging once it's in the correct bucket (optional choice, but makes game cleaner) */}
             <div className="relative flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-green-200/50">
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm">
                  ✓
                </div>
                <span className="font-bold text-slate-700">{item.label}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};