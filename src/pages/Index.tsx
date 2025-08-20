import { useState } from "react";
import DoctorHeader from "@/components/dashboard/DoctorHeader";
import PatientList from "@/components/dashboard/PatientList";
import ConsultationScreen from "@/components/dashboard/ConsultationScreen";
import PatientChat from "@/components/dashboard/PatientChat";

const Index = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <DoctorHeader />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Patient List - Left Panel */}
          <div className="lg:col-span-3">
            <PatientList onPatientSelect={setSelectedPatient} />
          </div>
          
          {/* Consultation Screen - Main Panel */}
          <div className="lg:col-span-6 overflow-y-auto">
            <ConsultationScreen selectedPatient={selectedPatient} />
          </div>
          
          {/* Patient Chat - Right Panel */}
          <div className="lg:col-span-3">
            <PatientChat selectedPatient={selectedPatient} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;