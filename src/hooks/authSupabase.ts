import { useCallback, useEffect } from 'react';
import { useAppStore } from '../store';
import { supabase } from '../api/supabaseClient';
import { useNavigate } from 'react-router-dom';

type CurrentUser = any | null | undefined;


export async function useCurrentUser(): Promise<CurrentUser> {
  const { data: user } = await supabase.auth.getUser();
  return user;
}


export function useIsAuthenticated(): boolean {
  const currentUser = useCurrentUser();
  return Boolean(currentUser);
}

export function useEventLogout(): () => void {
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();

  return useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
    }
    dispatch({ type: 'LOG_OUT' });
    navigate('/', { replace: true });
  }, [dispatch, navigate]);
}

export function useAuthWatchdog(afterLogin: () => void, afterLogout: () => void) {
  const [, dispatch] = useAppStore();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          console.warn('Supabase user is logged in - uid:', session.user.id);
          dispatch({ type: 'LOG_IN', payload: session.user });
          afterLogin?.();
        } else {
          console.warn('Supabase user is logged out');
          dispatch({ type: 'LOG_OUT' });
          afterLogout?.();
        }
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, [dispatch, afterLogin, afterLogout]);
}
