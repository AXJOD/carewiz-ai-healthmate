import { useState } from "react";
import { Send, Mic, FileText, Brain, Download, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const ConsultationScreen = ({ selectedPatient }: { selectedPatient: any }) => {
  const [symptoms, setSymptoms] = useState("");
  const [aiNotes, setAiNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [dischargeSummary, setDischargeSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSOAPNotes = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please enter symptoms",
        description: "Add patient symptoms to generate SOAP notes",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      const mockSOAP = `SUBJECTIVE:
Patient reports: ${symptoms}
Pain level: 6/10
Duration: 3 days
Associated symptoms: Mild fatigue

OBJECTIVE:
Vital Signs: BP 140/90, HR 78, Temp 98.6°F
Physical Exam: Alert and oriented, no acute distress
Relevant findings noted during examination

ASSESSMENT:
Primary diagnosis consideration based on presented symptoms
Need for further diagnostic evaluation
Risk stratification: Moderate

PLAN:
1. Diagnostic tests as clinically indicated
2. Symptomatic treatment
3. Follow-up in 1 week
4. Patient education provided
5. Return precautions discussed`;

      setAiNotes(mockSOAP);
      setIsGenerating(false);
      toast({
        title: "SOAP Notes Generated",
        description: "AI-powered clinical notes are ready for review",
      });
    }, 2000);
  };

  const generateDiagnosis = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please enter symptoms",
        description: "Add patient symptoms to generate diagnosis suggestions",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const mockDiagnosis = `AI DIAGNOSIS SUGGESTIONS:

Primary Considerations:
• Hypertensive crisis (High probability)
• Anxiety disorder with somatic symptoms (Moderate)
• Medication side effects (Low-moderate)

Differential Diagnosis:
• Essential hypertension
• Secondary hypertension
• White coat syndrome
• Panic disorder

Recommended Actions:
• Blood pressure monitoring
• ECG evaluation
• Basic metabolic panel
• Consider cardiology referral

Confidence Level: 78%
Risk Assessment: Moderate to High`;

      setDiagnosis(mockDiagnosis);
      setIsGenerating(false);
      toast({
        title: "Diagnosis Generated",
        description: "AI analysis complete with recommendations",
      });
    }, 2500);
  };

  const generateDischargeSummary = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockSummary = `DISCHARGE SUMMARY

Patient: ${selectedPatient?.name || 'Patient'}
Date: ${new Date().toLocaleDateString()}
Attending: Dr. Sarah Johnson

ADMISSION DIAGNOSIS: ${selectedPatient?.condition || 'Primary condition'}

HOSPITAL COURSE:
Patient presented with reported symptoms and underwent comprehensive evaluation. Clinical management included symptomatic treatment and monitoring. Patient showed stable improvement during observation period.

DISCHARGE CONDITION: Stable, improved

DISCHARGE MEDICATIONS:
• Continue current medications as prescribed
• New prescriptions as clinically indicated

FOLLOW-UP:
• Primary care physician in 1-2 weeks
• Return for worsening symptoms
• Lifestyle modifications discussed

PATIENT EDUCATION:
Comprehensive discharge instructions provided and understood.

Electronically signed by: Dr. Sarah Johnson, MD`;

      setDischargeSummary(mockSummary);
      setIsGenerating(false);
      toast({
        title: "Discharge Summary Generated",
        description: "Complete summary ready for patient records",
      });
    }, 1500);
  };

  if (!selectedPatient) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Select a Patient</h3>
          <p className="text-muted-foreground">
            Choose a patient from the list to start consultation
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Info Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={selectedPatient.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {selectedPatient.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{selectedPatient.age} years</span>
                <span>{selectedPatient.gender}</span>
                <Badge variant="outline">{selectedPatient.condition}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Consultation Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mic className="h-5 w-5 mr-2 text-primary" />
            Patient Symptoms & Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter patient symptoms, complaints, and clinical observations..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-32"
          />
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={generateSOAPNotes}
              disabled={isGenerating}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {isGenerating ? "Generating..." : "Generate SOAP Notes"}
            </Button>
            <Button 
              onClick={generateDiagnosis}
              disabled={isGenerating}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Brain className="h-4 w-4 mr-1" />
              AI Diagnosis
            </Button>
            <Button 
              onClick={generateDischargeSummary}
              disabled={isGenerating}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <FileText className="h-4 w-4 mr-1" />
              Discharge Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Generated Content */}
      {aiNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                SOAP Notes
              </span>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg font-mono">
              {aiNotes}
            </pre>
          </CardContent>
        </Card>
      )}

      {diagnosis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                AI Diagnosis Suggestions
              </span>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg font-mono">
              {diagnosis}
            </pre>
          </CardContent>
        </Card>
      )}

      {dischargeSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-accent" />
                Discharge Summary
              </span>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg font-mono">
              {dischargeSummary}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsultationScreen;