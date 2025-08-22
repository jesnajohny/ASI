//components\hire-flow.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X, Bot, Megaphone, Handshake, Group, UserCheck, Settings, Check, ChevronRight, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

// Define a specific type for employee keys
type EmployeeRole = 'HR Manager' | 'Social Media Marketer' | 'Sales Assistant' | 'Scrum Master' | 'Virtual Assistant' | 'Operations Associate';

const employeeTypes: Record<EmployeeRole, {
  icon: React.ReactNode;
  tasks: string[];
  bgColor: string;
  accentColor: string;
  tasksPreview: string[];
  description: string;
}> = {
  'HR Manager': {
    icon: <Bot className="w-6 h-6" />,
    tasks: ['Screen resumes and schedule interviews', 'Onboard new employees and manage paperwork', 'Administer employee benefits and payroll', 'Track vacation and sick leave', 'Conduct performance reviews', 'Ensure compliance with labor laws'],
    bgColor: 'bg-pink-50',
    accentColor: 'text-pink-600',
    tasksPreview: ['Onboard new employees and manage paperwork', 'Administer employee benefits and payroll', 'Conduct performance reviews and feedback sessions'],
    description: 'Streamline your HR processes with automated employee management',
  },
  'Social Media Marketer': {
    icon: <Megaphone className="w-6 h-6" />,
    tasks: ['Generate content ideas and write copy', 'Design graphics and short videos', 'Schedule posts across all platforms', 'Engage with followers and respond to comments', 'Analyze social media metrics and report on performance', 'Run and monitor ad campaigns'],
    bgColor: 'bg-amber-50',
    accentColor: 'text-amber-600',
    tasksPreview: ['Generate content ideas and write engaging copy', 'Schedule posts across all social platforms', 'Analyze metrics and optimize performance'],
    description: 'Boost your social presence with consistent, engaging content',
  },
  'Sales Assistant': {
    icon: <Handshake className="w-6 h-6" />,
    tasks: ['Qualify new leads from web forms', 'Schedule discovery calls and demos', 'Follow up with prospects via email', 'Prepare sales reports and forecasts', 'Update CRM with customer information', 'Handle initial customer inquiries'],
    bgColor: 'bg-blue-50',
    accentColor: 'text-blue-600',
    tasksPreview: ['Qualify leads and schedule discovery calls', 'Follow up with prospects via personalized emails', 'Update CRM with detailed customer information'],
    description: 'Accelerate your sales pipeline with intelligent lead management',
  },
  'Scrum Master': {
    icon: <Group className="w-6 h-6" />,
    tasks: ['Facilitate daily stand-up meetings', 'Organize and lead sprint planning sessions', 'Remove impediments blocking the team', 'Track and report on sprint progress', 'Coach team members on Agile practices', 'Protect the team from outside distractions'],
    bgColor: 'bg-emerald-50',
    accentColor: 'text-emerald-600',
    tasksPreview: ['Facilitate daily stand-ups and sprint planning', 'Remove impediments and unblock team progress', 'Track sprint progress and team velocity'],
    description: 'Optimize your agile workflow with expert process management',
  },
  'Virtual Assistant': {
    icon: <UserCheck className="w-6 h-6" />,
    tasks: ['Manage and organize email inboxes', 'Schedule appointments and manage calendars', 'Make travel arrangements and bookings', 'Perform data entry and file organization', 'Conduct online research', 'Handle customer service emails'],
    bgColor: 'bg-orange-50',
    accentColor: 'text-orange-600',
    tasksPreview: ['Manage emails and organize your inbox efficiently', 'Schedule appointments and coordinate meetings', 'Handle data entry and administrative tasks'],
    description: 'Free up your time with comprehensive administrative support',
  },
  'Operations Associate': {
    icon: <Settings className="w-6 h-6" />,
    tasks: ['Document and optimize internal processes', 'Manage inventory and supply chain logistics', 'Generate operational reports and analyze data', 'Ensure quality control standards are met', 'Coordinate between different departments', 'Handle vendor and supplier communications'],
    bgColor: 'bg-purple-50',
    accentColor: 'text-purple-600',
    tasksPreview: ['Document and optimize internal processes', 'Manage inventory and supply chain logistics', 'Generate operational reports and data analysis'],
    description: 'Streamline operations with systematic process optimization',
  },
};

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = ['Setup Workspace', 'Select Role', 'Define Tasks'];
  const progressPercentage = currentStep === 1 ? 0 : ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div id="progress-indicator-container" className="w-full px-2 sm:px-8 mb-16">
      <div className="relative flex items-center justify-between">
        <div id="progress-bar-track" className="absolute top-1/3 left-0 w-full h-1 -translate-y-1/2 bg-muted rounded-full">
          <motion.div
            id="progress-bar-fill"
            className="h-full bg-primary-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>
        
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          
          return (
            <div key={step} id={`progress-step-${stepNumber}-container`} className="relative z-10 flex flex-col items-center">
              <motion.div
                id={`progress-step-${stepNumber}-circle`}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold border-2"
                animate={isActive ? "active" : "inactive"}
                variants={{
                  active: {
                    backgroundImage: "linear-gradient(135deg, #f87171, #fb923c, #fbbf24, #a3e635, #4ade80, #34d399, #2dd4bf, #22d3ee, #38bdf8, #60a5fa, #818cf8, #a78bfa, #c084fc, #e879f9, #f472b6)",
                    borderColor: "transparent",
                    color: "hsl(var(--primary-foreground))"
                  },
                  inactive: {
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--muted-foreground))"
                  }
                }}
                transition={{ duration: 0.3 }}
              >
                {stepNumber}
              </motion.div>
              <motion.div>
                <p id={`progress-step-${stepNumber}-label`} className={`mt-2 text-xs font-semibold text-center ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


export default function HireFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [employeeType, setEmployeeType] = useState<EmployeeRole | ''>('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [customTask, setCustomTask] = useState('');
  const [workspaceData, setWorkspaceData] = useState({
    workspaceName: '',
    companyName: '',
    websiteUrl: '',
    teamSize: '',
    currentAiEmployees: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1 }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleEmployeeSelect = (type: EmployeeRole) => {
    setEmployeeType(type);
    setSelectedTasks(employeeTypes[type].tasks.slice(0, 3));
    setStep(3);
  };

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

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkspaceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof workspaceData) => (value: string) => {
    setWorkspaceData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

   const handleHire = async () => {
    console.log("Attempting to hire...");
    if (!user) {
      console.error("No user found. Aborting hire.");
      setError("You must be logged in to hire an employee.");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      let companyId: string;

      // Step 1: Check if a company with this name already exists for the user.
      // We remove .single() to handle cases where 0 rows are returned.
      console.log("Checking for existing company:", workspaceData.companyName);
      const { data: existingCompanies, error: fetchError } = await supabase
        .from('companies')
        .select('id')
        .eq('company_name', workspaceData.companyName)
        .eq('user_id', user.id);
      
      if (fetchError) throw fetchError;

      if (existingCompanies && existingCompanies.length > 0) {
        // If the company exists, use its ID.
        companyId = existingCompanies[0].id;
        console.log("Existing company found:", companyId);
      } else {
        // Step 2: If the company doesn't exist, create it.
        // .single() is safe here because we are creating and immediately selecting one row.
        console.log("No existing company found. Creating new one.");
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert({user_id: user.id,company_name: workspaceData.companyName})
          .select('id')
          .single();

        if (companyError) throw companyError;
        companyId = newCompany.id;
        console.log("New company created:", companyId);
      }

      // Step 3: Insert into the workspaces table
      console.log("Creating workspace...");
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          user_id: user.id,
          company_id: companyId, // Link to the company
          workspace_name: workspaceData.workspaceName,
          website_url: workspaceData.websiteUrl,
          team_size: workspaceData.teamSize,
          current_ai_employees: workspaceData.currentAiEmployees,
        })
        .select('id')
        .single();

      if (workspaceError) throw workspaceError;
      const workspaceId = workspace.id;
      console.log("Workspace created:", workspaceId);


      // Step 4: Insert into the employees table
      const { error: employeeError } = await supabase
        .from('employees')
        .insert({
          user_id: user.id,
          workspace_id: workspaceId,
          employee_type: employeeType,
          tasks: selectedTasks,
          name: employeeType,
        });

      if (employeeError) throw employeeError;
      console.log("Employee created successfully.");
      
      // Step 5: Redirect to the correct dashboard URL
      console.log(`All data saved. Refreshing router and redirecting to: /dashboard/${companyId}/${workspaceId}`);
      router.refresh(); // Refresh server components
      router.push(`/dashboard/${companyId}/${workspaceId}`);

    } catch (error: any) {
      console.error("Error during hire process:", error);
      setError(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const userName = user?.user_metadata.full_name?.split(' ')[0] || 'there';

  return (
    // ... JSX for the component remains the same ...
    <div id="hire-flow-page-container" className="min-h-screen bg-gray-50 text-foreground flex items-center justify-center p-4">
      <div id="hire-flow-main-card" className="w-full max-w-7xl mx-auto p-8 sm:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            id={`step-${step}-content-wrapper`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {step > 0 && <ProgressIndicator currentStep={step} />}

            {step === 1 && (
              <div id="step-1-workspace-setup" className="text-center">
                <h2 id="workspace-setup-heading" className="text-3xl font-bold mb-4">
                  Welcome, {userName}! Let's set up your workspace.
                </h2>
                <p id="workspace-setup-subheading" className="text-muted-foreground mb-8">
                  Tell us a bit about your company to personalize your experience.
                </p>

                <div id="workspace-form" className="space-y-4 max-w-md mx-auto text-left">
                  <div id="workspace-name-field">
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="workspaceName">
                      Workspace Name
                    </label>
                    <Input
                      id="workspaceName"
                      name="workspaceName"
                      value={workspaceData.workspaceName}
                      onChange={handleWorkspaceChange}
                      placeholder="e.g., Marketing Team"
                      className="mt-1"
                    />
                  </div>
                  
                  <div id="company-name-field">
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="companyName">
                      Company Name
                    </label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={workspaceData.companyName}
                      onChange={handleWorkspaceChange}
                      placeholder="e.g., Stark Industries"
                      className="mt-1"
                    />
                  </div>

                  <div id="website-url-field">
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="websiteUrl">
                      Website URL
                    </label>
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      value={workspaceData.websiteUrl}
                      onChange={handleWorkspaceChange}
                      placeholder="e.g., www.starkindustries.com"
                      className="mt-1"
                    />
                  </div>

                  <div id="team-size-field">
                    <label className="text-sm font-medium text-muted-foreground">
                      Team Size
                    </label>
                    <Select onValueChange={handleSelectChange('teamSize')} value={workspaceData.teamSize}>
                      <SelectTrigger id="team-size-select-trigger" className="w-full mt-1">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 members</SelectItem>
                        <SelectItem value="11-50">11-50 members</SelectItem>
                        <SelectItem value="51-200">51-200 members</SelectItem>
                        <SelectItem value="201+">201+ members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div id="ai-employees-field">
                    <label className="text-sm font-medium text-muted-foreground">
                      How many AI employees or automations do you currently use?
                    </label>
                    <Select onValueChange={handleSelectChange('currentAiEmployees')} value={workspaceData.currentAiEmployees}>
                      <SelectTrigger id="ai-employees-select-trigger" className="w-full mt-1">
                        <SelectValue placeholder="Select a range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        <SelectItem value="1-5">1-5</SelectItem>
                        <SelectItem value="6-10">6-10</SelectItem>
                        <SelectItem value="10+">More than 10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <p id="error-message-container" className="mt-6 text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>
            )}
            
            {step === 2 && (
              <div id="step-2-role-selection" className="text-center">
                 <h2 id="role-selection-heading" className="text-3xl font-bold text-center mb-2">
                  What type of AI employee do you want to hire?
                </h2>
                <p id="role-selection-subheading" className="text-muted-foreground text-center mb-8">
                  You can add more team members later.
                </p>
                <motion.div
                  id="employee-card-grid"
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto"
                  variants={cardContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {(Object.keys(employeeTypes) as EmployeeRole[]).map((type) => {
                    const { icon, bgColor, accentColor, tasksPreview, description } = employeeTypes[type];
                    const cardId = `employee-card-${type.toLowerCase().replace(/\s+/g, '-')}`;

                    return (
                      <motion.div
                        key={type}
                        id={cardId}
                        variants={cardVariants}
                        onClick={() => handleEmployeeSelect(type)}
                        className={`group relative ${bgColor} border border-gray-200 rounded-2xl p-8 text-left cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 bg-white`}
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight">{type}</h3>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed">{description}</p>
                          </div>
                          <div className={`${accentColor} ml-4 p-3 rounded-xl ${bgColor} flex-shrink-0`}>
                            {icon}
                          </div>
                        </div>
                        <div className="space-y-3 mb-6">
                          {tasksPreview.map((task) => (
                            <div key={task} className="flex items-start text-sm text-gray-700">
                              <ChevronRight className="w-4 h-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
                              <span className="leading-relaxed">{task}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center text-sm font-semibold group-hover:text-gray-900 transition-colors duration-200">
                          <span className={accentColor}>Add to team</span>
                        </div>
                        <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-5 rounded-2xl transition-all duration-300" />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}

            {step === 3 && employeeType && (
              <div id="step-3-task-definition">
                <h2 id="task-definition-heading" className="text-3xl font-bold text-center mb-2">
                  What will your {employeeType} focus on?
                </h2>
                <p id="task-definition-subheading" className="text-muted-foreground text-center mb-8">
                  Select the primary tasks. You can customize these at any time.
                </p>

                <div id="task-selection-list" className="space-y-3 max-w-lg mx-auto">
                  {employeeTypes[employeeType].tasks.map((task: string) => {
                    const isSelected = selectedTasks.includes(task);
                    const taskId = task.toLowerCase().replace(/\s+/g, '-');

                    return (
                      <motion.div
                        key={task}
                        id={`task-item-${taskId}`}
                        onClick={() => handleTaskChange(task)}
                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          id={`task-checkbox-${taskId}`}
                          className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-primary-gradient border-transparent' : 'border-border'}`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span
                          id={`task-label-${taskId}`}
                          className={`font-medium leading-none ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}
                        >
                          {task}
                        </span>
                      </motion.div>
                    );
                  })}

                  <div id="custom-task-input-container" className="flex items-center space-x-2 pt-4">
                    <Input
                      id="custom-task-input"
                      placeholder="Add a custom task"
                      value={customTask}
                      onChange={(e) => setCustomTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
                    />
                    <Button
                      id="add-custom-task-button"
                      onClick={addCustomTask}
                      className="bg-primary-gradient text-primary-foreground"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div id="navigation-controls" className="flex justify-between items-center mt-10 pt-6 border-t border-border">
          {step > 1 ? (
            <Button
              id="back-button"
              onClick={prevStep}
              variant="outline"
            >
              Back
            </Button>
          ) : (
            <div /> // Placeholder to keep "Continue" button on the right
          )}

          {step < 3 ? (
            <Button
              id="continue-button"
              onClick={nextStep}
              className="bg-primary-gradient text-primary-foreground"
            >
              Continue
            </Button>
          ) : (
            <Button
              id="complete-setup-button"
              className="bg-primary-gradient text-primary-foreground"
              onClick={handleHire}
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : 'Complete Setup & Hire'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}