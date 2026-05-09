"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import {
  Bold,
  FileText,
  FolderTree,
  Heading2,
  Image as ImageIcon,
  Italic,
  LayoutDashboard,
  List,
  LogIn,
  LogOut,
  Plus,
  Save,
  Search,
  Shield,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import type { Category, DashboardSnapshot, Media, Post, PostStatus, Role, User } from "@/lib/domain";
import { useCmsStore } from "@/store/cms-store";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type View = "dashboard" | "posts" | "categories" | "media" | "users";

const nav: Array<{ key: View; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean }> = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "posts", label: "Posts", icon: FileText },
  { key: "categories", label: "Categories", icon: FolderTree },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "users", label: "Users", icon: Users, adminOnly: true },
];

type PostDraft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  status: PostStatus;
  seoTitle: string;
  seoDescription: string;
  categoryId: string;
};

const emptyPost: PostDraft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "<p></p>",
  thumbnail: "",
  status: "DRAFT",
  seoTitle: "",
  seoDescription: "",
  categoryId: "",
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function LoginPanel() {
  const setSession = useCmsStore((state) => state.setSession);
  const [email, setEmail] = useState("admin@scse.local");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState("");

  async function login(role?: Role) {
    setError("");
    const payload =
      role === "USER"
        ? { email: "user@scse.local", password: "User@12345" }
        : role === "ADMIN"
          ? { email: "admin@scse.local", password: "Admin@12345" }
          : { email, password };

    try {
      const result = await api<{ data: { userId: string; name: string; email: string; role: Role } }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSession(result.data);
    } catch {
      setError("Login failed. Check credentials or database seed data.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-slate-950 p-8 text-white">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#2f3192]">
            <Shield size={24} />
          </div>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-cyan-100">Admin CMS</p>
          <h1 className="mt-3 text-3xl font-black tracking-normal">University content management</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Manage posts, drafts, categories, media, users, SEO metadata, and publishing workflow with ADMIN/USER permissions.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button type="button" onClick={() => void login("ADMIN")}>
              <LogIn size={17} /> Demo Admin
            </Button>
            <Button type="button" onClick={() => void login("USER")} className="border border-white/20 bg-white/10 hover:bg-white/15">
              <LogIn size={17} /> Demo User
            </Button>
          </div>
        </section>
        <section className="p-6 sm:p-8">
          <div className="space-y-4">
            <label className="grid gap-1 text-sm font-bold text-slate-700">
              Email
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email (e.g., admin@scse.local)" />
            </label>
            <label className="grid gap-1 text-sm font-bold text-slate-700">
              Password
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <Button type="button" onClick={() => void login()} className="w-full">
              <LogIn size={17} /> Login
            </Button>
            {error && <p className="text-sm font-bold text-[#2f3192]">{error}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardView({ dashboard }: { dashboard: DashboardSnapshot | null }) {
  if (!dashboard) return null;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Total posts" value={dashboard.totals.posts} />
        <Stat label="Published" value={dashboard.totals.published} />
        <Stat label="Drafts" value={dashboard.totals.drafts} />
        <Stat label="Users" value={dashboard.totals.users} />
        <Stat label="Media" value={dashboard.totals.media} />
        <Stat label="Categories" value={dashboard.totals.categories} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-black text-slate-950">Latest Articles</h2>
          <div className="mt-3 divide-y divide-slate-100">
            {dashboard.latestPosts.map((post) => (
              <div key={post.id} className="py-3">
                <p className="font-bold text-slate-950">{post.title}</p>
                <p className="text-sm text-slate-500">{post.status} / {post.category?.name}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-black text-slate-950">Draft Queue</h2>
          <div className="mt-3 divide-y divide-slate-100">
            {dashboard.draftPosts.map((post) => (
              <div key={post.id} className="py-3">
                <p className="font-bold text-slate-950">{post.title}</p>
                <p className="text-sm text-slate-500">{post.author?.name ?? "Editor"}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PostsView({ canPublish }: { canPublish: boolean }) {
  const { posts, categories, media, setPosts, setDashboard, setMedia } = useCmsStore();
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<PostDraft>(emptyPost);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [open, setOpen] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, LinkExtension.configure({ openOnClick: false }), TiptapImage],
    content: draft.content,
    onUpdate: ({ editor }) => setDraft((current) => ({ ...current, content: editor.getHTML() })),
  });

  useEffect(() => {
    if (editor && open) editor.commands.setContent(draft.content);
  }, [draft.id, editor, open]);

  const filtered = useMemo(
    () => posts.filter((post) => `${post.title} ${post.excerpt}`.toLowerCase().includes(q.toLowerCase())),
    [posts, q],
  );

  function start(post?: Post) {
    setDraft(
      post
        ? {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            thumbnail: post.thumbnail ?? "",
            status: post.status,
            seoTitle: post.seoTitle ?? "",
            seoDescription: post.seoDescription ?? "",
            categoryId: post.categoryId,
          }
        : { ...emptyPost, categoryId: categories[0]?.id ?? "" },
    );
    setOpen(true);
  }

  async function save() {
    const body = JSON.stringify(draft);
    const result = await api<{ data: Post }>(draft.id ? `/api/posts/${draft.id}` : "/api/posts", {
      method: draft.id ? "PUT" : "POST",
      body,
    });
    setPosts(draft.id ? posts.map((post) => (post.id === draft.id ? result.data : post)) : [result.data, ...posts]);
    setOpen(false);
    const dashboard = await api<DashboardSnapshot>("/api/dashboard");
    setDashboard(dashboard);
  }

  async function remove(id: string) {
    await api(`/api/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter((post) => post.id !== id));
  }

  async function uploadThumbnail(file?: File) {
    if (!file) return;
    setUploadingThumb(true);
    const form = new FormData();
    form.append("file", file);
    form.append("alt", draft.title || file.name);
    try {
      const result = await api<{ data: Media }>("/api/media", { method: "POST", body: form });
      setMedia([result.data, ...media]);
      setDraft((current) => ({ ...current, thumbnail: result.data.url }));
    } finally {
      setUploadingThumb(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={17} />
          <Input className="w-full pl-9" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search posts" />
        </div>
        <Button type="button" onClick={() => start()}>
          <Plus size={17} /> New Post
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="site-scrollbar overflow-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td className="px-4 py-3 font-bold text-slate-950">{post.title}</td>
                  <td className="px-4 py-3">{post.category?.name}</td>
                  <td className="px-4 py-3">{post.status}</td>
                  <td className="px-4 py-3">{post.author?.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button type="button" onClick={() => start(post)} className="h-9 bg-slate-950">Edit</Button>
                      {canPublish && <Button type="button" onClick={() => void remove(post.id)} className="h-9 bg-[#20246f]"><Trash2 size={15} /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
          <div className="site-scrollbar max-h-[92vh] w-full max-w-6xl overflow-auto rounded-lg bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-xl font-black text-slate-950">{draft.id ? "Edit Post" : "Create Post"}</h2>
            </div>
            <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
                  <label className="grid gap-1 text-sm font-bold text-slate-700">
                    Post title
                    <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Post title" />
                  </label>
                  <label className="grid gap-1 text-sm font-bold text-slate-700">
                    Excerpt
                    <Textarea className="min-h-20" value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} placeholder="Short summary" />
                  </label>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 bg-slate-50">
                    <div className="flex flex-wrap items-center gap-1 p-2">
                      <span className="mr-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Editor</span>
                      <button type="button" className={clsx("grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-800 hover:bg-slate-100", editor?.isActive("bold") && "bg-[#e8f7fc] text-[#2f3192]")} onClick={() => editor?.chain().focus().toggleBold().run()} title="Bold">
                        <Bold size={16} />
                      </button>
                      <button type="button" className={clsx("grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-800 hover:bg-slate-100", editor?.isActive("italic") && "bg-[#e8f7fc] text-[#2f3192]")} onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italic">
                        <Italic size={16} />
                      </button>
                      <button type="button" className={clsx("grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-800 hover:bg-slate-100", editor?.isActive("heading", { level: 2 }) && "bg-[#e8f7fc] text-[#2f3192]")} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading">
                        <Heading2 size={16} />
                      </button>
                      <button type="button" className={clsx("grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-800 hover:bg-slate-100", editor?.isActive("bulletList") && "bg-[#e8f7fc] text-[#2f3192]")} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bullet list">
                        <List size={16} />
                      </button>
                      <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 hover:bg-slate-100">
                        <ImageIcon size={16} />
                        Insert image
                        <input className="sr-only" type="file" accept="image/*" onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          void uploadThumbnail(file).then(() => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const src = String(reader.result);
                              editor?.chain().focus().setImage({ src }).run();
                            };
                            reader.readAsDataURL(file);
                          });
                        }} />
                      </label>
                    </div>
                  </div>
                  <EditorContent editor={editor} className="cms-editor min-h-80 p-4" />
                </div>
              </div>
              <aside className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-black text-slate-800">Thumbnail</p>
                  <div className="mt-3 overflow-hidden rounded-md border border-slate-200 bg-white">
                    {draft.thumbnail ? (
                      <img src={draft.thumbnail} alt="" className="h-36 w-full object-cover" />
                    ) : (
                      <div className="grid h-36 place-items-center text-sm font-bold text-slate-400">No image</div>
                    )}
                  </div>
                  <label className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-bold text-white">
                    <Upload size={16} />
                    {uploadingThumb ? "Uploading..." : "Upload thumbnail"}
                    <input className="sr-only" type="file" accept="image/*" disabled={uploadingThumb} onChange={(event) => void uploadThumbnail(event.target.files?.[0])} />
                  </label>
                </div>
                <label className="grid gap-1 text-sm font-bold text-slate-700">
                  Category
                  <select className="h-10 rounded-md border border-slate-200 px-3" value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-bold text-slate-700">
                  Status
                  <select className="h-10 rounded-md border border-slate-200 px-3" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as PostStatus })} disabled={!canPublish && draft.status === "PUBLISHED"}>
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED" disabled={!canPublish}>PUBLISHED</option>
                    <option value="ARCHIVED" disabled={!canPublish}>ARCHIVED</option>
                  </select>
                </label>
                <Input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="Slug" />
                <Input value={draft.thumbnail} onChange={(event) => setDraft({ ...draft, thumbnail: event.target.value })} placeholder="Thumbnail URL or uploaded path" />
                <Input value={draft.seoTitle} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} placeholder="SEO title" />
                <Textarea value={draft.seoDescription} onChange={(event) => setDraft({ ...draft, seoDescription: event.target.value })} placeholder="SEO description" />
              </aside>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 p-5">
              <Button type="button" className="bg-slate-200 text-slate-950 hover:bg-slate-300" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="button" onClick={() => void save()}><Save size={17} /> Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriesView() {
  const { categories, setCategories } = useCmsStore();
  const [name, setName] = useState("");
  async function add() {
    const result = await api<{ data: Category }>("/api/categories", { method: "POST", body: JSON.stringify({ name }) });
    setCategories([...categories, result.data]);
    setName("");
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-black text-slate-950">Create Category</h2>
        <div className="mt-4 grid gap-3">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" />
          <Button type="button" onClick={() => void add()}><Plus size={17} /> Add</Button>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between rounded-md border border-slate-100 p-3">
              <span className="font-bold text-slate-950">{category.name}</span>
              <span className="text-sm text-slate-500">/{category.slug}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MediaView() {
  const { media, setMedia } = useCmsStore();
  const [file, setFile] = useState<File | null>(null);
  const [editing, setEditing] = useState<Media | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  async function upload() {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const result = await api<{ data: Media }>("/api/media", { method: "POST", body: form });
    setMedia([result.data, ...media]);
    setFile(null);
  }

  function startEdit(asset: Media) {
    setEditing(asset);
    setEditAlt(asset.alt ?? "");
    setEditFile(null);
  }

  async function saveEdit() {
    if (!editing) return;
    const form = new FormData();
    form.append("alt", editAlt);
    if (editFile) form.append("file", editFile);
    const result = await api<{ data: Media }>(`/api/media/${editing.id}`, { method: "PUT", body: form });
    setMedia(media.map((asset) => (asset.id === editing.id ? result.data : asset)));
    setEditing(null);
    setEditFile(null);
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          <Button type="button" onClick={() => void upload()}><Upload size={17} /> Upload</Button>
        </div>
      </section>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {media.map((asset) => (
          <div key={asset.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <img src={asset.url} alt={asset.alt ?? ""} className="h-40 w-full object-cover" />
            <div className="p-3">
              <p className="truncate text-sm font-bold text-slate-700">{asset.alt ?? asset.key}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{asset.url}</p>
              <Button type="button" onClick={() => startEdit(asset)} className="mt-3 h-9 w-full bg-slate-950">Edit</Button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-black text-slate-950">Edit Media</h2>
            <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
              <img src={editing.url} alt={editing.alt ?? ""} className="h-48 w-full object-cover" />
            </div>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-sm font-bold text-slate-700">
                Alt text
                <Input value={editAlt} onChange={(event) => setEditAlt(event.target.value)} />
              </label>
              <label className="grid gap-1 text-sm font-bold text-slate-700">
                Replace image
                <Input type="file" accept="image/*" onChange={(event) => setEditFile(event.target.files?.[0] ?? null)} />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" className="bg-slate-200 text-slate-950 hover:bg-slate-300" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="button" onClick={() => void saveEdit()}><Save size={17} /> Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersView() {
  const { users, setUsers } = useCmsStore();
  const [draft, setDraft] = useState({ name: "", email: "", password: "User@12345", confirmPassword: "User@12345", role: "USER" as Role });
  const [error, setError] = useState("");
  async function add() {
    setError("");
    if (draft.password !== draft.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const result = await api<{ data: User }>("/api/users", { method: "POST", body: JSON.stringify(draft) });
    setUsers([result.data, ...users]);
    setDraft({ name: "", email: "", password: "User@12345", confirmPassword: "User@12345", role: "USER" });
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-black text-slate-950">Create User</h2>
        <div className="mt-4 grid gap-3">
          <Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Name" />
          <Input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="Email" />
          <Input type="password" value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} placeholder="Password" />
          <Input type="password" value={draft.confirmPassword} onChange={(event) => setDraft({ ...draft, confirmPassword: event.target.value })} placeholder="Confirm password" />
          <select className="h-10 rounded-md border border-slate-200 px-3" value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as Role })}>
            <option>USER</option>
            <option>ADMIN</option>
          </select>
          {error && <p className="text-sm font-bold text-[#2f3192]">{error}</p>}
          <Button type="button" onClick={() => void add()}><Plus size={17} /> Add User</Button>
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="divide-y divide-slate-100">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-slate-950">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{user.role}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminCmsShell() {
  const { session, setSession, dashboard, setDashboard, setPosts, setCategories, setMedia, setUsers } = useCmsStore();
  const [active, setActive] = useState<View>("dashboard");

  useEffect(() => {
    void api<{ data: NonNullable<typeof session> }>("/api/auth/me").then((result) => setSession(result.data)).catch(() => setSession(null));
  }, [setSession]);

  useEffect(() => {
    if (!session) return;
    void Promise.all([
      api<DashboardSnapshot>("/api/dashboard"),
      api<{ data: Post[] }>("/api/posts?pageSize=100"),
      api<{ data: Category[] }>("/api/categories"),
      api<{ data: Media[] }>("/api/media"),
      session.role === "ADMIN" ? api<{ data: User[] }>("/api/users") : Promise.resolve({ data: [] }),
    ]).then(([dashboard, postsResult, categoriesResult, mediaResult, usersResult]) => {
      setDashboard(dashboard);
      setPosts(postsResult.data);
      setCategories(categoriesResult.data);
      setMedia(mediaResult.data);
      setUsers(usersResult.data);
    });
  }, [session, setCategories, setDashboard, setMedia, setPosts, setUsers]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    setSession(null);
  }

  if (!session) return <LoginPanel />;

  const visibleNav = nav.filter((item) => !item.adminOnly || session.role === "ADMIN");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-4 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#2f3192] text-white">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2f3192]">SCSE</p>
            <h1 className="font-black text-slate-950">CMS Admin</h1>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.key} type="button" onClick={() => setActive(item.key)} className={clsx("flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-bold", active === item.key ? "bg-[#2f3192] text-white" : "text-slate-600 hover:bg-slate-100")}>
                <Icon size={17} /> {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2f3192]">Authenticated CMS Workspace</p>
              <h2 className="text-2xl font-black tracking-normal text-slate-950">{visibleNav.find((item) => item.key === active)?.label}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">Public site</Link>
              <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">{session.name} / {session.role}</span>
              <Button type="button" onClick={() => void logout()} className="h-10 w-10 px-0"><LogOut size={17} /></Button>
            </div>
          </div>
          <div className="site-scrollbar mt-3 flex gap-2 overflow-auto lg:hidden">
            {visibleNav.map((item) => (
              <button key={item.key} type="button" onClick={() => setActive(item.key)} className={clsx("shrink-0 rounded-md px-3 py-2 text-sm font-bold", active === item.key ? "bg-[#2f3192] text-white" : "bg-slate-100 text-slate-700")}>
                {item.label}
              </button>
            ))}
          </div>
        </header>
        <div className="p-4 sm:p-6">
          {active === "dashboard" && <DashboardView dashboard={dashboard} />}
          {active === "posts" && <PostsView canPublish={session.role === "ADMIN"} />}
          {active === "categories" && <CategoriesView />}
          {active === "media" && <MediaView />}
          {active === "users" && session.role === "ADMIN" && <UsersView />}
        </div>
      </main>
    </div>
  );
}
