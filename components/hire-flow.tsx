'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X, Bot, Megaphone, Handshake, Group, UserCheck, Settings, Check } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';

// Define a specific type for employee keys
type EmployeeRole = 'HR Manager' | 'Social Media Marketer' | 'Sales Assistant' | 'Scrum Master' | 'Virtual Assistant' | 'Operations Associate';

const employeeTypes: Record<EmployeeRole, { description: string; icon: JSX.Element; tasks: string[] }> = {
  'HR Manager': {
    description: 'Automate onboarding, payroll, and performance reviews.',
    icon: <Bot className="w-10 h-10 text-purple-400" />,
    tasks: ['Screen resumes and schedule interviews', 'Onboard new employees and manage paperwork', 'Administer employee benefits and payroll', 'Track vacation and sick leave', 'Conduct performance reviews', 'Ensure compliance with labor laws'],
  },
  'Social Media Marketer': {
    description: 'Create content, schedule posts, and analyze metrics.',
    icon: <Megaphone className="w-10 h-10 text-pink-400" />,
    tasks: ['Generate content ideas and write copy', 'Design graphics and short videos', 'Schedule posts across all platforms', 'Engage with followers and respond to comments', 'Analyze social media metrics and report on performance', 'Run and monitor ad campaigns'],
  },
  'Sales Assistant': {
    description: 'Follow up on leads, schedule meetings, and manage relations.',
    icon: <Handshake className="w-10 h-10 text-blue-400" />,
    tasks: ['Qualify new leads from web forms', 'Schedule discovery calls and demos', 'Follow up with prospects via email', 'Prepare sales reports and forecasts', 'Update CRM with customer information', 'Handle initial customer inquiries'],
  },
  'Scrum Master': {
    description: 'Facilitate stand-ups, remove impediments, and track sprints.',
    icon: <Group className="w-10 h-10 text-green-400" />,
    tasks: ['Facilitate daily stand-up meetings', 'Organize and lead sprint planning sessions', 'Remove impediments blocking the team', 'Track and report on sprint progress', 'Coach team members on Agile practices', 'Protect the team from outside distractions'],
  },
  'Virtual Assistant': {
    description: 'Manage emails, schedules, and administrative tasks.',
    icon: <UserCheck className="w-10 h-10 text-orange-400" />,
    tasks: ['Manage and organize email inboxes', 'Schedule appointments and manage calendars', 'Make travel arrangements and bookings', 'Perform data entry and file organization', 'Conduct online research', 'Handle customer service emails'],
  },
  'Operations Associate': {
    description: 'Streamline processes, manage inventory, and analyze data.',
    icon: <Settings className="w-10 h-10 text-sky-400" />,
    tasks: ['Document and optimize internal processes', 'Manage inventory and supply chain logistics', 'Generate operational reports and analyze data', 'Ensure quality control standards are met', 'Coordinate between different departments', 'Handle vendor and supplier communications'],
  },
};

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Select Role', 'Define Tasks', 'Setup Workspace'];
    const progressPercentage = currentStep === 1 ? 0 : ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="w-full px-2 sm:px-8 mb-16">
            <div className="relative flex items-center justify-between">
                <div className="absolute top-1/3 left-0 w-full h-1 -translate-y-1/2 bg-muted rounded-full">
                    <motion.div
                        className="h-full bg-primary-gradient rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                </div>
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = currentStep >= stepNumber;
                    return (
                        <div key={step} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold border-2"
                                animate={isActive ? "active" : "inactive"}
                                variants={{
                                    active: { 
                                        backgroundImage: "linear-gradient(135deg, #f87171, #fb923c, #fbbf24, #a3e635, #4ade80, #34d399, #2dd4bf, #22d3ee, #38bdf8, #60a5fa, #818cf8, #a78bfa, #c084fc, #e879f9, #f472b6)", 
                                        borderColor: "linear-gradient(135deg, #f87171, #fb923c, #fbbf24, #a3e635, #4ade80, #34d399, #2dd4bf, #22d3ee, #38bdf8, #60a5fa, #818cf8, #a78bfa, #c084fc, #e879f9, #f472b6)", 
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
                            <p className={`mt-2 text-xs font-semibold text-center ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</p>
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
    companyName: '',
    websiteUrl: '',
    teamSize: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setStep(2);
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
  
  const handleTeamSizeChange = (value: string) => {
      setWorkspaceData(prev => ({ ...prev, teamSize: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleHire = async () => {
    if (!user) {
        setError("You must be logged in to hire an employee.");
        return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('employees')
        .insert([
          { 
            user_id: user.id, 
            employee_type: employeeType, 
            tasks: selectedTasks,
            company_name: workspaceData.companyName,
            website_url: workspaceData.websiteUrl,
            team_size: workspaceData.teamSize,
          },
        ]);

      if (error) throw error;
      
      router.push('/dashboard'); 

    } catch (error: any) {
      setError(error.message);
    } finally {
        setIsLoading(false);
    }
  };
  
  const cardContainerVariants = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
          }
      }
  };

  const cardVariants = {
      hidden: { y: 20, opacity: 0, scale: 0.95 },
      visible: { y: 0, opacity: 1, scale: 1 }
  };

  const userName = user?.user_metadata.full_name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto p-8 sm:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
             {step > 0 && <ProgressIndicator currentStep={step} />}

            {step === 1 && (
              <div className="text-center">
                <h1 className="text-4xl font-bold text-foreground mb-2">Welcome {userName},</h1>
                <h2 className="text-2xl text-muted-foreground mb-10">Let's build your team.</h2>
                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={cardContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                  {(Object.keys(employeeTypes) as EmployeeRole[]).map((type) => {
                      const { description, icon } = employeeTypes[type];
                      return (
                        <motion.div
                          key={type}
                          variants={cardVariants}
                          onClick={() => handleEmployeeSelect(type)}
                          className="group relative p-6 bg-card border border-border rounded-xl text-left cursor-pointer transition-all duration-300 overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                        >
                            <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="mb-4">{icon}</div>
                                <h3 className="font-semibold text-foreground text-lg mb-1 font-grotesk">{type}</h3>
                                <p className="text-muted-foreground text-sm">{description}</p>
                           </div>
                        </motion.div>
                      )
                  })}
                </motion.div>
              </div>
            )}

            {step === 2 && employeeType && (
              <div>
                <h2 className="text-3xl font-bold text-center mb-2">What will your {employeeType} focus on?</h2>
                <p className="text-muted-foreground text-center mb-8">Select the primary tasks. You can customize these at any time.</p>
                <div className="space-y-3 max-w-lg mx-auto">
                  {employeeTypes[employeeType].tasks.map((task: string) => {
                    const isSelected = selectedTasks.includes(task);
                    return (
                        <motion.div
                            key={task}
                            onClick={() => handleTaskChange(task)}
                            className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-primary-gradient border-transparent' : 'border-border'}`}>
                                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <span className={`font-medium leading-none ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{task}</span>
                        </motion.div>
                    )
                  })}
                  <div className="flex items-center space-x-2 pt-4">
                    <Input 
                      placeholder="Add a custom task" 
                      value={customTask} 
                      onChange={(e) => setCustomTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
                    />
                    <Button onClick={addCustomTask} className="bg-primary-gradient text-primary-foreground">Add</Button>
                  </div>
                </div>
              </div>
            )}

             {step === 3 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Almost there, {userName}!</h2>
                <p className="text-muted-foreground mb-8">Tell us a bit about your company to personalize your workspace.</p>
                <div className="space-y-4 max-w-md mx-auto text-left">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="companyName">Company Name</label>
                        <Input id="companyName" name="companyName" value={workspaceData.companyName} onChange={handleWorkspaceChange} placeholder="e.g., Stark Industries" className="mt-1" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="websiteUrl">Website URL</label>
                        <Input id="websiteUrl" name="websiteUrl" value={workspaceData.websiteUrl} onChange={handleWorkspaceChange} placeholder="e.g., www.starkindustries.com" className="mt-1" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Team Size</label>
                        <Select onValueChange={handleTeamSizeChange} value={workspaceData.teamSize}>
                            <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1-10">1-10</SelectItem>
                                <SelectItem value="11-50">11-50</SelectItem>
                                <SelectItem value="51-200">51-200</SelectItem>
                                <SelectItem value="201+">201+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {error && (
                    <p className="mt-6 text-sm text-destructive">{error}</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {step > 1 && (
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
            <Button onClick={prevStep} variant="outline">
                Back
            </Button>
            {step === 2 ? (
                <Button onClick={nextStep} className="bg-primary-gradient text-primary-foreground">
                    Continue
                </Button>
            ) : (
                <Button className="bg-primary-gradient text-primary-foreground" onClick={handleHire} disabled={isLoading}>
                    {isLoading ? 'Setting up...' : 'Complete Setup & Hire'}
                </Button>
            )}
            </div>
        )}
      </div>
    </div>
  );
}
