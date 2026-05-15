"use client";
import React, { useState } from 'react';
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { MdDeleteOutline } from "react-icons/md";

const DeleteIssueModal = ({ issue, onSuccess, onError }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDeleteIssue = async () => {
    setIsDeleting(true);
    try {
      const issueRef = doc(db, "issues", issue.id);
      await deleteDoc(issueRef);
      
      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-red-500/10 text-red-500 flex items-center gap-2 w-full">
          <MdDeleteOutline className='text-red-500' /> Delete
        </div>
      </DialogTrigger>
      <DialogContent className="bg-[#020613] border border-gray-700 rounded-lg">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-white text-lg font-semibold">Delete Issue</h2>
            <p className="text-gray-400 text-sm mt-1">
              Are you sure you want to delete this issue? This action cannot be undone.
            </p>
          </div>
          
          <div className="bg-gray-900/50 border border-gray-700 rounded p-3">
            <p className="text-sm text-gray-300">
              <strong>Issue:</strong> {issue.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ID: {issue.id}
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
              onClick={handleDeleteIssue}
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
