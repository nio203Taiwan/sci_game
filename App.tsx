
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
import { ContainerId, Feedback, GameItem } from './types';
import { DraggableItem } from './components/DraggableItem';
import { Bucket } from './components/Bucket';
import { Toast } from './components/Toast';
import { 
  RefreshCcw, 
  Trophy, 
  FlaskConical, 
  Lightbulb, 
  ChevronRight,
  ClipboardList,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const currentScenario = useMemo(() => SCENARIOS[scenarioIdx], [scenarioIdx]);

  const [itemsMap, setItemsMap] = useState<{ [key: string]: ContainerId }>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({ message: '', type: 'info', show: false });
  const [isFinished, setIsFinished] = useState(false);

  // 初始化或切換關卡
  useEffect(() => {
    const initial: { [key: string]: ContainerId } = {};
    currentScenario.items.forEach(it => initial[it.id] = 'pool');
    setItemsMap(initial);
    setIsCleared(false);
    setFeedback({ message: `準備開始：${currentScenario.title}`, type: 'info', show: true });
  }, [currentScenario]);

  const [isCleared, setIsCleared] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const itemId = active.id as string;
    const target = over.id as ContainerId;
    const item = currentScenario.items.find(i => i.id === itemId);

    if (!item) return;

    if (item.type === target) {
      setItemsMap(prev => ({ ...prev, [itemId]: target }));
      setFeedback({ message: '精確歸位！科學家魂爆發！🧪', type: 'success', show: true });
    } else {
      setShakingId(itemId);
      const hints: Record<string, string> = {
        manipulated: '不對喔！它是實驗中唯一被改變的「主角」。',
        controlled: '為了公平，這個變因必須保持「固定不變」。',
        responding: '這是我們最後要測量或觀察的「實驗結果」。'
      };
      setFeedback({ message: hints[item.type] || '再試一次，邏輯就在細節中！', type: 'error', show: true });
      setTimeout(() => setShakingId(null), 600);
    }
  };

  useEffect(() => {
    if (Object.keys(itemsMap).length === 0) return;
    const done = currentScenario.items.every(i => itemsMap[i.id] === i.type);
    if (done && !isCleared) setIsCleared(true);
  }, [itemsMap, currentScenario, isCleared]);

  const poolItems = currentScenario.items.filter(i => itemsMap[i.id] === 'pool');
  const activeItem = activeId ? currentScenario.items.find(i => i.id === activeId) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id as string)} onDragEnd={handleDragEnd}>
        
        {/* Navigation / Header */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                <FlaskConical className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">變因歸位大作戰</h1>
            </div>

            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl">
              {SCENARIOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setScenarioIdx(i)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
                    scenarioIdx === i ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  第 {i + 1} 關
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => {
                const initial: { [key: string]: ContainerId } = {};
                currentScenario.items.forEach(it => initial[it.id] = 'pool');
                setItemsMap(initial);
                setIsCleared(false);
              }}
              className="p-2.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
              title="重置本關"
            >
              <RefreshCcw size={20} />
            </button>
          </div>
        </nav>

        {/* Main Workspace */}
        <main className="flex-1 max-w-6xl mx-auto w-full p-6 flex flex-col gap-8">
          
          {/* Scenario Info */}
          <div className="glass-card rounded-[2rem] p-8 border-2 border-white shadow-xl flex flex-col md:flex-row items-center gap-8 animate-bounce-in">
            <div className="bg-indigo-50 p-6 rounded-3xl text-indigo-600 flex-shrink-0">
              <ClipboardList size={48} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-500 font-black text-sm mb-1 uppercase tracking-widest">
                <Sparkles size={14} /> 實驗任務
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">{currentScenario.title}</h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{currentScenario.description}</p>
            </div>
            <div className="bg-amber-50 border-2 border-amber-100 px-6 py-4 rounded-3xl self-stretch flex flex-col justify-center text-center">
              <span className="text-amber-600 font-black flex items-center justify-center gap-2 mb-1">
                <Lightbulb size={18} /> 思考提問
              </span>
              <p className="text-amber-800 font-bold">{currentScenario.question}</p>
            </div>
          </div>

          {/* Draggable Pool */}
          <div className="bg-slate-200/50 rounded-[2.5rem] p-10 border-4 border-dashed border-slate-300 min-h-[160px] flex items-center justify-center">
            {isCleared ? (
              <div className="text-center animate-bounce-in py-4">
                <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Trophy size={40} />
                </div>
                <h3 className="text-3xl font-black text-slate-800">恭喜完成這項研究！</h3>
                <p className="text-slate-500 font-bold mt-2">你精確地掌握了所有變因的關係。</p>
                <button 
                  onClick={() => setScenarioIdx(prev => (prev + 1) % SCENARIOS.length)}
                  className="mt-6 bg-indigo-600 text-white px-10 py-3.5 rounded-full font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  前往下個實驗 <ChevronRight size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-5 w-full">
                {poolItems.map(item => (
                  <DraggableItem key={item.id} item={item} isShaking={shakingId === item.id} />
                ))}
              </div>
            )}
          </div>

          {/* Buckets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {BUCKETS.map(bucket => (
              <Bucket 
                key={bucket.id} 
                bucket={bucket} 
                items={currentScenario.items.filter(i => itemsMap[i.id] === bucket.id)} 
              />
            ))}
          </div>
        </main>

        <DragOverlay>
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
