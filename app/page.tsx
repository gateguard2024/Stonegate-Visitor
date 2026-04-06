"use client";
import React, { useState, useEffect } from 'react';
import { Users, Phone, Package, AlertTriangle, ChevronRight, X, ShieldCheck, Globe, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
// Make sure you have your config file created at app/config.ts!
import { SITE_CONFIG } from './config';

// --- TRANSLATION DICTIONARY ---
const t = {
  en: {
    welcome: "Welcome To",
    systemActive: "System Active",
    directory: "Directory",
    callLeasing: "Call Leasing",
    officeClosed: "Office Closed",
    packages: "Packages",
    emergency: "Emergency",
    callLeasingTitle: "Call Leasing Office",
    visitorReg: "Visitor Registration",
    fullName: "Full Name",
    email: "Email Address",
    mobile: "Mobile Number",
    reason: "Select Reason for Visit",
    reasons: {
      leasing: "Interest in Leasing",
      delivery: "Package / Delivery Courier",
      support: "Current Resident Support",
      maintenance: "Maintenance / Vendor",
      general: "General Inquiry"
    },
    initiate: "Initiate Secure Call",
    toggleLang: "ES"
  },
  es: {
    welcome: "Bienvenido A",
    systemActive: "Sistema Activo",
    directory: "Directorio",
    callLeasing: "Oficina de Alquiler",
    officeClosed: "Oficina Cerrada",
    packages: "Paquetes",
    emergency: "Emergencia",
    callLeasingTitle: "Llamar a la Oficina",
    visitorReg: "Registro de Visitantes",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    mobile: "Número de Teléfono",
    reason: "Seleccione el Motivo",
    reasons: {
      leasing: "Interés en Alquilar",
      delivery: "Paquete / Repartidor",
      support: "Soporte para Residentes",
      maintenance: "Mantenimiento / Proveedor",
      general: "Consulta General"
    },
    initiate: "Iniciar Llamada Segura",
    toggleLang: "EN"
  }
};

const LeasingPhoneModal = ({ isOpen, onClose, onConfirm, lang }: any) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  
  if (!isOpen) return null;
  const text = t[lang as keyof typeof t];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/95 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-[#111] border-2 border-gray-200 dark:border-white/20 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-blue-600 dark:text-blue-400">{text.callLeasingTitle}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{text.visitorReg}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-white/10 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20"><X size={24}/></button>
        </div>
        
        <input 
          type="text" 
          placeholder={text.fullName}
          className="w-full bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-white/20 p-5 rounded-2xl text-xl text-center font-bold text-gray-900 dark:text-white outline-none mb-3 focus:border-blue-500 transition-colors"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="email" 
          placeholder={text.email}
          className="w-full bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-white/20 p-5 rounded-2xl text-xl text-center font-bold text-gray-900 dark:text-white outline-none mb-3 focus:border-blue-500 transition-colors"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder={text.mobile}
          className="w-full bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-white/20 p-5 rounded-2xl text-xl text-center font-bold text-gray-900 dark:text-white outline-none mb-3 focus:border-blue-500 transition-colors"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <select
          className="w-full bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-white/20 p-5 rounded-2xl text-xl text-center font-bold text-gray-900 dark:text-white outline-none mb-6 focus:border-blue-500 appearance-none transition-colors"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="" disabled>{text.reason}</option>
          <option value="Interest in Leasing">{text.reasons.leasing}</option>
          <option value="Package / Delivery Courier">{text.reasons.delivery}</option>
          <option value="Current Resident Support">{text.reasons.support}</option>
          <option value="Maintenance / Vendor">{text.reasons.maintenance}</option>
          <option value="General Inquiry">{text.reasons.general}</option>
        </select>

        <button 
          onClick={() => onConfirm(name, number, email, reason)}
          disabled={number.length < 10 || name.trim() === '' || email.trim() === '' || reason === ''}
          className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase italic text-lg disabled:opacity-30 text-white transition-opacity"
        >
          {text.initiate}
        </button>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);

  const text = t[lang];

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    const checkIsOpen = () => {
      const now = new Date();
      const day = now.getDay(); 
      const hour = now.getHours();
      const { hours } = SITE_CONFIG;
      if (day === 0) return !hours.sunday.closed; 
      if (day === 6) return hour >= hours.saturday.open && hour < hours.saturday.close;
      return hour >= hours.weekdays.open && hour < hours.weekdays.close;
    };
    setIsOfficeOpen(checkIsOpen());
  }, []);

  const handleLeasingCall = async (visitorName: string, visitorPhone: string, email: string, reason: string) => {
    setIsLeasingModalOpen(false);
    try {
      await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          visitorName,
          visitorPhone: `+1${visitorPhone.replace(/\D/g, '')}`, 
          residentPhone: `+1${SITE_CONFIG.officePhone}`, 
          residentName: "Leasing Office
