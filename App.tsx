import React, { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';

import { SCENARIOS, BUCKETS } from './constants';
import { ContainerId, Feedback } from './types';
import { DraggableItem } from './components/DraggableItem';
import { Bucket } from './components/Bucket';
import { Toast } from './components/Toast';
import { 
  RefreshCcw, 
  Trophy, 
  FlaskConical, 
  Lightbulb, 
  ChevronRight,
  ClipboardCheck,
  Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState(0);
  const currentScenario = useMemo(() => SCENARIOS[stage], [stage]);
  
  const [itemPositions, setItemPositions] = useState<{ [key: string]: ContainerId }>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({ message: '', type: 'info', show: false });
  const [isCleared, setIsCleared] = useState(false);

  // 初始化場景
  useEffect(() => {
    const initial: { [key: string]: ContainerId } = {};
    currentScenario.items.forEach(it => initial[it.id] = 'pool');
    setItemPositions(initial);
    setIsCleared(false);
  }, [currentScenario]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const itemId = active.id as string;
    const target = over.id as ContainerId;
    const item = currentScenario.items.find(i => i.id === itemId);

    if (!item) return;

    if (item.type === target) {
      setItemPositions(prev => ({ ...prev, [itemId]: target }));
      setFeedback({ message: '歸類正確！繼續加油！', type: 'success', show: true });
    } else {
      setShakingId(itemId);
      const hints: Record<string, string> = {
        manipulated: '不對喔，這是我們「唯一改變」的主角！',
        controlled: '這個必須「保持一致」才公平喔。',
        responding: '這是我們要觀察的「最終結果」。'
      };
      setFeedback({ message: hints[item.type], type: 'error', show: true });
      setTimeout(() => setShakingId(null), 500);
    }
  };

  useEffect(() => {
    if (Object.keys(itemPositions).length === 0) return;
    const allCorrect = currentScenario.items.every(i => itemPositions[i.id] === i.type);
    if (allCorrect && !isCleared) setIsCleared(true);
  }, [itemPositions, currentScenario, isCleared]);

  const poolItems = currentScenario.items.filter(i => itemPositions[i.id] === 'pool');
  const activeItem = activeId ? currentScenario.items.find(i => i.id === activeId) : null;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id as string)} onDragEnd={handleDragEnd}>
        
        {/* Top Header */}
        <header className="max-w-6xl mx-auto w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200">
              <FlaskConical className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">變因歸位大作戰</h1>
              <div className="flex gap-2 mt-1">
                {SCENARIOS.map((_, i) => (
                  <div key={i} className={`h-2 w-8 rounded-full transition-all ${stage >= i ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => {
                const initial: { [key: string]: ContainerId } = {};
                currentScenario.items.forEach(it => initial[it.id] = 'pool');
                setItemPositions(initial);
              }}
              className="bg-white p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all hover:shadow-md active:scale-95"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </header>

        {/* Mission Card */}
        <section className="max-w-6xl mx-auto w-full mb-8 animate-pop">
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border-2 border-white shadow-sm flex items-center gap-6">
            <div className="hidden md:flex bg-amber-100 p-4 rounded-2xl text-amber-600">
              <Zap size={32} />
            </div>
            <div className="flex-1">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-500">當前任務：STAGE {stage + 1}</span>
              <h2 className="text-xl font-black text-slate-800 mt-1">{currentScenario.title}</h2>
              <p className="text-slate-500 font-medium leading-relaxed">{currentScenario.description}</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 px-6 py-4 rounded-2xl">
              <span className="text-xs font-bold text-indigo-400 block mb-1">思考：</span>
              <p className="text-indigo-700 font-black tracking-tight">{currentScenario.question}</p>
            </div>
          </div>
        </section>

        {/* Drag Area */}
        <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 flex-1">
          {BUCKETS.map(bucket => (
            <Bucket 
              key={bucket.id} 
              bucket={bucket} 
              items={currentScenario.items.filter(i => itemPositions[i.id] === bucket.id)} 
            />
          ))}
        </main>

        {/* Item Pool Footer */}
        <footer className="max-w-6xl mx-auto w-full">
          <div className="bg-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ClipboardCheck size={120} className="text-white" />
            </div>
            
            {isCleared ? (
              <div className="text-center py-4 animate-pop">
                <div className="bg-green-400 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Trophy size={32} />
                </div>
                <h3 className="text-2xl font-black text-white">大獲全勝！</h3>
                <button 
                  onClick={() => setStage(prev => (prev + 1) % SCENARIOS.length)}
                  className="mt-6 bg-white text-slate-800 px-10 py-3 rounded-full font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  前往下一場實驗 <ChevronRight size={20} />
                </button>
              </div>
            ) : (
              <div>
                <h4 className="text-slate-400 font-bold mb-6 flex items-center gap-2 tracking-widest">
                  <Lightbulb size={16} /> 待分類變因 (DRAG THESE)
                </h4>
                <div className="flex flex-wrap justify-center gap-4">
                  {poolItems.map(item => (
                    <DraggableItem key={item.id} item={item} isShaking={shakingId === item.id} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </footer>

        <DragOverlay zIndex={1000}>
          {activeItem ? <DraggableItem item={activeItem} isOverlay /> : null}
        </DragOverlay>

        <Toast 
          message={feedback.message} 
          type={feedback.type} 
          show={feedback.show} 
          onClose={() => setFeedback(f => ({ ...f, show: false }))} 
        />
      </DndContext>
    </div>
  );
};

export default App;