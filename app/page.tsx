"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Activity, Sun, Moon } from "lucide-react";

interface LoginPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  isDarkMode,
  toggleTheme,
  onLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle authentication
    onLogin();
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
            isDarkMode ? "bg-purple-500" : "bg-purple-300"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
            isDarkMode ? "bg-pink-500" : "bg-pink-300"
          }`}
        ></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-xl transition-all hover:scale-110 z-10 ${
          isDarkMode
            ? "bg-gray-800/50 hover:bg-gray-700/50 text-yellow-400 backdrop-blur-md border border-gray-700/50"
            : "bg-white/80 hover:bg-white/90 text-gray-600 backdrop-blur-md border border-black/10 shadow-lg"
        }`}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      {/* Login Card */}
      <div
        className={`w-full max-w-md p-8 backdrop-blur-md rounded-2xl border transition-all duration-300 hover:scale-[1.02] relative z-10 ${
          isDarkMode
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white/80 border-black/10 shadow-xl"
        }`}
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-2xl font-bold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome Back
          </h1>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Sign in to your RAFIKey account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400"
                    : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDarkMode
                    ? "bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400"
                    : "bg-white border border-gray-200 text-gray-900 placeholder-gray-500"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Don't have an account?{" "}
            <button
              className={`font-medium transition-colors ${
                isDarkMode
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-purple-600 hover:text-purple-700"
              }`}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Add theme state and wrapper component for the page
const Page: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Optionally, persist theme in localStorage
  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleLogin = () => {
    // Implement login logic or navigation here
  };

  return (
    <LoginPage
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      onLogin={handleLogin}
    />
  );
};

export default Page;
