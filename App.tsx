
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
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

const App: React.FC = () => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [isAllFinished, setIsAllFinished] = useState(false);
  const currentScenario = useMemo(() => SCENARIOS[scenarioIdx], [scenarioIdx]);

  const [itemsMap, setItemsMap] = useState<{ [key: string]: ContainerId }>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({ message: '', type: 'info', show: false });
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    const initial: { [key: string]: ContainerId } = {};
    currentScenario.items.forEach(it => initial[it.id] = 'pool');
    setItemsMap(initial);
    setIsCleared(false);
  }, [currentScenario]);

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
      setFeedback({ message: '正確！觀察入微！🧪', type: 'success', show: true });
    } else {
      setShakingId(itemId);
      const hints: Record<string, string> = {
        manipulated: '這是實驗中唯一的「主角」，我們故意改變它來觀察差異。',
        controlled: '為了公平，這個變因必須「保持一致」不能亂動喔。',
        responding: '這是我們要紀錄的「實驗數據」或最終結果。'
      };
      setFeedback({ message: hints[item.type] || '再想想看，這項因素扮演什麼角色？', type: 'error', show: true });
      setTimeout(() => setShakingId(null), 600);
    }
  };

  useEffect(() => {
    if (Object.keys(itemsMap).length === 0) return;
    const done = currentScenario.items.every(i => itemsMap[i.id] === i.type);
    if (done && !isCleared) setIsCleared(true);
  }, [itemsMap, currentScenario, isCleared]);

  const handleNextStage = () => {
    if (scenarioIdx < SCENARIOS.length - 1) {
      setScenarioIdx(prev => prev + 1);
    } else {
      setIsAllFinished(true);
    }
  };

  const poolItems = currentScenario.items.filter(i => itemsMap[i.id] === 'pool');
  const activeItem = activeId ? currentScenario.items.find(i => i.id === activeId) : null;

  if (isAllFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl border-4 border-indigo-100 p-12 text-center animate-bounce-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-indigo-500 to-purple-500"></div>
          
          <div className="bg-indigo-600 text-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-xl">
            <Award size={56} />
          </div>
          
          <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">恭喜！小小科學家</h1>
          <p className="text-slate-500 text-xl font-medium mb-12">你已經成功掌握了所有實驗變因的邏輯關係！</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {BUCKETS.map(b => (
              <div key={b.id} className={`${b.bgColor} p-6 rounded-3xl border-2 ${b.borderColor} text-left`}>
                <b.icon className={`${b.color} mb-3`} size={32} />
                <h3 className={`text-xl font-black ${b.color} mb-2`}>{b.title}</h3>
                <p className="text-slate-600 text-sm font-bold leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              setScenarioIdx(0);
              setIsAllFinished(false);
            }}
            className="bg-slate-800 text-white px-12 py-4 rounded-full font-black text-lg hover:bg-slate-900 transition-all flex items-center gap-3 mx-auto shadow-xl active:scale-95"
          >
            <RefreshCcw size={22} /> 重新挑戰實驗
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id as string)} onDragEnd={handleDragEnd}>
        
        {/* Navigation */}
        <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
                <FlaskConical className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">變因歸位大作戰</h1>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {SCENARIOS.map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all ${
                    scenarioIdx === i ? 'bg-white shadow-md text-indigo-600 scale-110' : 
                    scenarioIdx > i ? 'bg-green-100 text-green-600' : 'text-slate-400'
                  }`}
                >
                  {scenarioIdx > i ? <CheckCircle2 size={18} /> : i + 1}
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => {
                const initial: { [key: string]: ContainerId } = {};
                currentScenario.items.forEach(it => initial[it.id] = 'pool');
                setItemsMap(initial);
                setIsCleared(false);
              }}
              className="group flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-orange-500 transition-all"
            >
              <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-bold text-sm">重置</span>
            </button>
          </div>
        </nav>

        {/* Workspace */}
        <main className="flex-1 max-w-6xl mx-auto w-full p-6 flex flex-col gap-8">
          
          {/* Scenario Info */}
          <div className="glass-card rounded-[2.5rem] p-10 border-2 border-white shadow-xl flex flex-col md:flex-row items-center gap-10 animate-bounce-in">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] text-white shadow-2xl shadow-indigo-200">
              <BookOpen size={48} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-500 font-black text-sm mb-2 uppercase tracking-widest">
                <Sparkles size={14} /> EXPERIMENT {scenarioIdx + 1}
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">{currentScenario.title}</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">{currentScenario.description}</p>
            </div>
            <div className="bg-amber-50 border-2 border-amber-100 px-8 py-6 rounded-[2rem] self-stretch flex flex-col justify-center text-center max-w-xs">
              <span className="text-amber-600 font-black flex items-center justify-center gap-2 mb-2">
                <Lightbulb size={20} /> 關鍵思考
              </span>
              <p className="text-amber-900 font-bold leading-snug">{currentScenario.question}</p>
            </div>
          </div>

          {/* Draggable Pool Area */}
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] -m-2"></div>
            <div className="bg-white rounded-[3rem] p-12 border-4 border-dashed border-slate-200 min-h-[220px] flex items-center justify-center relative transition-all group-hover:border-indigo-300">
              {isCleared ? (
                <div className="text-center animate-bounce-in">
                  <div className="bg-green-100 text-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-green-50">
                    <Trophy size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-2">太厲害了！</h3>
                  <p className="text-slate-500 font-bold mb-8">所有變項都已經歸位。你展現了嚴謹的科學邏輯！</p>
                  <button 
                    onClick={handleNextStage}
                    className="bg-indigo-600 text-white px-12 py-4 rounded-full font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                  >
                    {scenarioIdx === SCENARIOS.length - 1 ? '觀看最終報告' : '挑戰下一個實驗'} <ChevronRight size={24} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-6 w-full">
                  {poolItems.map(item => (
                    <DraggableItem key={item.id} item={item} isShaking={shakingId === item.id} />
                  ))}
                  {poolItems.length === 0 && !isCleared && (
                    <div className="text-slate-300 font-black text-xl animate-pulse">
                      正在處理數據...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Buckets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {BUCKETS.map(bucket => (
              <Bucket 
                key={bucket.id} 
                bucket={bucket} 
                items={currentScenario.items.filter(i => itemsMap[i.id] === bucket.id)} 
              />
            ))}
          </div>
        </main>

        <footer className="py-8 text-center border-t border-slate-100 text-slate-400 font-bold text-sm tracking-widest">
          SCIENCE INQUIRY LAB &copy; {new Date().getFullYear()}
        </footer>

        <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
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
