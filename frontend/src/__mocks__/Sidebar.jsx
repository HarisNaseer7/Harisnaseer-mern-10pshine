export const categories = [
  { id: 'work', label: 'Work', color: '#378ADD' },
  { id: 'personal', label: 'Personal', color: '#639922' },
  { id: 'ideas', label: 'Ideas', color: '#534AB7' },
  { id: 'general', label: 'General', color: '#9ca3af' },
];

const Sidebar = ({ children }) => <div data-testid="sidebar">{children}</div>;

export default Sidebar;