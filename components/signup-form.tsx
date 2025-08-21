'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.92C34.343 4.925 29.479 2.5 24 2.5C11.493 2.5 2.5 11.493 2.5 24s8.993 21.5 21.5 21.5c11.146 0 20.143-8.52 21.4-19.532l.111-1.885z" />
        <path fill="#FF3D00" d="M6.306 14.691c-2.213 4.013-2.213 8.601 0 12.614L15.25 32.18C12.438 28.632 12.438 23.368 15.25 19.82l-8.944-5.129z" />
        <path fill="#4CAF50" d="M24 45.5c5.479 0 10.343-2.425 14.802-6.42L30.039 31.119c-2.125 1.885-4.902 3.039-7.961 3.039c-5.223 0-9.651-3.343-11.303-8H2.5c1.257 10.97 10.254 19.5 21.5 19.5z" />
        <path fill="#1976D2" d="M43.611 20.083L43.599 20H24v8h11.303a12.023 12.023 0 0 1-4.98 5.42l8.944 5.129C44.933 34.612 46.5 29.71 46.5 24c0-1.839-.258-3.626-.739-5.339l-2.15-8.578z" />
    </svg>
);

const roles = [
    { text: "HR Manager", color: "text-purple-500" },
    { text: "Social Media Marketer", color: "text-pink-500" },
    { text: "Sales Assistant", color: "text-blue-500" },
    { text: "Scrum Master", color: "text-green-500" },
];

const RotatingText = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % roles.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-32 font-grotesk font-bold text-5xl lg:text-6xl">
            <AnimatePresence>
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 ${roles[index].color}`}
                >
                    {roles[index].text}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};


export default function SignupForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                },
            });

               if (error) {
                if (error.message.includes("User already registered")) {
                    const queryParams = new URLSearchParams({
                        email: formData.email,
                        password: formData.password
                    }).toString();
                    router.push(`/login?${queryParams}`);
                } else {
                    setError(error.message);
                }
                return;
            }

            if (data.user) {
                // If signup is successful and email confirmation is disabled,
                // the user is also logged in. Redirect to hire flow.
                router.push('/workspace-setup');
            }
        } catch (error) {
            setError('An unexpected error occurred.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                {/* Left Column */}
                <motion.div 
                    className="hidden md:block"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <h1 className="text-4xl lg:text-5xl font-sans font-normal mb-2 leading-tight">
                        Your new AI 
                        <RotatingText />
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">Unlock unprecedented efficiency by hiring autonomous AI employees for your business needs.</p>
                    <motion.ul 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.li className="flex items-start" variants={itemVariants}>
                            <CheckIcon className="text-primary w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                            <span><span className="font-semibold">Deploy specialized AI employees</span> for HR, Sales, Marketing, and more.</span>
                        </motion.li>
                        <motion.li className="flex items-start" variants={itemVariants}>
                            <CheckIcon className="text-primary w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                            <span><span className="font-semibold">Seamlessly integrate</span> with the tools you already use every day.</span>
                        </motion.li>
                        <motion.li className="flex items-start" variants={itemVariants}>
                            <CheckIcon className="text-primary w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                            <span><span className="font-semibold">Start with a free trial,</span> no credit card required. We also build custom solutions.</span>
                        </motion.li>
                    </motion.ul>
                </motion.div>

                {/* Right Column (Form) */}
                <motion.div 
                    className="w-full max-w-md mx-auto bg-card p-8 rounded-2xl border"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold">Create your account</h2>
                        <p className="text-muted-foreground mt-2">Hire your first AI employee in seconds.</p>
                    </div>

                    <motion.form 
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.button 
                            type="button" 
                            className="w-full flex items-center justify-center gap-3 p-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-muted transition-colors"
                            variants={itemVariants}
                        >
                            <GoogleIcon />
                            Sign up with Google
                        </motion.button>

                        <motion.div 
                            className="flex items-center"
                            variants={itemVariants}
                        >
                            <hr className="w-full border-border" />
                            <span className="p-2 text-muted-foreground text-sm">OR</span>
                            <hr className="w-full border-border" />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 bg-transparent border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            />
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Work Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="you@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 bg-transparent border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="text-sm font-medium text-muted-foreground" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 w-full p-3 bg-transparent border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            />
                        </motion.div>

                        {error && (
                            <motion.div 
                                className="p-3 bg-destructive text-destructive-foreground rounded-lg text-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            className="w-full p-3 bg-primary-gradient text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity"
                            variants={itemVariants}
                        >
                            Get started for free
                        </motion.button>
                    </motion.form>
                    
                    <p className="text-xs text-muted-foreground mt-6 text-center">
                        By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                    </p>
                    <p className="text-sm text-center mt-4">
                        Already have an account? <a href="#" className="font-semibold text-primary hover:underline">Log in</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
