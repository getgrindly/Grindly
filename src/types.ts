/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrackId = 'foundations' | 'design' | 'architecture' | 'system-design' | 'grind-workflow' | 'pro-skills';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
}

export interface Track {
  id: TrackId;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface FileNode {
  name: string;
  content: string;
  language: string;
}

export interface SandboxProject {
  id: string;
  name: string;
  files: Record<string, FileNode>;
}

export interface CodeReviewChallenge {
  id: string;
  title: string;
  badCode: string;
  language: string;
  principles: string[];
}

export interface CanvasComponent {
  id: string;
  type: 'service' | 'database' | 'cache' | 'queue' | 'gateway';
  label: string;
  x: number;
  y: number;
}

export interface Progression {
  foundations: number;
  architecture: number;
  workflow: number;
}

export interface GitState {
  staged: string[];
  commits: Array<{ hash: string; message: string; branch: string }>;
  branch: string;
}
