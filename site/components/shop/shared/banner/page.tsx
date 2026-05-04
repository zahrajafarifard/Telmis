import React, { useEffect, useState } from "react";
import styles from "./banner.module.css";
import "@/components/shop/shared/style.css";

interface BannerImages {
  screen1980?: string;
  screen1440?: string;
  screen900?: string;
  screen500?: string;
}

const Banner = () => {
  const [images, setImages] = useState<BannerImages>({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/banner/shop-header`
        );
        const data = await response.json();

        const formatPath = (path?: string) =>
          path?.replace(/\\/g, "/")?.split("/")?.pop();

        setImages({
          screen1980: formatPath(data?.image_screen1980),
          screen1440: formatPath(data?.image_screen1440),
          screen900: formatPath(data?.image_screen900),
          screen500: formatPath(data?.image_screen500),
        });
      } catch (err) {
        console.error("Error loading banner image:", err);
      }
    };

    fetchImages();
  }, []);

  const getBannerStyle = (
    filename?: string,
    height?: string
  ): React.CSSProperties => ({
    width: "100%",
    height,
    backgroundImage: filename
      ? `url(${process.env.NEXT_PUBLIC_API_URL}/uploads/banners/${filename})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  });

  return (
    <>
      {/* Screen ≥ 1980 */}
      <div
        style={getBannerStyle(images.screen1980, "400px")}
        className={`screen1440:hidden ${styles.container}`}
      >
        {!images.screen1980 && <div className="h-[400px]"></div>}
      </div>

      {/* Screen ≥ 1440 */}
      <div
        style={getBannerStyle(images.screen1440, "300px")}
        className={`hidden screen1440:grid screen950:hidden ${styles.container}`}
      >
        {!images.screen1440 && <div className="h-[300px]"></div>}
      </div>

      {/* Screen ≥ 900 */}
      <div
        style={getBannerStyle(images.screen900, "280px")}
        className={`hidden screen950:grid screen500:hidden ${styles.container}`}
      >
        {!images.screen900 && <div className="h-[280px]"></div>}
      </div>

      {/* Screen ≥ 500 */}
      <div
        style={getBannerStyle(images.screen500, "400px")}
        className={`hidden screen500:grid ${styles.container}`}
      >
        {!images.screen500 && <div className="h-[400px]"></div>}
      </div>
    </>
  );
};

export default Banner;
