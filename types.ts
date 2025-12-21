import React from 'react';

export type VariableType = 'manipulated' | 'controlled' | 'responding';
export type ContainerId = VariableType | 'pool';

export interface GameItem {
  id: string;
  label: string;
  type: VariableType;
  icon?: string; 
}

export interface Feedback {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
}

export interface BucketDef {
  id: VariableType;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
}

export interface ScenarioDef {
  id: string;
  title: string;
  description: string;
  question: string;
  items: GameItem[];
}