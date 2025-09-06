import {
  initDB,
  saveBlogsToDB,
  getBlogsFromDB,
  deleteBlogFromDB,
  clearBlogsDB,
} from "../../src/utils/db";

const sampleBlogs = [
  { id: "1", title: "First Blog", content: "Hello world" },
  { id: "2", title: "Second Blog", content: "Another post" },
];

describe("IndexedDB Blog Store", () => {
  beforeEach(async () => {
    await clearBlogsDB(); // Reset state
  });

  it("saves blogs to DB", async () => {
    await saveBlogsToDB(sampleBlogs);
    const all = await getBlogsFromDB();
    expect(all).toHaveLength(2);
    expect(all[0].title).toBe("First Blog");
  });

  it("gets specific blog by ID", async () => {
    await saveBlogsToDB(sampleBlogs);
    const blog = await getBlogsFromDB();
    expect(blog[1].id).toBe("2");
  });

  it("deletes a blog by ID", async () => {
    await saveBlogsToDB(sampleBlogs);
    await deleteBlogFromDB("1");
    const remaining = await getBlogsFromDB();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe("2");
  });

  it("clears all blogs", async () => {
    await saveBlogsToDB(sampleBlogs);
    await clearBlogsDB();
    const blogs = await getBlogsFromDB();
    expect(blogs).toHaveLength(0);
  });
});
