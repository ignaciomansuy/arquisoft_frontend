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
const AddUbicationPage = lazy(() => import('./pages/map/add.ubication.page'));
const ShowPingsSentPage = lazy(() => import('./pages/pings/pings_sent'));
const ShowPingsReceivedPage = lazy(() => import('./pages/pings/pings_received'));
const ShowPingsSendPage = lazy(() => import('./pages/pings/pings_send'));
const ShowUserUbicationsPage = lazy(() => import('./pages/user/show.user.ubications.page'));

const UserList = lazy(() => import('./pages/users/UserList'));
const CompareMapPage = lazy(() => import('./pages/compare/compare.page'));
const ProfilePage = lazy(() => import('./pages/user/profile.page'));

export default function Router() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<Hero navbar />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route path="/map/show" element={<ShowMapPage />} />
            <Route path="/map/add_ubication" element={<AddUbicationPage />} />
            <Route path="/map/show_ubications" element={<ShowUserUbicationsPage />} />
            <Route path="/pings/send" element={<ShowPingsSentPage />} />
            <Route path="/pings/show_received" element={<ShowPingsReceivedPage />} />
            <Route path="/pings/show_send" element={<ShowPingsSendPage />} />
            <Route path="/users/list" element={<UserList />} />
            <Route path="/map/compare" element={<CompareMapPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </AuthContextProvider>
  );
}
