import React, { useState, useRef, useEffect } from "react";
import { LazyImageProps } from "../../utils/frontEndTypes";

const LazyImage = (props: LazyImageProps) => {
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Create an Intersection Observer instance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target); // Stop observing after it loads
          }
        });
      },
      { threshold: 0.1 } // Load when 10% of the image is visible
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imageRef}
      src={isInView ? props.src : undefined}
      alt={props.alt}
      className={`${props.className} ${
        isInView ? "" : "opacity-0 transition-opacity duration-500"
      }`}
      loading="lazy"
    />
  );
};

export default LazyImage;
