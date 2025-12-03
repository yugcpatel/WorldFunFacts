import { BrowserRouter, Routes, Route } from "react-router-dom";
import Documentation from "./components/Documentation.jsx";
import App from "./components/App.jsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/docs" element={<Documentation />} />
            </Routes>
        </BrowserRouter>
    );
}
