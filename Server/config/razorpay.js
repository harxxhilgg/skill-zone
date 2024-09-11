import Razorpay from "razorpay";

export const instance = new Razorpay({
    key_id: process.env.REACT_APP_RAZORPAY_KEY,
    key_secret: "3qooRrtYWMtj5mCTy1uFMZxI",
})