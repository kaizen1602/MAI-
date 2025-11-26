import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Wall from "./pages/wall";
import Sales from "./pages/sales";
import Shopping from "./pages/shopping";
import PostPage from "./pages/post";
import ProfilePage from "./pages/Profile";
import Charts from "./pages/Charts";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./data/context/AuthContext";
import { PurchaseProvider } from "./data/context/PurchaseContext";

function App() {
  return (
    <AuthProvider>
      <PurchaseProvider>
        <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/wall" element={<Wall />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/charts" element={<Charts />} />
          </Routes>
        </Router>
      </PurchaseProvider>
    </AuthProvider>
  );
}
export default App;