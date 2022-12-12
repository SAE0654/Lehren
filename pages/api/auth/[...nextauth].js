import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import axios from 'axios'

const providers = [
    Credentials({
        name: 'Credentials',
        authorize: async (credentials) => {
            try {
                const user = await axios.post('http://localhost:3000/api/login',
                {
                  user: {
                    password: credentials.password,
                    email: credentials.email
                  }
                },
                {
                  headers: {
                    accept: '*/*',
                    'Content-Type': 'application/json'
                  }
                })
                if (user) {
                    return { status: 'success', data: user.data.user }
                } else {
                    throw new Error("Usuario o contraseña incorrectos");
                }
            } catch (e) {
                // Redirecting to the login page with error messsage in the URL
                throw new Error(e.response.data.message);
            }
        }
    })
]

const callbacks = {
    async jwt({ token, user, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
            token.accessToken = account.access_token;
            token.user = user;
        }
        return token
    },
    async session({ session, user, token }) {
        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken
        session.user = token.user.data;
        return session
    }
}

const options = {
    providers,
    callbacks,
    pages: {
        error: '/' // Changing the error redirect page to our custom login page
    }
}

export default (req, res) => NextAuth(req, res, options)
