
import { LayoutDashboard, User, GraduationCap, Briefcase, FolderKanban, Code, Award, FileText, Settings, LogOut, Boxes } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'practices', label: 'Practices', icon: Boxes },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'resume', label: 'Resume', icon: FileText },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: 'logout', label: 'Logout', icon: LogOut },
];
