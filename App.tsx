import React, { useState, useEffect } from 'react';
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
import { GameItem, ContainerId, Feedback, ScenarioDef } from './types';
import { DraggableItem } from './components/DraggableItem';
import { Bucket } from './components/Bucket';
import { Toast } from './components/Toast';
import { RefreshCw, Trophy, ChevronDown, FlaskConical } from 'lucide-react';

// Main App Component
const App: React.FC = () => {
  // --- State ---
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  
  // Initialize items based on current scenario
  const getCurrentItemsState = (scenario: ScenarioDef) => {
    const initialState: { [key: string]: ContainerId } = {};
    scenario.items.forEach(item => {
      initialState[item.id] = 'pool';
    });
    return initialState;
  };

  const currentScenario = SCENARIOS[currentScenarioIndex];

  const [items, setItems] = useState<{ [key: string]: ContainerId }>(() => 
    getCurrentItemsState(currentScenario)
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({ message: '', type: 'info', show: false });
  const [isGameComplete, setIsGameComplete] = useState(false);

  // --- Sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle Scenario Change
  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    setCurrentScenarioIndex(index);
    // Reset game state for new scenario
    const newScenario = SCENARIOS[index];
    setItems(getCurrentItemsState(newScenario));
    setIsGameComplete(false);
    setFeedback({ message: '切換實驗主題成功！', type: 'info', show: true });
  };

  // --- Logic ---
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setShakingId(null);
    setFeedback(prev => ({ ...prev, show: false }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const itemId = active.id as string;
    const targetContainer = over.id as ContainerId;
    
    // Find item definition from CURRENT scenario items
    const itemDef = currentScenario.items.find(i => i.id === itemId);

    if (!itemDef) return;

    // Correct Logic Check
    const isCorrect = itemDef.type === targetContainer;

    if (isCorrect) {
      // Success Logic
      setItems(prev => ({
        ...prev,
        [itemId]: targetContainer
      }));
      triggerSuccess(itemDef.label, targetContainer);
    } else {
      // Error Logic
      triggerError(itemDef, targetContainer as string);
    }
  };

  const triggerSuccess = (label: string, zone: string) => {
    setFeedback({
      message: `太棒了！[${label}] 歸類正確！`,
      type: 'success',
      show: true,
    });
  };

  const triggerError = (item: GameItem, zoneId: string) => {
    setShakingId(item.id);
    
    let msg = `哎呀！位置不對喔。`;

    if (item.type === 'manipulated' && zoneId === 'controlled') {
      msg = `在「${currentScenario.title}」實驗中，[${item.label}] 是主角，不能固定喔！`;
    } else if (item.type === 'controlled' && zoneId === 'manipulated') {
      msg = `在「${currentScenario.title}」實驗中，[${item.label}] 應固定不變，不是主角！`;
    } else if (zoneId === 'responding') {
      msg = `這不是我們主要觀察的實驗結果，再想一想！`;
    }

    setFeedback({
      message: msg,
      type: 'error',
      show: true
    });

    setTimeout(() => {
      setShakingId(null);
    }, 600);
  };

  const handleReset = () => {
    setItems(getCurrentItemsState(currentScenario));
    setIsGameComplete(false);
    setFeedback({ message: '重新開始！', type: 'info', show: true });
  };

  // Check Completion
  useEffect(() => {
    const allPlaced = currentScenario.items.every(item => items[item.id] === item.type);
    if (allPlaced && !isGameComplete) {
      setIsGameComplete(true);
      setTimeout(() => {
        setFeedback({
          message: '恭喜！你已經成功完成所有變因歸位！',
          type: 'success',
          show: true
        });
      }, 500);
    }
  }, [items, isGameComplete, currentScenario]);

  // --- Derived State for Rendering ---
  const activeItem = activeId ? currentScenario.items.find(i => i.id === activeId) : null;
  const poolItems = currentScenario.items.filter(i => items[i.id] === 'pool');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 overflow-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Header Section */}
        <header className="bg-white shadow-sm border-b border-slate-200 p-4 shrink-0 z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title & Selector */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-black text-indigo-700 tracking-tight flex items-center gap-2">
                <span className="bg-indigo-600 text-white p-1 rounded-lg text-sm">
                  <FlaskConical size={20} />
                </span>
                變因歸位大作戰
              </h1>
              
              <div className="relative inline-block">
                <select 
                  value={currentScenarioIndex}
                  onChange={handleScenarioChange}
                  className="appearance-none bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm font-bold rounded-lg pl-3 pr-10 py-2 cursor-pointer hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {SCENARIOS.map((s, idx) => (
                    <option key={s.id} value={idx}>{idx + 1}. {s.title}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 flex-1 max-w-xl shadow-sm">
              <h3 className="text-yellow-800 font-bold text-sm mb-1">任務說明</h3>
              <p className="text-yellow-900 font-medium text-base mb-1">{currentScenario.description}</p>
              <p className="text-yellow-700 text-xs mt-1">{currentScenario.question}</p>
            </div>

            <button 
              onClick={handleReset}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
              title="重新開始"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto h-full flex flex-col gap-8">
            
            {/* Buckets Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 flex-shrink-0">
              {BUCKETS.map((bucket) => (
                <Bucket
                  key={bucket.id}
                  bucket={bucket}
                  items={currentScenario.items.filter(i => items[i.id] === bucket.id)}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 text-slate-300">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-sm font-medium uppercase tracking-widest text-slate-400">待分類卡片 ({poolItems.length})</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* Card Pool Area */}
            <div className="flex-1 bg-white/50 rounded-2xl border-2 border-dashed border-slate-300 p-6 min-h-[200px]">
              {poolItems.length === 0 ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-4 py-10 animate-pop">
                  <div className="p-4 bg-green-100 rounded-full text-green-600 mb-2">
                    <Trophy size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-600">全部完成！</h3>
                  <p>你已經將「{currentScenario.title}」的所有變因歸位了。</p>
                  <button 
                    onClick={handleReset}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95"
                  >
                    再玩一次
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {poolItems.map(item => (
                    <DraggableItem 
                      key={item.id} 
                      item={item} 
                      isShaking={shakingId === item.id} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Drag Overlay (Visual Follower) */}
        <DragOverlay>
          {activeItem ? (
            <div style={{ transform: 'none' }}>
              <DraggableItem item={activeItem} isOverlay />
            </div>
          ) : null}
        </DragOverlay>

        {/* Feedback Toast */}
        <Toast
          message={feedback.message}
          type={feedback.type}
          show={feedback.show}
          onClose={() => setFeedback(prev => ({ ...prev, show: false }))}
        />
      </DndContext>
    </div>
  );
};

export default App;