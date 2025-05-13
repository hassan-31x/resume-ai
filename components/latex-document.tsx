'use client';

import { useState } from 'react';
import LatexRenderer from '@/components/latex-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Eye } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface LatexDocumentProps {
  initialLatex?: string;
  editable?: boolean;
  height?: string;
}

export default function LatexDocument({ 
  initialLatex = '', 
  editable = true,
  height = 'h-[800px]'
}: LatexDocumentProps) {
  const [latexCode, setLatexCode] = useState<string>(initialLatex);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0); // For forcing re-render of the LatexRenderer

  const handleRender = () => {
    setIsEditing(false);
    setKey(prev => prev + 1); // Force re-render the PDF
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0 overflow-hidden">
        {editable && (
          <div className="flex justify-end gap-2 p-2 bg-muted/20 border-b">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
            {isEditing && (
              <Button 
                size="sm" 
                onClick={handleRender}
              >
                Render
              </Button>
            )}
          </div>
        )}
        
        {isEditing ? (
          <Textarea 
            value={latexCode}
            onChange={(e) => setLatexCode(e.target.value)}
            className={`font-mono ${height} rounded-none border-0 resize-none`}
          />
        ) : (
          <div className={height}>
            <LatexRenderer key={key} latexCode={latexCode} />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 