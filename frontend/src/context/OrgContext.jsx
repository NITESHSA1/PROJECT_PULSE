import { createContext, useState, useCallback } from 'react';

export const OrgContext = createContext(null);

export function OrgProvider({ children }) {
  const [currentOrg, setCurrentOrg] = useState(() => {
    const stored = localStorage.getItem('pp_current_org');
    return stored ? JSON.parse(stored) : null;
  });

  const selectOrg = useCallback((org) => {
    setCurrentOrg(org);
    localStorage.setItem('pp_current_org', JSON.stringify(org));
  }, []);

  return (
    <OrgContext.Provider value={{ currentOrg, selectOrg }}>{children}</OrgContext.Provider>
  );
}
