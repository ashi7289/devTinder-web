import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [buyingType, setBuyingType] = useState(null);
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type) => {
    setBuyingType(type);
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Dev Tinder",
        description: "Connect to other developers",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: "9999999999",
        },
        theme: {
          color: "#cd130a",
        },
        handler: verifyPremiumUser,
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    } finally {
      setBuyingType(null);
    }
  };
  return isUserPremium ? (
    "You're are already a premium user"
  ) : (
    <div className="m-4 md:m-10">
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
        <div className="card bg-neutral text-neutral-content rounded-box grid h-80 w-full md:w-96 place-items-center p-4 text-center shadow-xl">
          <h1 className="font-bold text-3xl">Silver Membership</h1>
          <ul>
            <li> - Chat with other people</li>
            <li> - 100 connection Requests per day</li>
            <li> - Blue Tick</li>
            <li> - 3 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("silver")}
            className="btn btn-secondary"
            disabled={buyingType !== null}
          >
            {buyingType === "silver" && (
              <span className="loading loading-spinner"></span>
            )}
            Buy Silver
          </button>
        </div>
        <div className="card bg-neutral text-neutral-content rounded-box grid h-80 w-full md:w-96 place-items-center p-4 text-center shadow-xl">
          <h1 className="font-bold text-3xl">Gold Membership</h1>
          <ul>
            <li> - Chat with other people</li>
            <li> - Inifinite connection Requests per day</li>
            <li> - Blue Tick</li>
            <li> - 6 months</li>
          </ul>
          <button
            onClick={() => handleBuyClick("gold")}
            className="btn btn-primary"
            disabled={buyingType !== null}
          >
            {buyingType === "gold" && (
              <span className="loading loading-spinner"></span>
            )}
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};
export default Premium;
