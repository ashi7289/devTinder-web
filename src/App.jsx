import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
// import Premium from "./components/Premium"; // Premium is on hold for now
import Chat from "./components/Chat";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import { ToastProvider } from "./components/ui/Toast";

function App() {
  return (
    <ErrorBoundary>
      <Provider store={appStore}>
        <ToastProvider>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />}>
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Feed />
                    </PrivateRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/connections"
                  element={
                    <PrivateRoute>
                      <Connections />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/requests"
                  element={
                    <PrivateRoute>
                      <Requests />
                    </PrivateRoute>
                  }
                />
                {/* Premium is on hold for now
              <Route
                path="/premium"
                element={
                  <PrivateRoute>
                    <Premium />
                  </PrivateRoute>
                }
              />
              */}
                <Route
                  path="/chat/:targetUserId"
                  element={
                    <PrivateRoute>
                      <Chat />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
