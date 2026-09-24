import React, { useState } from 'react';
import { BrandProject, WorkflowStage } from './types/brand';
import {
  getStoredProjects,
  getActiveProject,
  saveActiveProject,
  createNewProject,
  deleteProject,
  resetToDemoProject,
  setActiveProjectId
} from './services/storage';
import { LabPipelineNav } from './components/LabPipelineNav';
import { BrandDnaSidebar } from './components/BrandDnaSidebar';
import { AiSignalsPanel } from './components/AiSignalsPanel';
import { LandingPage } from './components/LandingPage';
import { NewProjectModal } from './components/NewProjectModal';
import { ExportModal } from './components/ExportModal';
import { DiscoverStage } from './components/stages/DiscoverStage';
import { PositionStage } from './components/stages/PositionStage';
import { ShapeStage } from './components/stages/ShapeStage';
import { VisualizeStage } from './components/stages/VisualizeStage';
import { ChallengeStage } from './components/stages/ChallengeStage';
import { LaunchKitStage } from './components/stages/LaunchKitStage';

export default function App() {
  const [projects, setProjects] = useState<BrandProject[]>(() => getStoredProjects());
  const [activeProject, setActiveProject] = useState<BrandProject>(() => getActiveProject());
  const [currentView, setCurrentView] = useState<'landing' | WorkflowStage>('landing');
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Sync active project changes to storage and state
  const handleUpdateProject = (updated: BrandProject) => {
    setActiveProject(updated);
    saveActiveProject(updated);
    setProjects(getStoredProjects());
  };

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    const proj = getStoredProjects().find((p) => p.id === id) || activeProject;
    setActiveProject(proj);
    setCurrentView(proj.currentStage === 'validate' ? 'challenge' : proj.currentStage);
  };

  const handleCreateProject = (data: {
    projectName: string;
    roughIdea: string;
    targetAudience?: string;
    industry?: string;
    marketLocation?: string;
    constraints?: string;
  }) => {
    const created = createNewProject(data.projectName, data.roughIdea, {
      targetAudience: data.targetAudience,
      industry: data.industry,
      marketLocation: data.marketLocation,
      constraints: data.constraints,
    });
    setProjects(getStoredProjects());
    setActiveProject(created);
    setIsNewModalOpen(false);
    setCurrentView('discover');
  };

  const handleLoadDemo = () => {
    const demo = resetToDemoProject();
    setProjects(getStoredProjects());
    setActiveProject(demo);
    setCurrentView('position');
  };

  const handleNavigateStage = (stage: WorkflowStage | 'dashboard') => {
    const targetStage: WorkflowStage = stage === 'dashboard' || stage === 'validate' ? 'challenge' : stage;
    const updated = {
      ...activeProject,
      currentStage: targetStage,
    };
    handleUpdateProject(updated);
    setCurrentView(targetStage);
  };

  const handleNextStage = (next: WorkflowStage) => {
    const target = next === 'validate' ? 'launch' : next;
    const updated: BrandProject = {
      ...activeProject,
      currentStage: target,
    };
    handleUpdateProject(updated);
    setCurrentView(target);
  };

  const isLanding = currentView === 'landing';

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111] flex flex-col font-sans antialiased selection:bg-[#3157FF] selection:text-white">
      {/* Top Editorial Pipeline Navigation */}
      <LabPipelineNav
        activeProject={activeProject}
        currentStage={currentView === 'landing' ? 'discover' : currentView}
        onNavigateStage={(st) => handleNavigateStage(st)}
        onNewProject={() => setIsNewModalOpen(true)}
        onLoadBenchmark={handleLoadDemo}
        onOpenExport={() => setIsExportModalOpen(true)}
        onGoHome={() => setCurrentView('landing')}
        projects={projects}
        onSelectProject={handleSelectProject}
        isLanding={isLanding}
      />

      {/* Main Workspace Area */}
      {isLanding ? (
        <LandingPage
          onStartBuilding={(initialIdea) => {
            if (initialIdea) {
              handleCreateProject({
                projectName: 'New Brand Project',
                roughIdea: initialIdea,
              });
            } else {
              setIsNewModalOpen(true);
            }
          }}
          onLoadDemo={handleLoadDemo}
          onNavigateStage={(st) => handleNavigateStage(st)}
        />
      ) : (
        /* Asymmetric Editorial Studio Workspace */
        <div className="flex flex-1 overflow-hidden relative">
          {/* ZONE 1 (LEFT): BRAND DNA CORE */}
          <div className="hidden lg:flex w-72 shrink-0 border-r border-[#D9D9D2] bg-[#F7F6F2] overflow-hidden">
            <BrandDnaSidebar
              project={activeProject}
              onNavigateStage={(st) => handleNavigateStage(st)}
            />
          </div>

          {/* ZONE 2 (CENTER): EDITORIAL WORKBENCH */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 tech-grid">
            <div className="max-w-4xl mx-auto">
              {currentView === 'discover' && (
                <DiscoverStage
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                  onContinue={() => handleNextStage('position')}
                />
              )}

              {currentView === 'position' && (
                <PositionStage
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                  onContinue={() => handleNextStage('shape')}
                />
              )}

              {currentView === 'shape' && (
                <ShapeStage
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                  onContinue={() => handleNextStage('visualize')}
                />
              )}

              {currentView === 'visualize' && (
                <VisualizeStage
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                  onContinue={() => handleNextStage('challenge')}
                />
              )}

              {currentView === 'challenge' && (
                <ChallengeStage
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                  onContinue={() => handleNextStage('launch')}
                />
              )}

              {currentView === 'launch' && (
                <LaunchKitStage
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                  onOpenExport={() => setIsExportModalOpen(true)}
                />
              )}
            </div>
          </main>

          {/* ZONE 3 (RIGHT): AI STRATEGIC SIGNALS */}
          <div className="hidden xl:flex w-80 shrink-0 border-l border-[#D9D9D2] bg-[#F7F6F2] overflow-hidden">
            <AiSignalsPanel project={activeProject} />
          </div>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* Export Dossier Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={activeProject}
      />
    </div>
  );
}
