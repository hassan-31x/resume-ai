# LaTeX Resume Renderer

This component allows you to render LaTeX resumes directly in the browser. It converts LaTeX code to PDF and displays it inline.

## Prerequisites

The LaTeX renderer requires a LaTeX distribution (like TeX Live, MiKTeX, or MacTeX) to be installed on the server. You can check if you have the required dependencies by running:

```bash
npm run check-latex
```

If you're missing LaTeX or any required packages, the script will provide installation instructions.

### Docker Alternative (Recommended)

To avoid installing LaTeX locally, you can use Docker instead:

```bash
# Start the Docker container with LaTeX
npm run docker:start

# For development mode with hot-reloading
npm run docker:dev

# Check LaTeX dependencies inside the container
npm run docker:check-latex

# Stop the container
npm run docker:stop
```

For detailed Docker instructions, see [README-DOCKER.md](README-DOCKER.md).

## Usage

### Using the LatexDocument Component

The `LatexDocument` component is the easiest way to render and edit LaTeX in your application:

```jsx
import LatexDocument from '@/components/latex-document';

export default function YourComponent() {
  const initialLatexCode = `
\\documentclass{article}
\\begin{document}
Hello, world!
\\end{document}
  `;

  return (
    <div className="container mx-auto py-8">
      <LatexDocument 
        initialLatex={initialLatexCode}
        editable={true}
        height="h-[800px]"
      />
    </div>
  );
}
```

### Props

- `initialLatex` (string): The initial LaTeX code to render
- `editable` (boolean, default: true): Whether to allow editing of the LaTeX code
- `height` (string, default: 'h-[800px]'): The height of the editor/renderer

### Using the Base Renderer

If you need more control, you can use the base `LatexRenderer` component:

```jsx
import LatexRenderer from '@/components/latex-renderer';

export default function YourComponent() {
  return (
    <LatexRenderer latexCode="\\documentclass{article}\\begin{document}Hello\\end{document}" />
  );
}
```

## Demo Pages

The application includes two demo pages:

1. `/resume-renderer` - A full-featured editor and renderer
2. `/demo-resume` - A simple demo of the LatexDocument component

## Troubleshooting

### Common LaTeX Issues

1. **Missing Packages**: Ensure your LaTeX distribution has all required packages.
2. **glyphtounicode Error**: The renderer automatically comments out `\input{glyphtounicode}` if it causes issues.
3. **Compilation Errors**: Check the error message for details about LaTeX compilation failures.

### Server Requirements

The API endpoint requires write access to:
- Temporary directory
- The `public/latex-pdf` directory (created automatically)

## How It Works

1. The client sends LaTeX code to the `/api/render-latex` endpoint
2. The server creates a temporary directory and writes the LaTeX code to a .tex file
3. The server compiles the .tex file using pdflatex
4. The resulting PDF is copied to the public directory and served as a static file
5. The client renders the PDF in an iframe 