'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const employeeTypes: Record<string, string[]> = {
  'HR Manager': ['Onboarding new employees', 'Managing payroll', 'Handling employee benefits', 'Conducting performance reviews'],
  'Social Media Marketer': ['Creating social media content', 'Scheduling posts', 'Analyzing social media metrics', 'Engaging with followers'],
  'Sales Assistant': ['Following up on leads', 'Scheduling meetings', 'Preparing sales reports', 'Managing customer relationships'],
  'Scrum Master': ['Facilitating daily stand-ups', 'Removing impediments', 'Tracking sprint progress', 'Coaching the team on Agile practices'],
};

export default function HireFlow() {
  const [step, setStep] = useState(1);
  const [employeeType, setEmployeeType] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [customTask, setCustomTask] = useState('');

  const handleTaskChange = (task: string) => {
    setSelectedTasks(prev => 
      prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
    );
  };

  const addCustomTask = () => {
    if (customTask.trim() && !selectedTasks.includes(customTask.trim())) {
      setSelectedTasks(prev => [...prev, customTask.trim()]);
      setCustomTask('');
    }
  };

  const removeTask = (task: string) => {
    setSelectedTasks(prev => prev.filter(t => t !== task));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-sans">
      <motion.div 
        className="w-full max-w-2xl mx-auto bg-card p-8 rounded-2xl border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div>
                <h2 className="text-3xl font-bold text-center mb-4">Hire Your New AI Employee</h2>
                <p className="text-muted-foreground text-center mb-8">Let's get started by selecting the type of AI employee you need.</p>
                <div className="flex flex-col items-center">
                  <Select onValueChange={setEmployeeType}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select Employee Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(employeeTypes).map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-center mb-4">Define Primary Tasks</h2>
                <p className="text-muted-foreground text-center mb-8">Select the primary tasks for your {employeeType}.</p>
                <div className="space-y-4">
                  {employeeTypes[employeeType]?.map((task: string) => (
                    <div key={task} className="flex items-center space-x-2">
                      <Checkbox id={task} checked={selectedTasks.includes(task)} onCheckedChange={() => handleTaskChange(task)} />
                      <label htmlFor={task} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {task}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 pt-4">
                    <Input 
                      placeholder="Add a custom task" 
                      value={customTask} 
                      onChange={(e) => setCustomTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
                    />
                    <Button onClick={addCustomTask}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {selectedTasks.map((task: string) => (
                      <Badge key={task} variant="secondary" className="flex items-center gap-2">
                        {task}
                        <button onClick={() => removeTask(task)} className="rounded-full hover:bg-muted">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
             {step === 3 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Confirmation</h2>
                <p className="text-muted-foreground mb-8">You're about to hire an AI {employeeType} with the following tasks:</p>
                <ul className="text-left mx-auto max-w-md list-disc pl-5 space-y-2">
                  {selectedTasks.map((task: string) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between items-center mt-8">
          {step > 1 && (
            <Button onClick={prevStep} variant="outline">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={nextStep} className="ml-auto">
              Continue
            </Button>
          ) : (
            <Button className="w-full">
              Hire AI Employee
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}