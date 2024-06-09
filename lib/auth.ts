

import GoogleProvider from "next-auth/providers/google"
export const authOptions = {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_KEY ||"",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY ||"",
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
              

              scope:"openid profile email https://www.googleapis.com/auth/gmail.readonly",
              
            },
          
          }
        }),
    ] ,
    secret:process.env.JWT_SECRET,
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
        
        }
        return token;
      },
      async session({ session, token }) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
       
        return session;
      },
    },
    pages: {
      signIn: '/signin',
    },

    

    

}