import { BucketDef, ScenarioDef } from './types';
import { 
  Beaker, 
  Settings2, 
  Eye, 
  Flame, 
  Ruler, 
  Timer, 
  Wind, 
  Container,
  Target,
  Thermometer,
  Zap,
  Layers
} from 'lucide-react';

export const BUCKETS: BucketDef[] = [
  {
    id: 'manipulated',
    title: '主角變因',
    subtitle: '操作變因 (Independent)',
    description: '只有一個，我們故意改變的部分。',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: Settings2
  },
  {
    id: 'controlled',
    title: '配角變因',
    subtitle: '控制變因 (Controlled)',
    description: '必須保持一樣，確保實驗公平。',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Beaker
  },
  {
    id: 'responding',
    title: '結果變因',
    subtitle: '應變變因 (Dependent)',
    description: '最後產生的結果或測量的數值。',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Eye
  }
];

export const ICONS_MAP: Record<string, any> = {
  'bottle-size': Wind,
  'candle-thickness': Ruler,
  'ignition-time': Flame,
  'extinguish-time': Timer,
  'location': Target,
  'cover-method': Layers,
  'bottle-presence': Container,
  'candle-length': Ruler,
  'air-temp': Thermometer,
  'brightness': Zap,
};

export const SCENARIOS: ScenarioDef[] = [
  {
    id: 'scenario-1',
    title: "空氣量與燃燒時間",
    description: "探索不同容量的廣口瓶中，蠟燭能燃燒多久？",
    question: "要把「瓶子大小」放在哪裡呢？",
    items: [
      { id: 'bottle-size', label: '瓶子的大小', type: 'manipulated' },
      { id: 'candle-thickness', label: '蠟燭的粗細', type: 'controlled' },
      { id: 'ignition-time', label: '點火的時間', type: 'controlled' },
      { id: 'extinguish-time', label: '熄滅的秒數', type: 'responding' },
      { id: 'location', label: '實驗的地點', type: 'controlled' },
      { id: 'cover-method', label: '瓶子的蓋法', type: 'controlled' },
    ]
  },
  {
    id: 'scenario-2',
    title: "有無瓶罩的比較",
    description: "如果不蓋瓶子 vs 蓋上瓶子，蠟燭的燃燒情形有何不同？",
    question: "在這個對照實驗中，誰是我們唯一改變的變項？",
    items: [
      { id: 'bottle-presence', label: '有無罩瓶子', type: 'manipulated' },
      { id: 'candle-thickness', label: '蠟燭的粗細', type: 'controlled' },
      { id: 'bottle-size', label: '瓶子的大小', type: 'controlled' },
      { id: 'extinguish-time', label: '熄滅的秒數', type: 'responding' },
      { id: 'location', label: '實驗的地點', type: 'controlled' },
      { id: 'ignition-time', label: '點火的時間', type: 'controlled' },
    ]
  },
  {
    id: 'scenario-3',
    title: "蠟燭粗細的影響",
    description: "在相同容量的瓶子中，粗蠟燭會燒得比細蠟燭久嗎？",
    question: "找出這場實驗中的主角！",
    items: [
      { id: 'candle-thickness', label: '蠟燭的粗細', type: 'manipulated' },
      { id: 'bottle-size', label: '瓶子的大小', type: 'controlled' },
      { id: 'ignition-time', label: '點火的時間', type: 'controlled' },
      { id: 'extinguish-time', label: '熄滅的秒數', type: 'responding' },
      { id: 'location', label: '實驗的地點', type: 'controlled' },
      { id: 'cover-method', label: '瓶子的蓋法', type: 'controlled' },
    ]
  },
  {
    id: 'scenario-4',
    title: "蠟燭長度實驗",
    description: "蠟燭的長短會影響氧氣消耗的速度進而影響燃燒時間嗎？",
    question: "請找出需要保持一致的「配角」變因！",
    items: [
      { id: 'candle-length', label: '蠟燭的長短', type: 'manipulated' },
      { id: 'candle-thickness', label: '蠟燭的粗細', type: 'controlled' },
      { id: 'bottle-size', label: '瓶子的大小', type: 'controlled' },
      { id: 'extinguish-time', label: '熄滅的秒數', type: 'responding' },
      { id: 'location', label: '實驗的地點', type: 'controlled' },
      { id: 'ignition-time', label: '點火的時間', type: 'controlled' },
    ]
  }
];