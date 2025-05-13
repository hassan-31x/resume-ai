declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      [key: string]: any;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: 'portrait' | 'landscape';
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface Html2PdfInstance {
    set: (options: Html2PdfOptions) => Html2PdfInstance;
    from: (element: HTMLElement | null) => Html2PdfInstance;
    save: () => Promise<void>;
    toPdf: () => any;
    get: (type: string) => any;
  }

  function html2pdf(): Html2PdfInstance;
  namespace html2pdf {
    export function Worker(): Html2PdfInstance;
  }
  
  export default html2pdf;
} 