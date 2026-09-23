import { useContext } from 'react';
import { OrgContext } from '../context/OrgContext';

export const useOrg = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error('useOrg must be used within an OrgProvider');
  return ctx;
};
