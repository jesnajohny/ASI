// components/login-form.tsx
'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.92C34.343 4.925 29.479 2.5 24 2.5C11.493 2.5 2.5 11.493 2.5 24s8.993 21.5 21.5 21.5c11.146 0 20.143-8.52 21.4-19.532l.111-1.885z" />
        <path fill="#FF3D00" d="M6.306 14.691c-2.213 4.013-2.213 8.601 0 12.614L15.25 32.18C12.438 28.632 12.438 23.368 15.25 19.82l-8.944-5.129z" />
        <path fill="#4CAF50" d="M24 45.5c5.479 0 10.343-2.425 14.802-6.42L30.039 31.119c-2.125 1.885-4.902 3.039-7.961 3.039c-5.223 0-9.651-3.343-11.303-8H2.5c1.257 10.97 10.254 19.5 21.5 19.5z" />
        <path fill="#1976D2" d="M43.611 20.083L43.599 20H24v8h11.303a12.023 12.023 0 0 1-4.98 5.42l8.944 5.129C44.933 34.612 46.5 29.71 46.5 24c0-1.839-.258-3.626-.739-5.339l-2.15-8.578z" />
    </svg>
);

function LoginFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const email = searchParams.get('email');
        const password = searchParams.get('password');
        if (email) {
            setFormData(prev => ({ ...prev, email }));
        }
        if (password) {
            setFormData(prev => ({ ...prev, password }));
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

   const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        console.log("Login submitted for:", formData.email);

        try {
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (loginError) {
                console.error("Login error:", loginError.message);
                setError(loginError.message);
                return;
            }
            
            if (loginData.user) {
                console.log("Login successful. User:", loginData.user.id);
                console.log("Checking for existing companies...");
                
                const { data: companies, error: companiesError } = await supabase
                    .from('companies')
                    .select('id')
                    .eq('user_id', loginData.user.id)
                    .limit(1);

                if (companiesError) {
                    console.error("Error fetching companies:", companiesError.message);
                    setError("Could not check for companies. Please try again.");
                    return;
                }

                router.refresh(); // Refresh server components before redirecting

                if (companies && companies.length > 0) {
                    console.log("Companies found. Redirecting to /dashboard/companies");
                    router.push('/dashboard/companies');
                } else {
                    console.log("No companies found. Redirecting to /workspace-setup");
                    router.push('/workspace-setup');
                }
            }

        } catch (error) {
            console.error("An unexpected error occurred during login:", error);
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
            <motion.div 
                className="w-full max-w-md mx-auto bg-card p-8 rounded-2xl border"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Welcome back</h2>
                    <p className="text-muted-foreground mt-2">Log in to continue to your dashboard.</p>
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
                        Log in with Google
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
                        <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Work Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 w-full p-3 bg-transparent border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
                            required
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
                            required
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
                        Log in
                    </motion.button>
                </motion.form>
                
                <p className="text-sm text-center mt-4">
                    Don't have an account? <a href="/signup" className="font-semibold text-primary hover:underline">Sign up</a>
                </p>
            </motion.div>
        </div>
    );
}

export default function LoginForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginFormContent />
        </Suspense>
    );
}
