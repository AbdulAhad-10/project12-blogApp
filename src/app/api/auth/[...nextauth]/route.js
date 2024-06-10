import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  callbacks: {
    async session({ session, token }) {
      // Fetch the user from the database
      await connectMongoDB();
      const user = await User.findById(token.id);

      // Add custom properties to the session object
      session.user.id = user._id;
      session.user.avatar = user.avatar;
      session.user.name = user.name;
      session.user.title = user.title;
      session.user.posts = user.posts;

      return session;
    },
    async jwt({ token, user }) {
      // Add user ID to the token
      if (user) {
        token.id = user._id;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
