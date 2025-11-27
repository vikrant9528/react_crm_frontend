import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { Project, User } from '../App';
import { AddProjectDialog } from './AddProjectDialog';
import { EditProjectDialog } from './EditProjectDialog';

interface InventoryPageProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  currentUser: User;
}

const projectTypeLabels = {
  builder_floor: 'Builder Floor',
  apartment: 'Apartment',
  villa: 'Villa',
  plot: 'Plot',
  commercial: 'Commercial',
};

export function InventoryPage({ projects, setProjects, currentUser }: InventoryPageProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProject = (newProject: Omit<Project, 'id' | 'createdAt'>) => {
    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setProjects(prev => {
      const updated = [...prev, project];
      localStorage.setItem('crm_projects', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      );
      localStorage.setItem('crm_projects', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => {
      const updated = prev.filter(project => project.id !== projectId);
      localStorage.setItem('crm_projects', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900">Inventory</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your real estate projects and properties
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setEditingProject(project)}
          >
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-gray-900">{project.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {projectTypeLabels[project.type]}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Total Units</p>
                  <p className="text-gray-900">{project.totalUnits}</p>
                </div>
                <div>
                  <p className="text-gray-500">Available</p>
                  <p className="text-green-600">{project.unitsAvailable}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sold</p>
                  <p className="text-blue-600">{project.unitsSold}</p>
                </div>
                <div>
                  <p className="text-gray-500">Unit Types</p>
                  <p className="text-gray-900">{project.unitTypes.join(', ')}</p>
                </div>
              </div>

              {project.amenities.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-1">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {project.amenities.slice(0, 3).map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {project.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found</p>
        </div>
      )}

      <AddProjectDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddProject={handleAddProject}
        currentUser={currentUser}
      />

      {editingProject && (
        <EditProjectDialog
          open={!!editingProject}
          onOpenChange={(open:any) => !open && setEditingProject(null)}
          project={editingProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}