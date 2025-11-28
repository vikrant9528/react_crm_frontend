import { useState } from 'react';
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
import type { Lead, User } from '../App';
import { File } from "lucide-react";
import { api } from '../api';
import * as XLSX from "xlsx";

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'timeline'>) => void;
  currentUser: User;
  allUser:User[];
}

export function AddLeadDialog({ open, onOpenChange, onAddLead, currentUser ,allUser }: AddLeadDialogProps) {
  console.log(allUser,'fsdaffffffffffffffff')
    const authData = JSON.parse(localStorage.getItem('authData') || '[]')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone:'',
    status: 'new' as Lead['status'],
    followUp: new Date().toISOString().split('T')[0],
    time:'',
    notes: '',
    budget:'',
    source:'website' as Lead['source'],
    assignedTo:''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLead({
      ...formData,
      assignedTo: currentUser.role != 'admin' ? currentUser._id : formData.assignedTo,
      createdBy: currentUser._id ?? '',
      // siteVisitPhotos: [],
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'new',
      followUp: new Date().toISOString().split('T')[0],
      notes: '',
      time:'',
      budget:'',
      source:'website',
      assignedTo:''
    });
    onOpenChange(false);
  };

  const onFileChange = (event:any) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  fileReader.onload = () => {
    const buffer = fileReader.result;
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log(jsonData);

    if (jsonData) {
      uploadExcelFile("/leads/importLeads", jsonData);
    }
  };
};

const uploadExcelFile = (endpoint:string ,data:any) =>{
    api.post(endpoint , data ,{
      headers:{
        Authorization:`Bearer ${authData.token}`
      }
    }).then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    })
}

  const colClass = currentUser.role == 'admin' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Create a new lead and assign it to yourself
          </DialogDescription>
            <div className='flex' style={{justifyContent:'flex-end'}}>
            <Button  onClick={() => document.getElementById("excelInput")?.click()} className="w-fit ">
          <File className="w-4 h-4 mr-1" />
          Import Excel
        </Button>
        <input
          id="excelInput"
          type="file"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={onFileChange}
        />
            </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

      <div className='grid grid-cols-2 gap-4'>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value:any) => setFormData({ ...formData, status: value as Lead['status'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                {/* <SelectItem value="interested">Interested</SelectItem> */}
                <SelectItem value="not_interested">Not Interested</SelectItem>
                <SelectItem value="site_visit">Site Visit</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
            <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select
              value={formData.source}
              onValueChange={(value:any) => setFormData({ ...formData, source:  value as Lead['source'] })}
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
            <Label htmlFor="followUp">Follow-up Date</Label>
            <Input
              id="followUp"
              type="date"
              value={formData.followUp}
              onChange={(e) => setFormData({ ...formData, followUp: e.target.value })}
              required
            />
          </div>

            <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
     </div>

      <div className = {`${colClass}`}>
        <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="buget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
          </div>

     {currentUser.role == 'admin' && <div className="space-y-2">
            <Label htmlFor="status">Assigned To</Label>
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
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
