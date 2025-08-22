// // lib/supabase-server.ts
// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { createClient } from '@supabase/supabase-js';
// import { cookies } from 'next/headers';

// export async function createServerSupabaseClient() {
//   const cookieStore = await cookies();
//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
//   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
//   // Get all cookies to debug
//   const allCookies = cookieStore.getAll();
//   console.log('All cookies found:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
  
//   // Find and reconstruct split auth token cookies
//   const authTokenBase = allCookies.find(c => c.name.includes('auth-token'))?.name.split('.')[0];
//   console.log('Auth token base name:', authTokenBase);
  
//   if (authTokenBase) {
//     // Find all parts of the split cookie
//     const tokenParts = allCookies
//       .filter(c => c.name.startsWith(authTokenBase))
//       .sort((a, b) => {
//         const aIndex = parseInt(a.name.split('.')[1] || '0');
//         const bIndex = parseInt(b.name.split('.')[1] || '0');
//         return aIndex - bIndex;
//       });
    
//     console.log('Found token parts:', tokenParts.map(p => ({ name: p.name, hasValue: !!p.value })));
    
//     if (tokenParts.length > 0) {
//       // Reconstruct the full token by concatenating all parts
//       const fullToken = tokenParts.map(part => part.value).join('');
//       console.log('Reconstructed token length:', fullToken.length);
      
//       try {
//         // First check if the token is base64 encoded
//         let sessionData;
//         if (fullToken.startsWith('base64-')) {
//           console.log('Token is base64 encoded, decoding...');
//           const base64Data = fullToken.substring(7); // Remove 'base64-' prefix
//           const decodedToken = Buffer.from(base64Data, 'base64').toString('utf-8');
//           console.log('Decoded token length:', decodedToken.length);
//           sessionData = JSON.parse(decodedToken);
//         } else {
//           console.log('Token is raw JSON, parsing directly...');
//           sessionData = JSON.parse(fullToken);
//         }
        
//         console.log('Parsed session data keys:', Object.keys(sessionData));
        
//         if (sessionData.access_token && sessionData.refresh_token) {
//           const supabase = createClient(supabaseUrl, supabaseAnonKey);
          
//           // Set the session
//           const { data, error } = await supabase.auth.setSession({
//             access_token: sessionData.access_token,
//             refresh_token: sessionData.refresh_token
//           });
          
//           console.log('Session set result:', {
//             hasUser: !!data.user,
//             hasSession: !!data.session,
//             error: error?.message || 'none'
//           });
          
//           // Verify authentication
//           const { data: { user }, error: userError } = await supabase.auth.getUser();
//           console.log('Final auth check - User:', user ? { id: user.id, email: user.email } : null);
//           console.log('Final auth check - Error:', userError?.message || 'none');
          
//           return supabase;
//         }
//       } catch (e) {
//         console.log('Error parsing reconstructed token:', e);
//       }
//     }
//   }
  
//   // Fallback - create client without session
//   console.log('No valid session found, creating client without auth');
//   const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
//   const { data: { user }, error } = await supabase.auth.getUser();
//   console.log('Final auth check - User:', user ? { id: user.id, email: user.email } : null);
//   console.log('Final auth check - Error:', error?.message || 'none');
  
//   return supabase;
// }

// lib/supabase-server.ts
// lib/supabase-server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 1. Make the function async
export const createServerSupabaseClient = async () => {
  // 2. 'await' the cookies() call to get the resolved value
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Now cookieStore is the actual object, so .get() exists
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // .set() also exists
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // .remove() also exists
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}