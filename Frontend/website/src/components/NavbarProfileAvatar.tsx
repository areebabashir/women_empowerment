// src/components/NavbarProfileAvatar.tsx
import { useEffect, useState } from "react";
import { apiCall } from "@/api/apiCall";
import { ApiErrorResponse, User } from "@/types";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const NavbarProfileAvatar = () => {
    const navigate = useNavigate()
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await apiCall<{ user: User }>({
          url: `${API_BASE_URL}/users/profile`,
          method: 'GET',
          requiresAuth: true,
        });
        console.log(response)

        if(response.success && response.data.image){
          const imagePath = response.data.image;
          const fullImageUrl = `${API_BASE_URL.replace(/\/api$/, '')}/${imagePath}`;
          console.log(fullImageUrl)
          setImageSrc(fullImageUrl);
        } else {
          const errorData = response.data as ApiErrorResponse;
          console.warn("Profile fetch failed:", errorData?.msg);
        }
      } catch (err) {
        console.error("Error fetching profile image:", err);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <div onClick={() => {navigate("/userdashboard")}} className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary shadow-sm">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
          ?
        </div>
      )}
    </div>
  );
};

export default NavbarProfileAvatar;
