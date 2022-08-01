import api from "../Services/api";
import { slugify } from "./helper.function";

export const storeAuth = (responseData) => {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      access: responseData.access,
      refresh: responseData.refresh,
    })
  );
};

export const getAuth = () => {
  return JSON.parse(localStorage.getItem("auth"));
};

export const getAccessToken = () => {
  return getAuth()?.access;
};

export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getUserID = () => {
  const userInfo = getUserInfo();
  return userInfo.id;
};

export const storeUserInfo = async () => {
  const url = "/auth/users/me";
  const response = await api.get(url);
  const userData = response.data;
  localStorage.setItem("user", JSON.stringify(userData));
};

export const handleSignUp = async ({ userInfo }) => {
  const url = "/auth/users/";

  if (userInfo.password === userInfo.re_password) {
    const createdResponse = await api.post(url, userInfo);
    if (createdResponse?.status === 201) {
      alert("Sign up successful!");
      return createdResponse?.data;
    }
    alert(createdResponse?.data);
    return null;
  } else {
    alert("Passwords do not match!");
    return null;
  }
};

export const handleCustomerSignUp = async ({ userInfo }) => {
  const url = "/store/customers/";
  try {
    /*
    {
        "id": int,
        "username": str,
        "email": str,
        "first_name": str,
        "last_name": str,
        "is_vendor": boolean
    }
    */
    const userData = await handleSignUp({ userInfo });
    if (userData) {
      const response = await api.post(url, { user_id: userData?.id });
      return response?.data;
    }
  } catch (error) {
    alert(error);
  }
};

export const handleVendorSignUp = async ({ userInfo, shopInfo }) => {
  console.log({ userInfo, shopInfo });
  const url = "/store/owners/";
  try {
    // Create a User first
    const userData = await handleSignUp({ userInfo });
    // Then Create Shop
    if (userData !== 404) {
      // Map User to the Owner model, and link the user to the newly created shop
      // Link this user to the shop
      try {
        const shopData = await createShop({ shopInfo });
        await api.post(url, {
          user: userData.id,
          shop: shopData.id,
        });
      } catch (error) {
        const errorMsg = JSON.stringify(error.response.data);
        alert(errorMsg);
        return 404;
      }
    }
  } catch (error) {
    const errorMsg = JSON.stringify(error.response.data);
    alert(errorMsg);
  }
};

export const handleSignIn = async ({ loginInfo }) => {
  const url = "/auth/jwt/create";

  try {
    const loginResponse = await api.post(url, JSON.stringify(loginInfo));
    const tokens = loginResponse.data;
    storeAuth(tokens);
    await storeUserInfo();
    return tokens;
  } catch (error) {
    return 404;
  }
};
export const handleSignOut = (setIsLoggedIn, setUser) => {
  localStorage.clear();
  setUser();
  setIsLoggedIn(false);
};

// Owner
// _____________________________________________________________________________
export const getOwnerInfo = async () => {
  const url = "/store/owners/me";
  try {
    const ownerResponse = await api.get(url);
    const ownerInfo = ownerResponse.data;
    return ownerInfo;
  } catch (error) {
    console.log({ error });
    return 404;
  }
};

const createShop = async ({ shopInfo }) => {
  const url = "/store/shops/";
  const shopInfoWithSlug = { ...shopInfo, slug: slugify(shopInfo.name) };
  try {
    const shopCreatedResponse = await api.post(url, shopInfoWithSlug);
    return shopCreatedResponse.data;
  } catch (error) {
    console.log(error);
    return 404;
  }
  //   {
  //     "name": "",
  //     "description": "",
  //     "address": "",
  //     "slug": "",
  //     "image_link": ""
  // }
};
