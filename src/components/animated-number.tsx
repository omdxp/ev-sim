"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  formatter?: (value: number) => string;
};

export default function AnimatedNumber({
  value,
  formatter = (v) => v.toString(),
}: Props) {
  const [displayValue, setDisplayValue] = useState(value);
  const [animateUp, setAnimateUp] = useState(false);
  const [animateDown, setAnimateDown] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // Trigger animation on value change
    if (value !== prevValueRef.current) {
      setAnimateUp(value > prevValueRef.current);
      setAnimateDown(value < prevValueRef.current);
      setDisplayValue(value);

      prevValueRef.current = value;

      const timer = setTimeout(() => {
        setAnimateUp(false);
        setAnimateDown(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        animateUp ? "translate-y-0 opacity-100 animate-fade-up" : ""
      } ${animateDown ? "translate-y-0 opacity-100 animate-fade-down" : ""} ${
        !animateUp && !animateDown ? "transform-none" : ""
      }`}
    >
      {formatter(displayValue)}
    </span>
  );
}
