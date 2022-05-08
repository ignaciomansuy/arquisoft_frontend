import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './components/layout/footer.component';
import Hero from './components/layout/hero.component';
import Navbar from './components/layout/navbar.component';
import AuthContextProvider from './context/AuthContext';
const HomePage = lazy(() => import('./pages/static/home.page'));
const NotFoundPage = lazy(() => import('./pages/errors/not-found.page'));
const SignInPage = lazy(() => import('./pages/auth/sign-in.page'));
const SignUpPage = lazy(() => import('./pages/auth/sign-up.page'));
const ShowMapPage = lazy(() => import('./pages/map/show.page'));
const UserList = lazy(() => import('./pages/users/UserList'));

export default function Router() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<Hero navbar />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/session/signup" element={<SignUpPage />} />
            <Route path="/session/login" element={<SignInPage />} />
            <Route path="/map/show" element={<ShowMapPage />} />
            <Route path="/users/list" element={<UserList />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </AuthContextProvider>
  );
}
