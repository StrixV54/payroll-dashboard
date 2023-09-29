import { useLocation, useRouteError } from "react-router-dom";

export default function NoMatch() {
  let location = useLocation();

  return (
    <div id="error-page">
      <h1>404</h1>
      <p>Sorry, You might not be authorized. Please check with your administrator.</p>
      <p>
      No match for <code>{location.pathname}</code>
      </p>
    </div>
  );
}

// export default function ErrorPage() {
//   const error: any = useRouteError();
//   console.error(error);

//   return (
//     <div id="error-page">
//       <h1>Oops!</h1>
//       <p>Sorry, an unexpected error has occurred.</p>
//       <p>
//         <i>{error.statusText || error.message}</i>
//       </p>
//     </div>
//   );
// }

