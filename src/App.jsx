import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "react-hot-toast";

import Router from "router/Router"
import UserProvider from "contexts/UserProvider";
import Layout from "layouts/Layout";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <Layout>
            <Router />
          </Layout>
        </UserProvider>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
