import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TemplateNotFound() {
  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-center">Template Not Found</h1>
      <p className="text-muted-foreground text-center mt-4 max-w-lg">
        We couldn&apos;t find the template you were looking for. It may have been removed or you might have followed an invalid link.
      </p>
      <Link href="/browse" className="mt-8">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Templates
        </Button>
      </Link>
    </div>
  );
} 