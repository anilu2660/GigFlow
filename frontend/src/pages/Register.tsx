import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import gsap from 'gsap';
import { ThreeBackground } from '../components/ui/ThreeBackground';
import { authService } from '../features/auth/AuthService';
import { useAuthStore } from '../store/useAuthStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales']).optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'sales' }
  });

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      await authService.register(data);
      // Auto login after register
      const loginRes = await authService.login({ email: data.email, password: data.password });
      if (loginRes.success) {
        setAuth(loginRes.user, loginRes.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <ThreeBackground />
      
      <div 
        ref={formRef}
        className="relative z-10 w-full max-w-md p-8 bg-white/10 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-600/20 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary-400">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-300">Join Gigflow</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
            <input 
              {...register('name')}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400 outline-none transition-all"
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input 
              {...register('email')}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400 outline-none transition-all"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
            <input 
              type="password"
              {...register('password')}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400 outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
            <select 
              {...register('role')}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-white outline-none transition-all"
            >
              <option value="sales">Sales</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
