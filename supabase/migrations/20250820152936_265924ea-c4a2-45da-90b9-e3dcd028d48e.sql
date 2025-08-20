-- Create patients table
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  medical_history TEXT,
  phone TEXT,
  email TEXT,
  emergency_contact JSON,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consultations table
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  symptoms TEXT NOT NULL,
  ai_notes TEXT,
  ai_diagnosis TEXT,
  discharge_summary TEXT,
  consultation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  doctor_notes TEXT,
  status TEXT DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Create policies for patients (for demo, allow all authenticated users to read/write)
CREATE POLICY "Allow authenticated users to view patients" 
ON public.patients 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert patients" 
ON public.patients 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update patients" 
ON public.patients 
FOR UPDATE 
TO authenticated 
USING (true);

-- Create policies for consultations
CREATE POLICY "Allow authenticated users to view consultations" 
ON public.consultations 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert consultations" 
ON public.consultations 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update consultations" 
ON public.consultations 
FOR UPDATE 
TO authenticated 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at
BEFORE UPDATE ON public.consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample patient data
INSERT INTO public.patients (name, age, gender, medical_history, phone, email, emergency_contact) VALUES
('Sarah Johnson', 34, 'female', 'Hypertension, Type 2 Diabetes diagnosed 2019. Allergic to penicillin. Previous surgery: appendectomy 2015.', '+1-555-0123', 'sarah.johnson@email.com', '{"name": "John Johnson", "relationship": "spouse", "phone": "+1-555-0124"}'),
('Michael Rodriguez', 45, 'male', 'Chronic back pain, herniated disc L4-L5. History of smoking (quit 2020). No known allergies.', '+1-555-0125', 'michael.rodriguez@email.com', '{"name": "Maria Rodriguez", "relationship": "wife", "phone": "+1-555-0126"}'),
('Emily Chen', 28, 'female', 'Asthma since childhood, well-controlled with inhaler. No other significant medical history.', '+1-555-0127', 'emily.chen@email.com', '{"name": "David Chen", "relationship": "brother", "phone": "+1-555-0128"}'),
('Robert Williams', 67, 'male', 'Coronary artery disease, stent placement 2018. High cholesterol, on statins. History of stroke 2020 (recovered).', '+1-555-0129', 'robert.williams@email.com', '{"name": "Margaret Williams", "relationship": "wife", "phone": "+1-555-0130"}'),
('Jessica Martinez', 31, 'female', 'Migraine headaches, occurs 2-3 times per month. Lactose intolerant. Previous pregnancies: 2 (normal deliveries).', '+1-555-0131', 'jessica.martinez@email.com', '{"name": "Carlos Martinez", "relationship": "husband", "phone": "+1-555-0132"}');

-- Insert sample consultation data
INSERT INTO public.consultations (patient_id, symptoms, ai_notes, ai_diagnosis, doctor_notes, status) VALUES
(
  (SELECT id FROM public.patients WHERE name = 'Sarah Johnson'),
  'Persistent cough for 2 weeks, mild fever, fatigue, and shortness of breath during physical activity.',
  'SOAP NOTES:\nSubjective: Patient reports persistent dry cough x2 weeks, low-grade fever (99-100°F), fatigue, and dyspnea on exertion. Denies chest pain, night sweats, or weight loss.\nObjective: Temp 99.2°F, BP 142/88, HR 78, RR 18, O2 sat 97% on room air. Lungs: decreased breath sounds bilateral bases, no wheeze or rales.\nAssessment: Likely viral upper respiratory infection vs. early pneumonia. Consider diabetes management optimization.\nPlan: Chest X-ray, CBC, comprehensive metabolic panel. Supportive care, follow-up in 3-5 days.',
  'Primary: Viral upper respiratory infection\nDifferential: Community-acquired pneumonia, Acute bronchitis\nRecommendations: Chest imaging, laboratory studies, symptomatic treatment',
  'Patient appears stable but concerned about symptoms. Discussed diabetes management and importance of follow-up.',
  'ongoing'
),
(
  (SELECT id FROM public.patients WHERE name = 'Michael Rodriguez'),
  'Severe lower back pain radiating to left leg, numbness in left foot, difficulty walking.',
  'SOAP NOTES:\nSubjective: Patient reports acute exacerbation of chronic low back pain with new left leg radiation and foot numbness. Pain 8/10, worse with movement.\nObjective: Antalgic gait, limited lumbar flexion, positive straight leg raise test left side. Diminished sensation L5 distribution.\nAssessment: Lumbar radiculopathy, likely L4-L5 disc herniation exacerbation.\nPlan: MRI lumbar spine, NSAIDs, physical therapy referral, neurosurgery consultation if no improvement.',
  'Primary: Lumbar radiculopathy (L5 nerve root involvement)\nDifferential: Disc herniation exacerbation, Spinal stenosis\nRecommendations: Advanced imaging, pain management, specialist referral',
  'Discussed surgical vs conservative management options. Patient prefers conservative approach initially.',
  'ongoing'
),
(
  (SELECT id FROM public.patients WHERE name = 'Emily Chen'),
  'Worsening asthma symptoms, increased inhaler use, chest tightness, and wheezing at night.',
  'SOAP NOTES:\nSubjective: Patient reports worsening asthma control over past month, using rescue inhaler 4-5x daily, nocturnal symptoms affecting sleep.\nObjective: Mild expiratory wheeze bilateral, peak flow 320 L/min (baseline 420). No acute distress.\nAssessment: Poorly controlled asthma, possible trigger exposure or medication non-adherence.\nPlan: Peak flow monitoring, controller medication adjustment, allergy testing, asthma action plan review.',
  'Primary: Poorly controlled asthma\nDifferential: Environmental trigger exposure, Medication non-adherence, GERD-induced asthma\nRecommendations: Controller therapy optimization, trigger identification, patient education',
  'Reviewed proper inhaler technique. Discussed environmental triggers and importance of controller medication.',
  'completed'
);