// utils/db.ts
import { openDB } from "idb";

const DB_NAME = "GMP";
const BLOG_STORE = "blogs";
const PRODUCT_STORE = "products";

// Function to initialize DB and ensure both object stores are created
export const initDB = async () => {
  try {
    return openDB(DB_NAME, 2, {
      // Incremented version to force an upgrade if necessary
      upgrade(db, oldVersion, newVersion) {
        // Create blogs object store if not already created
        if (!db.objectStoreNames.contains(BLOG_STORE)) {
          db.createObjectStore(BLOG_STORE, { keyPath: "id" });
        }

        // Create products object store if not already created
        if (!db.objectStoreNames.contains(PRODUCT_STORE)) {
          db.createObjectStore(PRODUCT_STORE, { keyPath: "id" });
        }
      },
    });
  } catch (error) {
    console.error("Failed to initialize IndexedDB:", error);
    throw error;
  }
};

/**
 * Save multiple blogs to the IndexedDB.
 * @param blogs - Array of blogs to save.
 */
export const saveBlogsToDB = async (blogs: any) => {
  try {
    const db = await initDB();
    const tx = db.transaction(BLOG_STORE, "readwrite");
    const store = tx.store;
    await Promise.all(blogs.map((blog: any) => store.put(blog)));
    await tx.done;
  } catch (error) {
    console.error("Failed to save blogs to IndexedDB:", error);
    throw error;
  }
};

/**
 * Fetch all blogs from the IndexedDB.
 * @returns Array of blogs or an empty array if the fetch fails.
 */
export const getBlogsFromDB = async () => {
  try {
    const db = await initDB();
    return await db.getAll(BLOG_STORE);
  } catch (error) {
    console.error("Failed to fetch blogs from IndexedDB:", error);
    return [];
  }
};

/**
 * Fetch a specific blog by ID from the IndexedDB.
 * @param id - The ID of the blog to fetch.
 * @returns The blog object or null if not found.
 */
export const getBlogFromDB = async (id: string) => {
  try {
    const db = await initDB();
    return (await db.get(BLOG_STORE, id)) || null;
  } catch (error) {
    console.error(`Failed to fetch blog with ID ${id} from IndexedDB:`, error);
    return null;
  }
};

/**
 * Save multiple products to the IndexedDB.
 * @param products - Array of products to save.
 */
export const saveProductsToDB = async (products: any) => {
  try {
    const db = await initDB();
    const tx = db.transaction(PRODUCT_STORE, "readwrite");
    products.forEach((product: any) => tx.store.put(product));
    await tx.done;
  } catch (error) {
    console.error("Failed to save products to IndexedDB:", error);
    throw error;
  }
};

/**
 * Fetch all products from the IndexedDB.
 * @returns Array of products or an empty array if the fetch fails.
 */
export const getProductsFromDB = async () => {
  try {
    const db = await initDB();
    return await db.getAll(PRODUCT_STORE);
  } catch (error) {
    console.error("Failed to fetch products from IndexedDB:", error);
    return [];
  }
};

/**
 * Fetch a specific product by ID from the IndexedDB.
 * @param id - The ID of the product to fetch.
 * @returns The product object or null if not found.
 */
export const getProductFromDB = async (id: number) => {
  try {
    const db = await initDB();
    return (await db.get(PRODUCT_STORE, id)) || null;
  } catch (error) {
    console.error(
      `Failed to fetch product with ID ${id} from IndexedDB:`,
      error
    );
    return null;
  }
};

/**
 * Delete a specific blog by ID from the IndexedDB.
 * @param id - The ID of the blog to delete.
 */
export const deleteBlogFromDB = async (id: string) => {
  try {
    const db = await initDB();
    const tx = db.transaction(BLOG_STORE, "readwrite");
    await tx.store.delete(id);
    await tx.done;
  } catch (error) {
    console.error(`Failed to delete blog with ID ${id} from IndexedDB:`, error);
    throw error;
  }
};

/**
 * Clear all blogs from the IndexedDB.
 */
export const clearBlogsDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(BLOG_STORE, "readwrite");
    await tx.store.clear();
    await tx.done;
  } catch (error) {
    console.error("Failed to clear blogs from IndexedDB:", error);
    throw error;
  }
};

/**
 * Delete a specific product by ID from the IndexedDB.
 * @param id - The ID of the product to delete.
 */
export const deleteProductFromDB = async (id: number) => {
  try {
    const db = await initDB();
    const tx = db.transaction(PRODUCT_STORE, "readwrite");
    await tx.store.delete(id);
    await tx.done;
  } catch (error) {
    console.error(
      `Failed to delete product with ID ${id} from IndexedDB:`,
      error
    );
    throw error;
  }
};

/**
 * Clear all products from the IndexedDB.
 */
export const clearProductsDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(PRODUCT_STORE, "readwrite");
    await tx.store.clear();
    await tx.done;
  } catch (error) {
    console.error("Failed to clear products from IndexedDB:", error);
    throw error;
  }
};
