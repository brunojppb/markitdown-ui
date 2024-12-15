import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Theme } from "@radix-ui/themes";
import radixCSS from "@radix-ui/themes/styles.css?url";
import styles from "./app.css?url";
import { Toaster } from "react-hot-toast";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: radixCSS },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script src="py/pyodide.js" />
      </head>
      <body>
        <Theme
          accentColor="violet"
          grayColor="sand"
          radius="large"
          appearance="dark"
          scaling="95%"
        >
          <Toaster position="bottom-right" reverseOrder={false} />
          {children}

          {/* <ThemePanel /> */}
        </Theme>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container p-4 pt-16 mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
