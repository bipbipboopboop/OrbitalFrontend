import { Route, Routes } from "react-router-dom";
import "./App.css";

import SignupForm from "./Components/Forms/customer.signup.form";
import VendorSignupForm from "./Components/Forms/vendor.signup.form";

import Navbar from "./Components/Navbar";

import Main from "./Pages/Mainpage/Mainpage";
import VendorPage from "./Pages/Vendor/VendorPage";
import CreateMenu from "./Components/Forms/create.menu.form";
import ShopSettings from "./Pages/Vendor/ShopSettings";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />

        <Route path="signup" element={<SignupForm />} />
        <Route path="vendor_sign_up" element={<VendorSignupForm />} />

        <Route path="vendor/:shopID" element={<VendorPage />} />
        {/* <Route path="create_menu" element={<CreateMenu />} /> */}
        <Route path="create_menu" element={<ShopSettings />} />
      </Routes>
    </div>
  );
}

export default App;
