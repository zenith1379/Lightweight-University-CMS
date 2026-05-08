import { create } from "zustand";
import type { Category, DashboardSnapshot, Media, Menu, Post, User } from "@/lib/domain";

type CmsState = {
  session: { userId: string; name: string; email: string; role: "ADMIN" | "USER" } | null;
  dashboard: DashboardSnapshot | null;
  posts: Post[];
  categories: Category[];
  media: Media[];
  users: User[];
  menus: Menu[];
  setSession: (session: CmsState["session"]) => void;
  setDashboard: (dashboard: DashboardSnapshot) => void;
  setPosts: (posts: Post[]) => void;
  setCategories: (categories: Category[]) => void;
  setMedia: (media: Media[]) => void;
  setUsers: (users: User[]) => void;
  setMenus: (menus: Menu[]) => void;
};

export const useCmsStore = create<CmsState>((set) => ({
  session: null,
  dashboard: null,
  posts: [],
  categories: [],
  media: [],
  users: [],
  menus: [],
  setSession: (session) => set({ session }),
  setDashboard: (dashboard) => set({ dashboard }),
  setPosts: (posts) => set({ posts }),
  setCategories: (categories) => set({ categories }),
  setMedia: (media) => set({ media }),
  setUsers: (users) => set({ users }),
  setMenus: (menus) => set({ menus }),
}));
