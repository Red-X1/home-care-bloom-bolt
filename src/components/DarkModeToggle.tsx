import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 z-50 h-8 w-8 p-0 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 bg-white dark:bg-gray-800"
      title={isDarkMode ? 'Светлая тема' : 'Темная тема'}
    >
      {isDarkMode ? (
        <Sun className="h-3 w-3 text-yellow-500" />
      ) : (
        <Moon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
      )}
    </Button>
  );
};

export default DarkModeToggle;