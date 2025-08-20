import { useState } from "react";
import { Search, Plus, Calendar, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock patient data
const mockPatients = [
  {
    id: 1,
    name: "Emily Rodriguez",
    age: 34,
    gender: "Female",
    condition: "Hypertension",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-01-22",
    priority: "medium",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 45,
    gender: "Male",
    condition: "Diabetes Type 2",
    lastVisit: "2024-01-14",
    nextAppointment: "2024-01-21",
    priority: "high",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Sarah Williams",
    age: 28,
    gender: "Female",
    condition: "Anxiety",
    lastVisit: "2024-01-13",
    nextAppointment: "2024-01-20",
    priority: "low",
    avatar: "/placeholder.svg"
  },
  {
    id: 4,
    name: "David Johnson",
    age: 67,
    gender: "Male",
    condition: "Arthritis",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-01-25",
    priority: "medium",
    avatar: "/placeholder.svg"
  }
];

const PatientList = ({ onPatientSelect }: { onPatientSelect: (patient: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient.id);
    onPatientSelect(patient);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-orange-500 text-white";
      case "low": return "bg-accent text-accent-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Patient List</span>
          <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2 max-h-96 overflow-y-auto p-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handlePatientClick(patient)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedPatient === patient.id 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={patient.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">
                      {patient.name}
                    </h3>
                    <Badge className={getPriorityColor(patient.priority)}>
                      {patient.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {patient.age} years, {patient.gender}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {patient.condition}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Last: {patient.lastVisit}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Next: {patient.nextAppointment}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientList;