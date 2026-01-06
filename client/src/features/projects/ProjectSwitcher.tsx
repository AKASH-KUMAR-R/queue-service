import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';
import type { Project } from '../../entities/project/types';

interface ProjectSwitcherProps {
  currentProject: Project;
  projects: Project[];
  onProjectChange: (project: Project) => void;
  onCreateProject: () => void;
}

export function ProjectSwitcher({
  currentProject,
  projects,
  onProjectChange,
  onCreateProject,
}: ProjectSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'text-green-600';
      case 'staging':
        return 'text-orange-600';
      case 'development':
        return 'text-blue-600';
      default:
        return 'text-neutral-600';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 border-b border-border hover:bg-accent transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-foreground truncate">
              {currentProject.name}
            </h1>
            <p className={`text-xs mt-1 ${getEnvironmentColor(currentProject.environment)}`}>
              {currentProject.environment}-{currentProject.region}
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-3 py-2">
              {currentProject.organization}
            </div>
            
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onProjectChange(project);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-accent rounded transition-colors"
              >
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-medium text-card-foreground truncate">{project.name}</div>
                  <div className={`text-xs mt-0.5 ${getEnvironmentColor(project.environment)}`}>
                    {project.environment}-{project.region}
                  </div>
                </div>
                {project.id === currentProject.id && (
                  <Check className="w-4 h-4 text-foreground flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-border p-2">
            <button
              onClick={() => {
                onCreateProject();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}