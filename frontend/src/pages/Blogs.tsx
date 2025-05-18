import { AppBar } from "../components/AppBar";
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  if (loading) {
    return <div>Loading ...</div>;
  }
  return (
    <div>
      <AppBar />
      <div className="flex justify-center">
        <div className="">
          {blogs.map((blog) => (
            <BlogCard
              id={blog.id}
              title={blog.title}
              content={blog.content}
              authorName={blog.author.name || "Anon"}
              publishedDate={"17/may/2025"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
