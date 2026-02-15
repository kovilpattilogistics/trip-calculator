import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminDashboard } from './pages/AdminDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { CustomerBooking } from './pages/CustomerBooking';
import { loginUser, getSession, logoutUser, initStorage } from './services/storageService';
import { isFirebaseInitialized } from './services/firebaseConfig';
import { User, UserRole, Notification } from './types';
import { Lock, Loader2, ArrowRight } from 'lucide-react';

const Login: React.FC<{ onLogin: (u: User) => void, onNotify: (msg: string, type: 'info' | 'success' | 'error') => void }> = ({ onLogin, onNotify }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!identifier || !password) return onNotify('Please fill in all fields', 'error');
    
    setIsLoading(true);
    // Simulate network delay for effect
    await new Promise(r => setTimeout(r, 800));

    try {
        const user = await loginUser(identifier, password);
        if (user) {
            onLogin(user);
            navigate('/');
            onNotify(`Welcome back, ${user.name}`, 'success');
        } else {
            onNotify('Invalid email/phone or password', 'error');
        }
    } catch (error) {
        onNotify('Login error occurred', 'error');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-white/50 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
                <div className="bg-primary/5 p-4 rounded-full">
                    <img src="/generated-image (4).png" alt="EcoExpress" className="w-16 h-16 object-contain" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Eco<span className="text-primary">Express</span></h1>
            <p className="text-sm text-gray-500 font-medium">Sustainable Fleet Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Email or Phone</label>
                <input 
                    type="text" 
                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-700"
                    placeholder="admin@fleet.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Password</label>
                <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                    <input 
                        type="password" 
                        className="w-full pl-12 p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-700"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-primaryDark active:scale-[0.98] transition-all flex justify-center items-center"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center">Login to Dashboard <ArrowRight className="ml-2 w-4 h-4"/></span>}
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
                Demo Credentials:<br/>
                Admin: sirangvjomon@gmail.com / Zolo@city$b301<br/>
                Driver: 9876543210 / arun@123
            </p>
        </div>
        <div className="mt-4 text-center border-t border-gray-100 pt-4">
             <a href="/book" className="text-primary font-bold text-sm hover:underline">Public Customer Booking &rarr;</a>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, user: User | null }> = ({ children, user }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Init
    initStorage();
    const session = getSession();
    if (session) setUser(session);
    setIsOnline(isFirebaseInitialized());
  }, []);

  const handleNotify = (message: string, type: 'info' | 'success' | 'error') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type, timestamp: Date.now() }]);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <BrowserRouter>
        <Layout 
            user={user} 
            notifications={notifications} 
            clearNotification={clearNotification}
            onLogout={handleLogout}
            isOnline={isOnline}
        >
            <Routes>
                {/* Public Route for Customers */}
                <Route path="/book" element={<CustomerBooking onNotify={handleNotify} />} />

                <Route path="/login" element={
                    user ? <Navigate to="/" replace /> : <Login onLogin={setUser} onNotify={handleNotify} />
                } />
                
                <Route path="/" element={
                    <ProtectedRoute user={user}>
                        {user?.role === UserRole.ADMIN ? (
                            <AdminDashboard user={user} onNotify={handleNotify} />
                        ) : user?.role === UserRole.DRIVER ? (
                            <DriverDashboard user={user} onNotify={handleNotify} />
                        ) : (
                            <div className="text-center p-10">Unknown Role</div>
                        )}
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    </BrowserRouter>
  );
}

export default App;
