import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllBlogs } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    scrollTo(0,0)
    async function fetchBlogs() {
      try {
        const data = await getAllBlogs();
        setBlogs(Array.isArray(data) ? data : data.blogs || data.data || []);
      } catch (err) {
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBlogs = [...filteredBlogs].sort(
    (a, b) =>
      new Date(b.publicationDate).getTime() -
      new Date(a.publicationDate).getTime()
  );

  const featuredBlog = sortedBlogs[0];
  const otherBlogs = sortedBlogs.slice(1);

  const handleReadMore = (blog) => setSelectedBlog(blog);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose  mt-14 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-primary mb-6">
            Our Blog
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stories, insights, and resources for women's empowerment and growth
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="button" className="w-full sm:w-auto">
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-8">
            Featured Article
          </h2>
          {loading ? (
            <div className="text-center py-10">Loading blogs...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : featuredBlog ? (
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 mb-12">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 aspect-video md:aspect-auto bg-gradient-to-br from-primary/10 to-lilac/20 flex items-center justify-center">
                  {featuredBlog.image ? (
                    <img
                      src={`http://localhost:8000/uploads/images/${featuredBlog.image}`}
                      alt={featuredBlog.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-primary" />
                  )}
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {featuredBlog.category}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4">
                    {featuredBlog.name}
                  </h3>
                  <p className="text-base text-muted-foreground mb-6">
                    {featuredBlog.description.length > 200
                      ? featuredBlog.description.slice(0, 200) + "..."
                      : featuredBlog.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {featuredBlog.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(featuredBlog.publicationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Button onClick={() => handleReadMore(featuredBlog)}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="text-center py-10">No featured blog available.</div>
          )}
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-8">
            Latest Articles
          </h2>
          {loading ? (
            <div className="text-center py-10">Loading blogs...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : otherBlogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherBlogs.map((post, index) => (
                <Card
                  key={post._id || index}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-lilac/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {post.image ? (
                      <img
                        src={`http://localhost:8000/uploads/images/${post.image}`}
                        alt={post.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <CardTitle className="text-primary group-hover:text-primary/80 transition-colors">
                      {post.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-base">
                      {post.description.length > 150
                        ? post.description.slice(0, 150) + "..."
                        : post.description}
                    </CardDescription>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publicationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="mt-2 px-0"
                      onClick={() => handleReadMore(post)}
                    >
                      View More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">No blogs available.</div>
          )}
        </div>
      </section>

      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

      <Footer />

      {/* Dialog Popup */}
      {selectedBlog && (
        <Dialog open={true} onOpenChange={() => setSelectedBlog(null)}>
          <DialogContent className="max-w-2xl w-[90vw]">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary mb-2">
                {selectedBlog.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm mb-4">
                {new Date(selectedBlog.publicationDate).toLocaleDateString()} by{" "}
                {selectedBlog.author}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={`http://localhost:8000/uploads/images/${selectedBlog.image}`}
                alt={selectedBlog.name}
                className="w-full h-64 object-cover rounded-md"
              />
              <p className="text-base text-foreground whitespace-pre-wrap">
                {selectedBlog.description}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Blog;
