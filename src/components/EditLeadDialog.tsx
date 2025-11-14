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
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Camera, RotateCcw, Phone, MessageCircle, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import type { Lead, User, TimelineEvent } from '../App';

interface EditLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
  currentUser: User;
  allUser:User[];
}

export function EditLeadDialog({ open, onOpenChange, lead, onUpdateLead, currentUser , allUser }: EditLeadDialogProps) {
  const [formData, setFormData] = useState(lead);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
const colClass = currentUser.role == 'admin' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1'
console.log(lead,'fsdfasfafafffdfsfsaf');

  const handleStatusChange = async (newStatus: Lead['status']) => {
    const oldStatus = formData.status;
    setFormData({ ...formData, status: newStatus });

    if (newStatus === 'site_visit' && oldStatus !== 'site_visit') {
      setShowCamera(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please check permissions.');
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(photoData);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const savePhoto = () => {
    if (capturedPhoto) {
      // setFormData({
      //   ...formData,
      //   siteVisitPhotos: [...(formData.siteVisitPhotos || []), capturedPhoto],
      // });
      setCapturedPhoto(null);
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setCapturedPhoto(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const timelineEvents: TimelineEvent[] = [...formData.timeline];
    
    // if (lead.status !== formData.status) {
    //   timelineEvents.push({
    //     id: Date.now().toString(),
    //     timestamp: new Date().toISOString(),
    //     userId: currentUser._id,
    //     userName: currentUser.name,
    //     action: 'Status Changed',
    //     details: `Changed from ${lead.status} to ${formData.status}`,
    //   });
    // }

    // if (lead.followUp !== formData.followUp) {
    //   timelineEvents.push({
    //     id: (Date.now() + 1).toString(),
    //     timestamp: new Date().toISOString(),
    //     userId: currentUser._id,
    //     userName: currentUser.name,
    //     action: 'Follow-up Date Updated',
    //     details: `Changed to ${new Date(formData.followUp).toLocaleDateString()}`,
    //   });
    // }

    // if (lead.notes !== formData.notes) {
    //   timelineEvents.push({
    //     id: (Date.now() + 2).toString(),
    //     timestamp: new Date().toISOString(),
    //     userId: currentUser._id,
    //     userName: currentUser.name,
    //     action: 'Remarks Updated',
    //     details: 'Lead remarks were modified',
    //   });
    // }

    onUpdateLead({
      ...formData,
      // timeline: timelineEvents,
    });
    onOpenChange(false);
  };

  const handleCall = () => {
    window.location.href = `tel:${lead.phone}`;
  };

  const handleWhatsApp = () => {
    const phoneNumber = lead.phone.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const deletePhoto = (index: number) => {
    // setFormData({
    //   ...formData,
    //   siteVisitPhotos: formData.siteVisitPhotos?.filter((_, i) => i !== index),
    // });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update lead information and track changes
          </DialogDescription>
        </DialogHeader>

        {showCamera ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              {!capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <img src={capturedPhoto} alt="Captured" className="w-full h-64 object-cover" />
              )}
            </div>

            <div className="flex gap-3">
              {!capturedPhoto ? (
                <>
                  <Button onClick={capturePhoto} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                  <Button variant="outline" onClick={closeCamera} className="flex-1">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={retakePhoto} variant="outline" className="flex-1">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button onClick={savePhoto} className="flex-1">
                    Save Photo
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="flex gap-2 mb-4">
                <Button variant="outline" onClick={handleCall} className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" onClick={handleWhatsApp} className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

              <div className='grid grid-cols-2 gap-4'>
                                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value:any) => handleStatusChange(value as Lead['status'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                      <SelectItem value="site_visit">Site Visit</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              <div className="space-y-2">
            <Label htmlFor="edit-source">Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value:any) => setFormData({ ...formData, source: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="walkin">Walk-in</SelectItem>
              </SelectContent>
            </Select>
          </div>
              </div>

          <div className='grid grid-cols-2 gap-4'>
                  <div className="space-y-2">
                  <Label htmlFor="edit-followupDate">Follow-up Date</Label>
                  <Input
                    id="edit-followupDate"
                    type="date"
                    value={formData.followUp}
                    onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-followupDate">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
                    required
                  />
                </div>
          </div>

        <div className = {`${colClass}`}>
        <div className="space-y-2">
            <Label htmlFor="edit-budget">Budget</Label>
            <Input
              id="edit-buget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
          </div>

     {currentUser.role == 'admin' && <div className="space-y-2">
            <Label htmlFor="edit-assignedTo">Assigned To</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value:any) => setFormData({ ...formData, assignedTo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allUser.map(u => (
                  <SelectItem value={u._id} key={u._id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

     }
      </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-remarks">Remarks</Label>
                  <Textarea
                    id="edit-remarks"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* {formData.siteVisitPhotos && formData.siteVisitPhotos.length > 0 && (
                  <div className="space-y-2">
                    <Label>Site Visit Photos</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.siteVisitPhotos.map((photo, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={photo}
                            alt={`Site visit ${idx + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => deletePhoto(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                {formData.status === 'site_visit' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleStatusChange('site_visit')}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Site Visit Photo
                  </Button>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-4">
              <div className="space-y-3">
                {/* {formData.timeline.map((event) => (
                  <Card key={event.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-900">{event.action}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                        <p className="text-xs text-gray-500 mt-1">By {event.userName}</p>
                      </div>
                    </div>
                  </Card>
                ))} */}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}