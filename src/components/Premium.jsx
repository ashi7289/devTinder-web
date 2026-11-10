import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./ui/Icon";

const PLANS = [
  {
    type: "silver",
    name: "Silver",
    duration: "3 months",
    tagline: "For devs getting started with networking.",
    features: [
      "Chat with other developers",
      "100 connection requests per day",
      "Blue tick on your profile",
      "Valid for 3 months",
    ],
  },
  {
    type: "gold",
    name: "Gold",
    duration: "6 months",
    tagline: "For devs who want to meet everyone.",
    popular: true,
    features: [
      "Chat with other developers",
      "Unlimited connection requests",
      "Blue tick on your profile",
      "Valid for 6 months",
    ],
  },
];

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
          color: "#ff3d71",
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

  if (isUserPremium)
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-24 text-center animate-fade-up">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-warning to-secondary text-white shadow-xl shadow-warning/30">
          <Icon name="crown" className="h-10 w-10" />
        </div>
        <h1 className="page-title">
          You&apos;re <span className="text-gradient">Premium</span> 🎉
        </h1>
        <p className="max-w-sm text-base-content/60">
          Enjoy your perks — more requests, chat and a blue tick on your profile.
        </p>
        <Link to="/" className="btn-gradient mt-2">
          Back to discovering
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10">
      <div className="mb-12 text-center">
        <span className="chip mb-4 border-warning/30 bg-warning/10 text-warning">
          <Icon name="crown" className="h-3.5 w-3.5" /> DevTinder Premium
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Level up your <span className="text-gradient">network</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-base-content/60">
          Get noticed faster, send more requests and chat with every developer
          you match with.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.type}
            className={
              "relative rounded-[1.75rem] p-[1px] animate-fade-up " +
              (plan.popular
                ? "bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl shadow-primary/20"
                : "bg-white/10")
            }
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                Most popular
              </span>
            )}
            <div className="flex h-full flex-col rounded-[1.7rem] bg-base-200 p-8">
              <div className="flex items-center gap-3">
                <div
                  className={
                    "grid h-11 w-11 place-items-center rounded-xl " +
                    (plan.popular
                      ? "bg-gradient-to-br from-warning to-secondary text-white"
                      : "bg-white/10 text-base-content")
                  }
                >
                  <Icon name={plan.popular ? "crown" : "zap"} className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  <p className="font-mono text-xs text-base-content/50">
                    {plan.duration}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-base-content/60">{plan.tagline}</p>

              <ul className="my-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                      <Icon name="check" className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-base-content/80">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuyClick(plan.type)}
                className={
                  plan.popular
                    ? "btn-gradient w-full"
                    : "btn w-full border-white/10 bg-base-300 hover:bg-white/10"
                }
                disabled={buyingType !== null}
              >
                {buyingType === plan.type && (
                  <span className="loading loading-spinner"></span>
                )}
                Get {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 flex items-center justify-center gap-2 text-sm text-base-content/40">
        <Icon name="shield" className="h-4 w-4" /> Secure payments via Razorpay
      </p>
    </div>
  );
};
export default Premium;
