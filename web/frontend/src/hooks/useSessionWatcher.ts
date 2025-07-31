import { useEffect, useRef } from 'react';

interface JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    const now = Date.now() / 1000;
    return exp < now;
  } catch (e) {
    return true;
  }
};

const useSessionWatcher = (setSessionExpired: (value: boolean) => void) => {
  const sessionHandled = useRef(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        if (!sessionHandled.current) {
          sessionHandled.current = true;
          setSessionExpired(true); // Activar alerta visual
        }
      }
    };

    const handleUserActivity = () => {
      checkToken();
    };

    document.addEventListener('click', handleUserActivity);
    window.addEventListener('popstate', handleUserActivity);

    return () => {
      document.removeEventListener('click', handleUserActivity);
      window.removeEventListener('popstate', handleUserActivity);
    };
  }, [setSessionExpired]);
};

export default useSessionWatcher;
