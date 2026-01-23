import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LayoutProvider, ToastProvider } from "./providers";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "../shared/components/ErrorBoundary";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <ErrorBoundary message="Application encountered an unexpected error. Please refresh the page.">
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <ToastProvider>
            <LayoutProvider>
              <ErrorBoundary message="Navigation error occurred. Please try again.">
                <AppRoutes />
              </ErrorBoundary>
            </LayoutProvider>
          </ToastProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;