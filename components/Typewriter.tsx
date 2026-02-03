import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  paragraphs: string[];
}

const Typewriter: React.FC<TypewriterProps> = ({ paragraphs }) => {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    // Reset when paragraphs change
    setTypedParagraphs([]);
    setCurrentParagraphIndex(0);
    setCurrentText('');
  }, [paragraphs]);

  useEffect(() => {
    if (currentParagraphIndex >= paragraphs.length) {
      return; // All paragraphs are typed
    }

    const fullText = paragraphs[currentParagraphIndex];
    if (currentText.length < fullText.length) {
      const timeoutId = setTimeout(() => {
        setCurrentText(fullText.slice(0, currentText.length + 1));
      }, 20); // Typing speed
      return () => clearTimeout(timeoutId);
    } else {
      // Paragraph finished typing, wait a bit then move to the next one
      const timeoutId = setTimeout(() => {
        setTypedParagraphs(prev => [...prev, fullText]);
        setCurrentParagraphIndex(prev => prev + 1);
        setCurrentText('');
      }, 500); // Pause between paragraphs
      return () => clearTimeout(timeoutId);
    }
  }, [currentText, currentParagraphIndex, paragraphs]);

  const isFinished = currentParagraphIndex >= paragraphs.length;

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed font-medium">
      {typedParagraphs.map((p, index) => <p key={index}>{p}</p>)}
      
      {!isFinished && (
        <p>
          {currentText}
          <span className="inline-block w-0.5 h-6 bg-emerald-500 animate-[pulse_1s_ease-in-out_infinite] ml-1" style={{boxShadow: '0 0 5px #10b981'}}></span>
        </p>
      )}
    </div>
  );
};

export default Typewriter;
