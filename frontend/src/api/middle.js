export async function CheckLogin() {
        try {
          const response = await fetch('https://5512-20-56-138-63.ngrok-free.app/middle', {
            method: 'GET',
            credentials: 'include',
          });
  
          const data = await response.json();
  
          if (data.message === 'Login successful') {
            return true;
        
          } else {
            return false;
          
          }
        } catch (error) {
          console.error('Error during login check:', error);
          throw error;
        }
      }