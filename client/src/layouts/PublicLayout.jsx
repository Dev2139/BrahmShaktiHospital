import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatbotFloatingWidget from '../components/common/ChatbotFloatingWidget';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-medical-coolgray text-medical-slate font-sans antialiased relative w-full max-w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full max-w-full min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      {/* 24x7 Chatbot, Direct Call & Go To Top Floating Stack */}
      <ChatbotFloatingWidget />
    </div>
  );
};

export default PublicLayout;
