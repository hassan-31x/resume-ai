'use client';

import { useState } from 'react';
import HtmlRenderer from '@/components/html-renderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Eye, Code } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HtmlDocumentProps {
  initialHtml?: string;
  initialCss?: string;
  editable?: boolean;
  height?: string;
}

export default function HtmlDocument({ 
  initialHtml = '', 
  initialCss = '',
  editable = true,
  height = 'h-[800px]'
}: HtmlDocumentProps) {
  const [htmlContent, setHtmlContent] = useState<string>(initialHtml);
  const [cssStyles, setCssStyles] = useState<string>(initialCss);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTab, setEditingTab] = useState<'html' | 'css'>('html');
  const [key, setKey] = useState<number>(0); // For forcing re-render

  const handleRender = () => {
    setIsEditing(false);
    setKey(prev => prev + 1); // Force re-render
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
          <Tabs 
            value={editingTab} 
            onValueChange={(value) => setEditingTab(value as 'html' | 'css')}
            className="p-2"
          >
            <TabsList className="mb-2">
              <TabsTrigger value="html">
                <Code className="h-4 w-4 mr-2" />
                HTML
              </TabsTrigger>
              <TabsTrigger value="css">
                <Code className="h-4 w-4 mr-2" />
                CSS
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="html">
              <Textarea 
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className={`font-mono ${height} rounded-none border resize-none`}
                placeholder="<div>Your HTML content here</div>"
              />
            </TabsContent>
            
            <TabsContent value="css">
              <Textarea 
                value={cssStyles}
                onChange={(e) => setCssStyles(e.target.value)}
                className={`font-mono ${height} rounded-none border resize-none`}
                placeholder=".your-class { color: blue; }"
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className={height}>
            <HtmlRenderer 
              key={key} 
              html={htmlContent} 
              css={cssStyles} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 