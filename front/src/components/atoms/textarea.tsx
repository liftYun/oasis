import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  maxHeightPx?: number;
  withCounterPadding?: boolean; // 우측 상단 카운터용 패딩. 현재는 사용하지 않음 (카운터가 아래로 이동)
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = true, maxHeightPx, withCounterPadding, onChange, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const adjustHeight = () => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      const maxH =
        maxHeightPx ?? (typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.5) : 400);
      el.style.height = 'auto';
      const newHeight = el.scrollHeight;
      if (newHeight > maxH) {
        el.style.height = `${maxH}px`;
        el.style.overflowY = 'auto';
      } else {
        el.style.height = `${newHeight}px`;
        el.style.overflowY = 'hidden';
      }
    };

    React.useEffect(() => {
      adjustHeight();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value, autoResize, maxHeightPx]);

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      if (onChange) onChange(e);
      adjustHeight();
    };

    const baseClasses =
      'w-full min-h-[12rem] rounded-lg border border-gray-300 bg-white px-4 py-3 text-base placeholder:text-sm placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none';
    const paddingForCounter = withCounterPadding ? 'pr-12' : '';
    const combinedClasses = twMerge(baseClasses, paddingForCounter, className);

    return (
      <textarea ref={innerRef} className={combinedClasses} onChange={handleChange} {...props} />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
