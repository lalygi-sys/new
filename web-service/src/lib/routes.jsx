import React from 'react';
import { createBrowserRouter, redirect } from 'react-router-dom';
import App from '../App.jsx';
import IBMyContests from '../screens/IBMyContests.jsx';
import IBCreateContest from '../screens/IBCreateContest.jsx';
import IBContestDetail from '../screens/IBContestDetail.jsx';
import ClientContestList from '../screens/ClientContestList.jsx';
import ClientContestTerms from '../screens/ClientContestTerms.jsx';
import ClientLeaderboard from '../screens/ClientLeaderboard.jsx';
import AdminDashboard from '../screens/AdminDashboard.jsx';
import AdminContestDetail from '../screens/AdminContestDetail.jsx';
import NotFound from '../screens/NotFound.jsx';

/**
 * @module routes
 * @description Routing map — IB / Client / Admin каждый пространство имён.
 *   Index redirect → /ib/contests (default landing).
 *   * catches unknown paths.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, loader: () => redirect('/ib/contests') },
      { path: 'ib/contests', element: <IBMyContests /> },
      { path: 'ib/contests/new', element: <IBCreateContest /> },
      { path: 'ib/contests/:id', element: <IBContestDetail /> },
      { path: 'client/contests', element: <ClientContestList /> },
      { path: 'client/contests/:id', element: <ClientContestTerms /> },
      { path: 'client/contests/:id/board', element: <ClientLeaderboard /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'admin/contests/:id', element: <AdminContestDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
