import { GameItem, BucketDef, ScenarioDef } from './types';
import { Beaker, Settings2, Eye, Flame, Ruler, Timer, Wind, BoxSelect, CircleOff, ArrowUpDown } from 'lucide-react';

export const BUCKETS: BucketDef[] = [
  {
    id: 'manipulated',
    title: '主角',
    subtitle: '操作變因',
    description: '只有一個，我們要改變的',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: Settings2
  },
  {
    id: 'controlled',
    title: '配角',
    subtitle: '控制變因',
    description: '全部要一樣，我們要固定的',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Beaker
  },
  {
    id: 'responding',
    title: '結果',
    subtitle: '應變變因',
    description: '我們要測量觀察的',
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
  'location': BoxSelect,
  'cover-method': Beaker,
  'bottle-presence': CircleOff, // Icon for "有無罩瓶子"
  'burn-status': Eye,           // Icon for "燃燒的情形"
  'candle-length': ArrowUpDown, // Icon for "蠟燭的長短"
};

export const SCENARIOS: ScenarioDef[] = [
  {
    id: 'scenario-1',
    title: "空氣量是否影響燃燒時間",
    description: "我們想透過實驗來找出「空氣的多寡」跟「蠟燭燃燒的時間」有什麼關係。",
    question: "請將下列實驗卡片歸類到正確的變因籃子裡！",
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
    title: "燃燒是否需要空氣",
    description: "我們想知道如果沒有空氣，蠟燭還會不會燃燒？比較「有罩瓶子」與「不罩瓶子」。",
    question: "在這個比較實驗中，哪些變因要改變？哪些要固定？",
    items: [
      { id: 'bottle-presence', label: '有無罩瓶子', type: 'manipulated' },
      { id: 'candle-thickness', label: '蠟燭的粗細', type: 'controlled' },
      { id: 'bottle-size', label: '瓶子的大小', type: 'controlled' }, // If using a bottle, use the same size
      { id: 'extinguish-time', label: '熄滅的秒數', type: 'responding' },
      { id: 'location', label: '實驗的地點', type: 'controlled' },
      { id: 'ignition-time', label: '點火的時間', type: 'controlled' },
    ]
  },
  {
    id: 'scenario-3',
    title: "蠟燭粗細是否影響燃燒時間",
    description: "粗的蠟燭和細的蠟燭，哪一個可以燒比較久？(假設瓶內空氣量相同)",
    question: "請試著找出這個實驗的主角與配角！",
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
    title: "蠟燭長短是否影響燃燒時間",
    description: "長蠟燭跟短蠟燭，在同樣大小的瓶子裡燃燒，時間會一樣嗎？",
    question: "請找出這個實驗的操作變因與控制變因！",
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