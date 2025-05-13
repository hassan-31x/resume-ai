interface Window {
  katex?: any;
  renderMathInElement?: (
    element: HTMLElement, 
    options: {
      delimiters: Array<{
        left: string;
        right: string;
        display: boolean;
      }>;
      throwOnError?: boolean;
    }
  ) => void;
  SwiftLaTeX?: {
    createEngine: () => any;
  };
}

// Extend the global namespace
declare global {
  interface Window {
    katex?: any;
    renderMathInElement?: (
      element: HTMLElement, 
      options: {
        delimiters: Array<{
          left: string;
          right: string;
          display: boolean;
        }>;
        throwOnError?: boolean;
      }
    ) => void;
    SwiftLaTeX?: {
      createEngine: () => any;
    };
  }
} 