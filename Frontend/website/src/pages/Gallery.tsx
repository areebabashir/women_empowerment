import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";
import { getAllGallery } from "@/services/api";

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    scrollTo(0,0)
    async function fetchGallery() {
      try {
        const data = await getAllGallery(1, 5);
        // API returns { success, galleries, ... }
        setGalleryItems(Array.isArray(data) ? data : data.galleries);
      } catch (err) {
        setError("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const openModal = (galleryIdx: number, imageIdx: number) => {
    setSelectedGalleryIndex(galleryIdx);
    setSelectedImageIndex(imageIdx);
  };

  const closeModal = () => {
    setSelectedGalleryIndex(null);
    setSelectedImageIndex(0);
  };

  const showPrevImage = () => {
    if (selectedGalleryIndex === null) return;
    setSelectedImageIndex((prev) => {
      const images = galleryItems[selectedGalleryIndex].images;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  const showNextImage = () => {
    if (selectedGalleryIndex === null) return;
    setSelectedImageIndex((prev) => {
      const images = galleryItems[selectedGalleryIndex].images;
      return prev === galleryItems[selectedGalleryIndex].images.length - 1 ? 0 : prev + 1;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-20 lg:pt-24 pb-16 bg-gradient-to-br from-section-soft to-gentle-rose mt-14 ">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6">Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Capturing moments of empowerment, growth, and community impact
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-10">Loading gallery...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(galleryItems) && galleryItems.map((item, galleryIdx) => (
                <Card
                  key={item._id}
                  className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="cursor-pointer">
                    {item.images && item.images.length > 0 && (
                      <img
                        src={`http://localhost:8000/uploads/${item.images[0]}`}
                        alt={item.title}
                        className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                        onClick={() => openModal(galleryIdx, 0)}
                      />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="text-xs text-primary mb-2">{item.category}</div>
                    <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
<div className="h-1 w-full bg-gradient-to-r from-primary to-soft-purple rounded-full"></div>
      <Footer />

      {/* Image Modal */}
     
      {selectedGalleryIndex !== null && galleryItems[selectedGalleryIndex] && (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <div className="bg-black relative max-w-5xl w-full rounded-xl overflow-hidden shadow-xl">
      
      {/* Close Button - stays inside the modal box */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 p-2 rounded-full z-10"
      >
        ✕
      </button>

      {/* Image & Nav Buttons */}
      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center w-full">
          <button
            onClick={showPrevImage}
            className="text-white bg-black/50 hover:bg-black/70 p-2 rounded-full mr-4"
            aria-label="Previous image"
          >
            ◀
          </button>

          <div className="relative w-full max-w-3xl max-h-[75vh] flex items-center justify-center bg-black rounded-lg overflow-hidden">
            <img
              src={`http://localhost:8000/uploads/${galleryItems[selectedGalleryIndex].images[selectedImageIndex]}`}
              alt={galleryItems[selectedGalleryIndex].title}
              className="w-full h-full object-contain"
            />
          </div>

          <button
            onClick={showNextImage}
            className="text-white bg-black/50 hover:bg-black/70 p-2 rounded-full ml-4"
            aria-label="Next image"
          >
            ▶
          </button>
        </div>

        {/* Info */}
        <div className="text-white mt-4 text-sm opacity-80">
          Image {selectedImageIndex + 1} of {galleryItems[selectedGalleryIndex].images.length}
        </div>
        <div className="text-white mt-1 text-lg font-semibold text-center">
          {galleryItems[selectedGalleryIndex].title}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Gallery;
