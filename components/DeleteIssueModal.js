"use client";
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { api } from '@/lib/api';

const DeleteIssueModal = ({ entityType, entity, onSuccess, onError }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const route = entityType === "Issue" ? `/issues/${entity.id}/delete` 
              : entityType === "Event" ? `/events/${entity.id}` 
              : entityType === "Announcement" ? `/announcements/${entity.id}/delete` 
              : "";

  const handleDeleteEntity = async () => {
    setIsDeleting(true);
    try {
      await api(route, "DELETE");
      
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {entityType === "Announcement" && <DialogTrigger asChild className="bg-red-500/10 w-full">
          <button className='bg-red-500/10 text-red-900 hover:text-red-700 hover:bg-red-500/20 px-2 py-2 rounded-sm flex justify-center items-center'><MdDelete className='text-lg' /></button>
      </DialogTrigger>
      }
      {entityType !== "Announcement" && <DialogTrigger asChild className="bg-red-500/10 w-full">
          <div className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-red-500/20 text-red-500 flex items-center justify-center gap-1 w-full">
            <MdDeleteOutline className='text-red-500 text-base' /> {entityType === "Issue" ? "Delete" : ""}
          </div>
      </DialogTrigger>
      }
      <DialogContent className="bg-[#020613] border border-gray-700 rounded-lg">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-white text-lg font-semibold">Delete {entityType}</h2>
            <p className="text-gray-400 text-sm mt-1">
              Are you sure you want to delete this {entityType}? This action cannot be undone.
            </p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
            <p className="text-sm text-gray-300">
              <strong>{entityType}:</strong> {entityType === "Event" ? entity.name : entity.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ID: {entity.id}
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setOpen(false)}
              className="border border-gray-700 text-gray-300 hover:bg-gray-900 px-4 py-2 rounded transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteEntity}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all duration-200 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Issue"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteIssueModal;
