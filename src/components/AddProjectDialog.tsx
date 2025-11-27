import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X, Upload } from 'lucide-react';
import type { Project, User } from '../App';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  currentUser: User;
}

const commonAmenities = [
  'Near Metro',
  'Near Hospital',
  'Near Highway',
  'Shopping Mall',
  'School Nearby',
  'Park',
  'Gym',
  'Swimming Pool',
  'Club House',
  'Security',
  'Power Backup',
  'Parking',
];

export function AddProjectDialog({ open, onOpenChange, onAddProject, currentUser }: AddProjectDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    type: 'apartment' as Project['type'],
    totalUnits: 0,
    unitsAvailable: 0,
    unitsSold: 0,
    unitTypes: [] as string[],
    amenities: [] as string[],
  });

  const [newUnitType, setNewUnitType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addUnitType = () => {
    if (newUnitType && !formData.unitTypes.includes(newUnitType)) {
      setFormData({ ...formData, unitTypes: [...formData.unitTypes, newUnitType] });
      setNewUnitType('');
    }
  };

  const removeUnitType = (type: string) => {
    setFormData({ ...formData, unitTypes: formData.unitTypes.filter(t => t !== type) });
  };

  const toggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject({
      ...formData,
      createdBy: '123',
    });
    setFormData({
      name: '',
      image: '',
      type: 'apartment',
      totalUnits: 0,
      unitsAvailable: 0,
      unitsSold: 0,
      unitTypes: [],
      amenities: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Create a new real estate project in your inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Project Image</Label>
            <div className="flex items-center gap-4">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded" />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Project Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value:any) => setFormData({ ...formData, type: value as Project['type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="builder_floor">Builder Floor</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalUnits">Total Units</Label>
              <Input
                id="totalUnits"
                type="number"
                min="0"
                value={formData.totalUnits}
                onChange={(e) => setFormData({ ...formData, totalUnits: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitsAvailable">Units Available</Label>
              <Input
                id="unitsAvailable"
                type="number"
                min="0"
                value={formData.unitsAvailable}
                onChange={(e) => setFormData({ ...formData, unitsAvailable: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitsSold">Units Sold</Label>
              <Input
                id="unitsSold"
                type="number"
                min="0"
                value={formData.unitsSold}
                onChange={(e) => setFormData({ ...formData, unitsSold: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Unit Types (e.g., 2BHK, 3BHK)</Label>
            <div className="flex gap-2">
              <Input
                value={newUnitType}
                onChange={(e) => setNewUnitType(e.target.value)}
                placeholder="Enter unit type"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUnitType())}
              />
              <Button type="button" onClick={addUnitType}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.unitTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                  <button
                    type="button"
                    onClick={() => removeUnitType(type)}
                    className="ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonAmenities.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${
                    formData.amenities.includes(amenity)
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="rounded"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}