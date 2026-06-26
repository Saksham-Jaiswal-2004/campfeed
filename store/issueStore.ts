import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Issue } from "@/types/issue.types";

interface IssueStore {
  campusFeed: Issue[];
  userIssues: Issue[];
  adminIssues: Issue[];

  selectedIssue: Issue | null;

  loading: boolean;
  error: string | null;

  setLoading: (loading: boolean) => void;

  setError: (error: string | null) => void;

  setCampusFeed: (issues: Issue[]) => void;

  setUserIssues: (issues: Issue[]) => void;

  setAdminIssues: (issues: Issue[]) => void;

  setSelectedIssue: (issue: Issue | null) => void;

  addIssue: (issue: Issue) => void;

  updateIssue: (issue: Issue) => void;

  removeIssue: (id: string) => void;

  addRealtimeIssue: (issue: Issue) => void;

  updateRealtimeIssue: (issue: Issue) => void;

  removeRealtimeIssue: (id: string) => void;

  clearIssues: () => void;
}

export const useIssueStore = create<IssueStore>()(
  persist(
    (set) => ({
      campusFeed: [],
      userIssues: [],
      adminIssues: [],

      selectedIssue: null,

      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setCampusFeed: (issues) =>
        set({
          campusFeed: issues,
        }),

      setUserIssues: (issues) =>
        set({
          userIssues: issues,
        }),

      setAdminIssues: (issues) =>
        set({
          adminIssues: issues,
        }),

      setSelectedIssue: (issue) =>
        set({
          selectedIssue: issue,
        }),

      addIssue: (issue) =>
        set((state) => ({
          campusFeed: [issue, ...state.campusFeed],

          userIssues: [issue, ...state.userIssues],
        })),

      updateIssue: (issue) =>
        set((state) => ({
          campusFeed: state.campusFeed.map((i) =>
            i.id === issue.id ? issue : i,
          ),

          userIssues: state.userIssues.map((i) =>
            i.id === issue.id ? issue : i,
          ),

          adminIssues: state.adminIssues.map((i) =>
            i.id === issue.id ? issue : i,
          ),

          selectedIssue:
            state.selectedIssue?.id === issue.id
              ? issue
              : state.selectedIssue,
        })),

      removeIssue: (id) =>
        set((state) => ({
          campusFeed: state.campusFeed.filter((i) => i.id !== id),

          userIssues: state.userIssues.filter((i) => i.id !== id),

          adminIssues: state.adminIssues.filter((i) => i.id !== id),

          selectedIssue:
            state.selectedIssue?.id === id ? null : state.selectedIssue,
        })),

      addRealtimeIssue: (issue) =>
        set((state) => ({
          campusFeed: [issue, ...state.campusFeed],
        })),

      updateRealtimeIssue: (issue) =>
        set((state) => ({
          campusFeed: state.campusFeed.map((i) =>
            i.id === issue.id ? issue : i,
          ),
        })),

      removeRealtimeIssue: (id) =>
        set((state) => ({
          campusFeed: state.campusFeed.filter((i) => i.id !== id),
        })),

      clearIssues: () =>
        set({
          campusFeed: [],
          userIssues: [],
          adminIssues: [],
          selectedIssue: null,
          error: null,
        }),
    }),
    {
      name: "issue-storage",

      partialize: (state) => ({
        campusFeed: state.campusFeed,

        userIssues: state.userIssues,

        adminIssues: state.adminIssues,

        selectedIssue: state.selectedIssue,
      }),
    },
  ),
);