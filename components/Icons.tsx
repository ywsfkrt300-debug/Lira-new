
import React from 'react';

export const IconContainer = ({ children, className = "w-6 h-6" }: { children: React.ReactNode, className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const Icons = {
  Home: (props: any) => (
    <IconContainer {...props} className="w-4 h-4">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </IconContainer>
  ),
  Services: (props: any) => (
    <IconContainer {...props} className="w-4 h-4">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </IconContainer>
  ),
  Converter: (props: any) => (
    <IconContainer {...props}>
      <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
    </IconContainer>
  ),
  Electricity: (props: any) => (
    <IconContainer {...props}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </IconContainer>
  ),
  Upload: (props: any) => (
    <IconContainer {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </IconContainer>
  ),
  Calculator: (props: any) => (
    <IconContainer {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="16" y1="14" x2="16" y2="18" />
      <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" />
    </IconContainer>
  ),
  CentralBank: (props: any) => (
    <IconContainer {...props}>
      <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3l9-7z" />
    </IconContainer>
  ),
  Market: (props: any) => (
    <IconContainer {...props}>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </IconContainer>
  ),
  Stats: (props: any) => (
    <IconContainer {...props}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </IconContainer>
  ),
  Location: (props: any) => (
    <IconContainer {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </IconContainer>
  ),
  Maintenance: (props: any) => (
    <IconContainer {...props}>
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1 0-1.4z"/>
    </IconContainer>
  ),
  Features: (props: any) => (
    <IconContainer {...props}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </IconContainer>
  ),
  Settings: (props: any) => (
    <IconContainer {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </IconContainer>
  ),
  Security: (props: any) => (
    <IconContainer {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </IconContainer>
  ),
  Refresh: (props: any) => (
    <IconContainer {...props}>
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" />
    </IconContainer>
  ),
  Sun: (props: any) => (
    <IconContainer {...props}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </IconContainer>
  ),
  Moon: (props: any) => (
    <IconContainer {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </IconContainer>
  ),
  Globe: (props: any) => (
    <IconContainer {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </IconContainer>
  ),
  Close: (props: any) => (
    <IconContainer {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </IconContainer>
  ),
  About: (props: any) => (
    <IconContainer {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </IconContainer>
  ),
  Mail: (props: any) => (
    <IconContainer {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </IconContainer>
  ),
  ArrowSwap: (props: any) => (
    <IconContainer {...props}>
      <path d="M16 3l4 4-4 4M8 21l-4-4 4-4M20 7H4M4 17h16" />
    </IconContainer>
  ),
  ToggleOn: (props: any) => (
    <IconContainer {...props}>
      <rect x="2" y="6" width="20" height="12" rx="6" fill="currentColor" fillOpacity="0.2" />
      <circle cx="16" cy="12" r="4" fill="currentColor" />
    </IconContainer>
  ),
  ToggleOff: (props: any) => (
    <IconContainer {...props}>
      <rect x="2" y="6" width="20" height="12" rx="6" fill="currentColor" fillOpacity="0.1" />
      <circle cx="8" cy="12" r="4" fill="currentColor" />
    </IconContainer>
  ),
  Logout: (props: any) => (
    <IconContainer {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </IconContainer>
  ),
  Trash: (props: any) => (
    <IconContainer {...props}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </IconContainer>
  ),
  Print: (props: any) => (
    <IconContainer {...props}>
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
    </IconContainer>
  ),
  Animation: (props: any) => (
    <IconContainer {...props}>
        <path d="M14.5 2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h- significativo" />
        <path d="m12 5.5-2.5 4.5 2.5 4.5 2.5-4.5-2.5-4.5z" />
        <path d="m20.5 15.5.5.5 1-1" />
        <path d="m3.5 15.5-.5.5 1 1" />
        <path d="m17 3.5 1-1 .5.5" />
        <path d="m6 3.5 1 1-.5.5" />
    </IconContainer>
  ),
  BloodDrop: (props: any) => (
    <svg className={props.className || "w-6 h-6"} viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2.69l5.66 5.66c1.5 1.5 2.34 3.49 2.34 5.65s-.84 4.15-2.34 5.65c-3.12 3.12-8.19 3.12-11.31 0-1.5-1.5-2.34-3.49-2.34-5.65s.84-4.15 2.34-5.65L12 2.69z" />
    </svg>
  ),
  // Brand Specific Icons
  Whatsapp: (props: any) => (
    <IconContainer {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.395 0 .01 5.385.01 12.037c0 2.125.546 4.2 1.583 6.048L0 24l6.105-1.602a11.83 11.83 0 005.937 1.57h.005c6.654 0 12.034-5.388 12.034-12.041a11.878 11.878 0 00-3.489-8.453" fill="currentColor" stroke="none" />
    </IconContainer>
  ),
  Telegram: (props: any) => (
    <IconContainer {...props}>
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </IconContainer>
  ),
  Facebook: (props: any) => (
    <IconContainer {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </IconContainer>
  ),
  Instagram: (props: any) => (
    <IconContainer {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </IconContainer>
  ),
  Apple: (props: any) => (
    <IconContainer {...props}>
      <path d="M12 20.94c1.88 0 3.05-.76 4.07-1.44 1.1-.73 2.1-1.39 3.53-1.39 1.54 0 2.6.72 3.4 1.26a.5.5 0 0 0 .75-.54c-.16-.94-.8-3.04-2.52-4.14-1.63-1.04-3.56-.84-4.54-.74-1.12.12-2.33.64-3.41 1.1-1.08-.46-2.29-.98-3.41-1.1-.98-.1-2.91-.3-4.54.74-1.72 1.1-2.36 3.2-2.52 4.14a.5.5 0 0 0 .75.54c.8-.54 1.86-1.26 3.4-1.26 1.43 0 2.43.66 3.53 1.39 1.02.68 2.19 1.44 4.07 1.44z" />
      <path d="M12 11.5c1.1 0 2.2-.4 2.8-1.2.6-.8.8-1.8.6-2.8-.9.1-1.9.5-2.5 1.3-.6.8-.8 1.9-.9 2.7z" />
    </IconContainer>
  ),
  PlayStore: (props: any) => (
    <IconContainer {...props}>
      <path d="M5 3l14 9-14 9V3z" />
    </IconContainer>
  ),
  Social: (props: any) => (
    <IconContainer {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <path d="M12 6.5c-1.8 1.8-1.8 4.6 0 6.4l.5.5.5-.5c1.8-1.8 1.8-4.6 0-6.4C11.6 4.7 9.8 4.7 8 6.5" fill="currentColor" fillOpacity="0.5"></path>
    </IconContainer>
  ),
  Visitors: (props: any) => (
    <IconContainer {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </IconContainer>
  ),
};