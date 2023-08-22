// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../Contexts/AuthProvider';

// export default function PrivateRoute({ element: Element, ...rest }) {
//   const { currentUser } = useAuth();

//   return (
//     <Route
//       {...rest}
//       element={() => (
//         currentUser ? <Element /> : <Navigate to="/login" />
//       )}
//     />
//   );
// }
