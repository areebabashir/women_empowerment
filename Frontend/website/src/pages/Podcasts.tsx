import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Play, Calendar, Clock, Download, Search, X, Loader2 } from "lucide-react";
import { getAllPodcasts } from "@/services/api";

const Podcasts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    scrollTo(0,0)
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPodcasts();
      console.log('API Response:', data); // Debug log
      // Handle different possible data structures
      const podcastsArray = Array.isArray(data) ? data : 
                           data?.podcasts ? data.podcasts : 
                           data?.data ? data.data : [];
      console.log('Processed podcasts array:', podcastsArray); // Debug log
      setPodcasts(podcastsArray);
    } catch (err) {
      setError('Failed to load podcasts. Please try again later.');
      console.error('Error fetching podcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPodcasts = Array.isArray(podcasts) ? podcasts.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.guest?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const openVideo = (url: string) => {
    setVideoUrl(url);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setVideoUrl("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading podcasts...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Header />

      {/* Video Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black">
            <button
              onClick={closeOverlay}
              className="absolute top-2 right-2 text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title="Podcast Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose mt-14  ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">
            Empowerment Talks
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Inspiring conversations with women leaders, changemakers, and visionaries
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search episodes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => {}}>Search</Button>
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8">All Podcasts</h2>
          
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchPodcasts}>Try Again</Button>
            </div>
          )}

          {!error && (
            <div className="space-y-6">
              {filteredPodcasts.map((podcast, index) => (
                <Card
                  key={podcast._id || index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="md:flex items-start gap-6">
                      {/* Thumbnail with Play Icon */}
                      <div
                        onClick={() => openVideo(`http://localhost:8000/uploads/${podcast.video}`)}
                        className="relative bg-gradient-to-br from-primary/10 to-lilac/20 rounded-lg min-w-[100px] h-24 cursor-pointer flex items-center justify-center"
                      >
                        <Play className="text-primary w-8 h-8" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-full">
                            Episode {podcast.episodeNumber || index + 1}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-primary mb-2">
                          {podcast.name}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {podcast.description}
                        </p>
                        {podcast.guest && (
                          <p className="text-sm font-medium text-primary mb-4">
                            Guest: {podcast.guest}
                          </p>
                        )}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {podcast.publishDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(podcast.publishDate).toLocaleDateString()}
                              </div>
                            )}
                            {podcast.duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {podcast.duration}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => openVideo(`http://localhost:8000/uploads/${podcast.video}`)}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Watch Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredPodcasts.length === 0 && !loading && (
                <p className="text-muted-foreground text-center">No episodes found.</p>
              )}
            </div>
          )}
        </div>
      </section>
      <div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>

      <Footer />
    </div>
  );
};

export default Podcasts;
