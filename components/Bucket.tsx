import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { BucketDef, GameItem } from '../types';

interface Props {
  bucket: BucketDef;
  items: GameItem[];
}

export const Bucket: React.FC<Props> = ({ bucket, items }) => {
  const { setNodeRef, isOver } = useDroppable({ id: bucket.id });

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col h-full min-h-[380px] rounded-[2.5rem] border-4 transition-all duration-300 relative overflow-hidden
        ${bucket.bgColor}
        ${isOver ? 'scale-[1.05] border-indigo-400 shadow-2xl ring-8 ring-indigo-500/10 z-10' : bucket.borderColor + ' shadow-sm'}
      `}
    >
      {/* Decorative Label */}
      <div className={`absolute top-4 right-6 opacity-10 pointer-events-none`}>
        <bucket.icon size={80} />
      </div>

      {/* Header */}
      <div className={`p-8 border-b-2 bg-white/50 backdrop-blur-sm ${bucket.borderColor}`}>
        <div className="flex items-center gap-4 mb-3">
          <div className={`p-3 rounded-2xl bg-white shadow-sm ${bucket.color}`}>
            <bucket.icon size={28} />
          </div>
          <h2 className={`text-2xl font-black ${bucket.color}`}>{bucket.title}</h2>
        </div>
        <p className="text-sm font-bold text-slate-500 leading-relaxed opacity-80">{bucket.description}</p>
      </div>

      {/* Drop Zone */}
      <div className="flex-1 p-6 flex flex-col gap-4 relative z-10">
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-white/40 rounded-3xl opacity-30">
            <div className="w-12 h-12 rounded-full border-4 border-current mb-3 flex items-center justify-center font-black text-xl">?</div>
            <span className="text-sm font-black tracking-widest uppercase">等待歸位</span>
          </div>
        )}
        
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white px-6 py-5 rounded-2xl shadow-md border-b-2 border-slate-100 flex items-center justify-between group animate-pop"
          >
            <span className="font-black text-slate-700">{item.label}</span>
            <div className="bg-green-100 text-green-600 p-1.5 rounded-full shadow-inner animate-bounce">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};