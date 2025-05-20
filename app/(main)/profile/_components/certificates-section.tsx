"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Award,
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Calendar
} from "lucide-react";
import { 
  getUserCertificates, 
  addCertificate, 
  updateCertificate, 
  deleteCertificate
} from "@/actions/user-info";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Define interface for certificate data
interface CertificateData {
  id?: string;
  name: string;
  issuingOrganization: string;
  issueDate?: Date;
  expirationDate?: Date | null;
  neverExpires?: boolean;
  credentialId?: string | null;
  credentialUrl?: string | null;
}

interface CertificateFormData {
  name: string;
  issuingOrganization: string;
  issueDate: Date | null;
  expirationDate: Date | null;
  neverExpires: boolean;
  credentialId: string;
  credentialUrl: string;
}

export default function CertificatesSection() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCertificateId, setCurrentCertificateId] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [certificateForm, setCertificateForm] = useState<CertificateFormData>({
    name: "",
    issuingOrganization: "",
    issueDate: null,
    expirationDate: null,
    neverExpires: false,
    credentialId: "",
    credentialUrl: ""
  });

  // Load certificates on component mount
  useEffect(() => {
    loadCertificates();
  }, []);

  async function loadCertificates() {
    const { certificates, error } = await getUserCertificates();
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    setCertificates(certificates || []);
  }

  // Handle certificate form changes
  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCertificateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle never expires checkbox change
  const handleNeverExpiresChange = (checked: boolean) => {
    setCertificateForm(prev => ({
      ...prev,
      neverExpires: checked,
      expirationDate: checked ? null : prev.expirationDate
    }));
  };

  // Reset certificate form
  const resetCertificateForm = () => {
    setCertificateForm({
      name: "",
      issuingOrganization: "",
      issueDate: null,
      expirationDate: null,
      neverExpires: false,
      credentialId: "",
      credentialUrl: ""
    });
    setIsEditMode(false);
    setCurrentCertificateId(null);
  };

  // Open certificate form for editing
  const editCertificate = (certificate: CertificateData) => {
    setIsEditMode(true);
    setCurrentCertificateId(certificate.id || null);
    setCertificateForm({
      name: certificate.name || "",
      issuingOrganization: certificate.issuingOrganization || "",
      issueDate: certificate.issueDate ? new Date(certificate.issueDate) : null,
      expirationDate: certificate.expirationDate ? new Date(certificate.expirationDate) : null,
      neverExpires: certificate.neverExpires || false,
      credentialId: certificate.credentialId || "",
      credentialUrl: certificate.credentialUrl || ""
    });
    setIsCertificateDialogOpen(true);
  };

  // Handle save certificate
  const handleSaveCertificate = async () => {
    // Validate form
    if (!certificateForm.name || !certificateForm.issuingOrganization || !certificateForm.issueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isEditMode && currentCertificateId) {
        // Update existing certificate
        const { error, success } = await updateCertificate(currentCertificateId, {
          name: certificateForm.name,
          issuingOrganization: certificateForm.issuingOrganization,
          issueDate: certificateForm.issueDate || undefined,
          expirationDate: certificateForm.expirationDate,
          neverExpires: certificateForm.neverExpires,
          credentialId: certificateForm.credentialId || null,
          credentialUrl: certificateForm.credentialUrl || null
        });
        
        if (error) {
          throw new Error(error);
        }
        
        if (success) {
          toast({
            title: "Success",
            description: "Certificate updated successfully",
          });
        }
      } else {
        // Add new certificate
        const { error, success } = await addCertificate({
          name: certificateForm.name,
          issuingOrganization: certificateForm.issuingOrganization,
          issueDate: certificateForm.issueDate || undefined,
          expirationDate: certificateForm.expirationDate,
          neverExpires: certificateForm.neverExpires,
          credentialId: certificateForm.credentialId || null,
          credentialUrl: certificateForm.credentialUrl || null
        });
        
        if (error) {
          throw new Error(error);
        }
        
        if (success) {
          toast({
            title: "Success",
            description: "Certificate added successfully",
          });
        }
      }
      
      resetCertificateForm();
      setIsCertificateDialogOpen(false);
      await loadCertificates();
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save certificate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete certificate
  const handleDeleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error, success } = await deleteCertificate(id);
      
      if (error) {
        throw new Error(error);
      }
      
      if (success) {
        toast({
          title: "Success",
          description: "Certificate deleted successfully",
        });
        await loadCertificates();
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete certificate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Certificates</CardTitle>
          <CardDescription>
            Add your professional certifications and credentials
          </CardDescription>
        </div>
        <Button 
          onClick={() => {
            resetCertificateForm();
            setIsCertificateDialogOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Certificate
        </Button>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>No certificates added yet</p>
            <p className="text-sm">Add your professional certifications and credentials</p>
          </div>
        ) : (
          <div className="space-y-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="border rounded-lg p-5 relative">
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => editCertificate(certificate)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteCertificate(certificate.id as string)}
                  >
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                </div>
                
                <div className="flex justify-between items-start mb-3 pr-16">
                  <div>
                    <h3 className="font-medium text-lg">{certificate.name}</h3>
                    <p className="text-muted-foreground">{certificate.issuingOrganization}</p>
                  </div>
                  {certificate.neverExpires && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">No Expiration</Badge>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground mb-4 flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    Issued: {certificate.issueDate ? format(new Date(certificate.issueDate), 'MMM yyyy') : 'N/A'}
                    {!certificate.neverExpires && certificate.expirationDate && (
                      <> · Expires: {format(new Date(certificate.expirationDate), 'MMM yyyy')}</>
                    )}
                  </span>
                </div>
                
                {certificate.credentialId && (
                  <div className="text-sm mb-2">
                    <span className="font-medium">Credential ID:</span> {certificate.credentialId}
                  </div>
                )}
                
                {certificate.credentialUrl && (
                  <div>
                    <a 
                      href={certificate.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm flex items-center text-primary hover:underline"
                    >
                      <LinkIcon size={14} className="mr-1" /> View Credential
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Certificate Dialog */}
      <Dialog open={isCertificateDialogOpen} onOpenChange={setIsCertificateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update your certificate details" 
                : "Add details about your professional certification"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Certificate Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                value={certificateForm.name}
                onChange={handleCertificateChange}
                placeholder="e.g. AWS Certified Solutions Architect"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issuingOrganization">Issuing Organization <span className="text-destructive">*</span></Label>
              <Input
                id="issuingOrganization"
                name="issuingOrganization"
                value={certificateForm.issuingOrganization}
                onChange={handleCertificateChange}
                placeholder="e.g. Amazon Web Services"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !certificateForm.issueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {certificateForm.issueDate ? format(certificateForm.issueDate, "MMMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={certificateForm.issueDate || undefined}
                      onSelect={(date) => setCertificateForm(prev => ({ 
                        ...prev, 
                        issueDate: date || null 
                      }))}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1970}
                      toYear={2030}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="neverExpires" 
                      checked={certificateForm.neverExpires}
                      onCheckedChange={handleNeverExpiresChange}
                    />
                    <label 
                      htmlFor="neverExpires" 
                      className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      No expiration
                    </label>
                  </div>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        (!certificateForm.expirationDate || certificateForm.neverExpires) && "text-muted-foreground"
                      )}
                      disabled={certificateForm.neverExpires}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {certificateForm.neverExpires 
                        ? "No Expiration" 
                        : certificateForm.expirationDate 
                          ? format(certificateForm.expirationDate, "MMMM yyyy") 
                          : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={certificateForm.expirationDate || undefined}
                      onSelect={(date) => setCertificateForm(prev => ({ 
                        ...prev, 
                        expirationDate: date || null 
                      }))}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1970}
                      toYear={2030}
                      disabled={(date) => 
                        certificateForm.issueDate ? date < certificateForm.issueDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credentialId">Credential ID</Label>
              <Input
                id="credentialId"
                name="credentialId"
                value={certificateForm.credentialId}
                onChange={handleCertificateChange}
                placeholder="e.g. ABC123XYZ"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Credential URL</Label>
              <Input
                id="credentialUrl"
                name="credentialUrl"
                value={certificateForm.credentialUrl}
                onChange={handleCertificateChange}
                placeholder="e.g. https://www.credly.com/badges/example"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetCertificateForm();
                setIsCertificateDialogOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCertificate} disabled={isLoading}>
              {isLoading ? "Saving..." : isEditMode ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 