import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ChatbotFloatingWidget from '../components/common/ChatbotFloatingWidget';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-medical-coolgray text-medical-slate font-sans antialiased relative">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* 24x7 Chatbot, Direct Call & Go To Top Floating Stack */}
      <ChatbotFloatingWidget />
    </div>
  );
};

export default PublicLayout;
