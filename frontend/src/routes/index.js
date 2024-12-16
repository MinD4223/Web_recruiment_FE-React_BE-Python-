import LayoutDefault from '../components/LayoutDefault';
import LogOut from '../components/LogOut';
import PrivateRoutes from '../components/PrivateRoutes';
import AdminJob from '../pages/AdminJob';
import CreateAdminJob from '../pages/AdminJob/CreateAdminJob';
import DetailAdminJob from '../pages/AdminJob/DetailAdminJob';
import AdminManageCV from '../pages/AdminManageCV';
import DashBoard from '../pages/DashBoard';
import FormApply from '../pages/FormApply';
import FormLogin from '../pages/FormLogin';
import FormRegister from '../pages/FormRegister';
import Home from '../pages/Home';
import JobDetail from '../pages/JobDetail';
import Jobs from '../pages/Jobs';
import Process from '../pages/Process';

export const routes = [
  {
    path: '/',
    element: <LayoutDefault />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'jobs',
        element: <Jobs />,
      },
      {
        path: 'jobs/:id',
        element: <JobDetail />,
      },
      {
        path: 'form-apply',
        element: <FormApply />,
      },
      {
        path: 'form-login',
        element: <FormLogin />,
      },
      {
        path: 'form-register',
        element: <FormRegister />,
      },
      {
        path: 'log-out',
        element: <LogOut />,
      },
      {
        path: 'process',
        element: <Process />,
      },
    ],
  },

  {
    element: <PrivateRoutes />,
    children: [
      {
        path: 'admin-dashboard',
        element: <DashBoard />,
      },
      {
        path: 'admin-jobs',
        element: <AdminJob />,
      },
      {
        path: 'detail-admin-job/:id',
        element: <DetailAdminJob />,
      },
      {
        path: 'create-admin-jobs',
        element: <CreateAdminJob />,
      },
      {
        path: 'admin-manage-cv/:id',
        element: <AdminManageCV />,
      },
    ],
  },
];
