"use client";
import React, { useEffect, useState, useRef } from "react";
import Details from "./details";
import style from "./style.module.css";

interface FAQPropsDetails {
  id: number;
  title: string;
  text: string;
}
interface FAQProps {
  questions: FAQPropsDetails[];
}
const FAQ: React.FC<FAQProps> = ({ questions }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entries[0].target); // Stop observing after first view
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-[70%] mx-auto my-28 screen1360:w-[80%] screen690:w-[90%]">
      {questions?.map((item, index) => {
        const delayClass = `delay${index + 1}`;
        return (
          <div
            key={item.id}
            ref={containerRef}
            className={`${
              isVisible ? `${style.slideUpAnimation} ${style[delayClass]}` : ""
            }`}
          >
            <Details
              item={item}
              isActive={activeId === item.id}
              onToggle={() =>
                setActiveId((prevId) => (prevId === item.id ? null : item.id))
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default FAQ;
