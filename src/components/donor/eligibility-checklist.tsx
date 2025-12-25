"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"; // We need to create checkbox first or use native input
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // We need label too
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

export function EligibilityChecklist({ onComplete }: { onComplete: (eligible: boolean) => void }) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { id: "age", text: "Are you between 18 and 65 years old?" },
    { id: "weight", text: "Do you weigh at least 50 kg (110 lbs)?" },
    { id: "health", text: "Are you in good general health today?" },
    { id: "tattoo", text: "Have you had a tattoo or piercing in the last 12 months?" },
    { id: "travel", text: "Have you traveled to a malaria-risk country in the last year?" },
    { id: "medication", text: "Are you currently taking any antibiotics?" },
  ];

  // Logic: 
  // Positive questions (should be yes): age, weight, health
  // Negative questions (should be no): tattoo, travel, medication
  const requiredAnswers: Record<string, boolean> = {
    age: true,
    weight: true,
    health: true,
    tattoo: false,
    travel: false,
    medication: false,
  };

  const isEligible = questions.every((q) => answers[q.id] === requiredAnswers[q.id]);

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete(isEligible);
  };

  return (
    <div className="space-y-6">
      {!submitted ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please answer the following questions truthfully to check your eligibility.
          </p>
          {questions.map((q) => (
            <div key={q.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
              <div className="flex gap-4 items-center flex-1">
                <span className="text-sm font-medium">{q.text}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAnswers(p => ({ ...p, [q.id]: true }))}
                  className={`px-3 py-1 text-xs rounded-md border ${answers[q.id] === true ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setAnswers(p => ({ ...p, [q.id]: false }))}
                  className={`px-3 py-1 text-xs rounded-md border ${answers[q.id] === false ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
          <Button 
            onClick={handleSubmit} 
            className="w-full" 
            disabled={Object.keys(answers).length < questions.length}
          >
            Check Eligibility
          </Button>
        </div>
      ) : (
        <div className={`p-6 rounded-lg text-center ${isEligible ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"}`}>
          <div className="flex justify-center mb-4">
            {isEligible ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <AlertCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          <h3 className="text-lg font-bold mb-2">
            {isEligible ? "You appear to be eligible!" : "You may not be eligible"}
          </h3>
          <p className="text-sm opacity-90 mb-4">
            {isEligible 
              ? "Based on your answers, you meet the basic criteria. A final screening will be done at the center."
              : "Based on your answers, you may not be able to donate at this time. Please consult a doctor for more details."}
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)} className="bg-transparent border-current opacity-50 hover:opacity-100">
            Check Again
          </Button>
        </div>
      )}
    </div>
  );
}
