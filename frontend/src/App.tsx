import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import Wall from "./pages/wall";
import Sales from "./pages/sales";
import Shopping from "./pages/shopping";
import PostPage from "./pages/post";
import ProfilePage from "./pages/Profile";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
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
      </Routes>
    </Router>
  );
}
export default App;