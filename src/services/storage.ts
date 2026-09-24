import { BrandProject } from '../types/brand';
import { DEMO_PROJECT } from '../data/demoProject';

const STORAGE_PROJECTS_KEY = 'brandpulse_ai_projects';
const STORAGE_ACTIVE_ID_KEY = 'brandpulse_ai_active_id';

export function getStoredProjects(): BrandProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (!raw) {
      // Initialize with demo project
      const initial = [DEMO_PROJECT];
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEMO_PROJECT];
  } catch (err) {
    console.error('Failed to read stored projects:', err);
    return [DEMO_PROJECT];
  }
}

export function saveProjects(projects: BrandProject[]): void {
  try {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
}

export function getActiveProjectId(): string {
  try {
    const id = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
    if (id) return id;
    return DEMO_PROJECT.id;
  } catch {
    return DEMO_PROJECT.id;
  }
}

export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(STORAGE_ACTIVE_ID_KEY, id);
  } catch (err) {
    console.error('Failed to set active project id:', err);
  }
}

export function getActiveProject(): BrandProject {
  const projects = getStoredProjects();
  const activeId = getActiveProjectId();
  const found = projects.find((p) => p.id === activeId);
  return found || projects[0] || DEMO_PROJECT;
}

export function saveActiveProject(updated: BrandProject): void {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === updated.id);
  const updatedProject: BrandProject = {
    ...updated,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.push(updatedProject);
  }
  saveProjects(projects);
  setActiveProjectId(updated.id);
}

export function resetToDemoProject(): BrandProject {
  const demoClone = JSON.parse(JSON.stringify(DEMO_PROJECT));
  demoClone.updatedAt = new Date().toISOString();
  saveActiveProject(demoClone);
  return demoClone;
}

export function createNewProject(
  projectName: string,
  roughIdea: string,
  options?: {
    targetAudience?: string;
    industry?: string;
    marketLocation?: string;
    constraints?: string;
  }
): BrandProject {
  const newProject: BrandProject = {
    id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    projectName: projectName.trim(),
    roughIdea: roughIdea.trim(),
    targetAudience: options?.targetAudience?.trim() || '',
    industry: options?.industry?.trim() || '',
    marketLocation: options?.marketLocation?.trim() || '',
    constraints: options?.constraints?.trim() || '',
    currentStage: 'discover',
    completedStages: [],
    discovery: {
      interview: [],
      currentQuestionIndex: 0,
      brandBrief: null,
    },
    positioning: {
      directions: [],
      selectedDirectionId: null,
    },
    shape: null,
    visualize: null,
    challenges: {
      issues: [],
      battle: null,
    },
    consistency: null,
    launchKit: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveActiveProject(newProject);
  return newProject;
}

export function deleteProject(id: string): BrandProject[] {
  const projects = getStoredProjects().filter((p) => p.id !== id);
  if (projects.length === 0) {
    projects.push(DEMO_PROJECT);
  }
  saveProjects(projects);
  if (getActiveProjectId() === id) {
    setActiveProjectId(projects[0].id);
  }
  return projects;
}
