import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, loading, error } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await login({ email, password });
      } else {
        await signup({ email, password, username });
      }
      navigate('/library', { replace: true });
    } catch (err) {
      console.error('Auth failed:', err);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden selection:bg-primary selection:text-white">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img alt="" className="h-full w-full object-cover opacity-10 dark:opacity-20 blur-2xl scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2l6r-gQBEmgCmMFYgzi1LhjuPp4-feiCoE5lH38HT1rSBNsBwcVGKZ5V0NwXnmqdEWOf_gxjASSPRX8zEKWIYh4vnGD8EQAUe3G_I5rytbt6NlB8ljjNkqfDN4yPzvoQIhx1oImykSubsapH2B4GXcpqH2kKYADTsQxn4FPauR0cP2vsQtrZPnPUJo6WY4hSwqYvggTtGc8v20o5qORfmVl3NpaC0R-gBdPnr97tyXijUYWtKWr2IUjf7cu5F29cZDN7ZawLwjFM" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-light/80 to-background-light dark:via-background-dark/80 dark:to-background-dark"></div>
      </div>
      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-12 sm:mx-auto sm:w-full sm:max-w-md lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Metalens</h1>
          <p className="text-slate-500 dark:text-text-secondary text-base font-normal">建立你的视觉档案</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="group">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-text-secondary mb-2 ml-1" htmlFor="email">邮箱</label>
            <div className="relative">
              <input
                className="block w-full rounded-lg border-0 py-3.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-surface-dark dark:text-white dark:ring-border-dark dark:placeholder:text-text-secondary dark:focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                id="email"
                name="email"
                placeholder="请输入邮箱地址"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div className="group animate-fade-in">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-text-secondary mb-2 ml-1" htmlFor="username">用户名</label>
              <div className="relative">
                <input
                  className="block w-full rounded-lg border-0 py-3.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-surface-dark dark:text-white dark:ring-border-dark dark:placeholder:text-text-secondary dark:focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                  id="username"
                  name="username"
                  placeholder="设置显示名称"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLoginMode}
                />
              </div>
            </div>
          )}

          <div className="group">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-text-secondary mb-2 ml-1" htmlFor="password">密码</label>
            <div className="relative rounded-lg shadow-sm">
              <input
                className="block w-full rounded-lg border-0 py-3.5 px-4 pr-12 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-surface-dark dark:text-white dark:ring-border-dark dark:placeholder:text-text-secondary dark:focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                id="password"
                name="password"
                placeholder={isLoginMode ? "请输入密码" : "设置安全密码"}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  className="text-slate-400 hover:text-slate-600 dark:text-text-secondary dark:hover:text-white focus:outline-none p-1 rounded-md transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px] leading-none">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              disabled={loading}
              className="flex w-full justify-center items-center rounded-lg bg-primary px-3 py-4 text-sm font-bold leading-6 text-white shadow-lg hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50"
              type="submit"
            >
              {loading ? '处理中...' : (isLoginMode ? '登录' : '注册')}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-slate-500 dark:text-text-secondary">
          {isLoginMode ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="font-semibold leading-6 text-primary hover:text-blue-500 transition-colors ml-1"
          >
            {isLoginMode ? '立即注册' : '返回登录'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;