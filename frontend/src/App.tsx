import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import { Route, Routes } from "react-router-dom";
import { AuthProvider, getAuthContext, useAuth } from "./context/AuthContext";

function App() {
  console.log(getAuthContext());
  const auth = useAuth();

  return(
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        {auth?.isLoggedIn && auth.user && (
          <Route path="/chat" element={<Chat />} />
        )}
        <Route path="*" element={<NotFound/>}/>
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </main>
  )
}

export default App
