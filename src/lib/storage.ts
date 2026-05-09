import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredObject = {
  url: string;
  key: string;
};

export async function storeMediaFile(file: File): Promise<StoredObject> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `cms/${new Date().toISOString().slice(0, 10)}/${Date.now()}-${safeName}`;

  if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV !== "production") {
    const publicPath = path.join(process.cwd(), "public", "uploads", key);
    await mkdir(path.dirname(publicPath), { recursive: true });
    await writeFile(publicPath, Buffer.from(await file.arrayBuffer()));
    return { key, url: `/uploads/${key}` };
  }

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return { key, url: blob.url };
}
