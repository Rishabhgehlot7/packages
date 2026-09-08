'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React2 = require('react');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React2__namespace = /*#__PURE__*/_interopNamespace(React2);

var CartDrawer = ({
  isOpen,
  onClose,
  items,
  subtotal,
  freeShippingThreshold = 999,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  className = ""
}) => {
  if (!isOpen) return null;
  const amountRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round(subtotal / freeShippingThreshold * 100));
  const isFreeShippingUnlocked = amountRemaining === 0;
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: `boost-cart-drawer-backdrop ${className}`,
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 1e3,
        display: "flex",
        justifyContent: "flex-end",
        fontFamily: "inherit"
      },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        "div",
        {
          style: {
            width: "100%",
            maxWidth: "420px",
            height: "100%",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-4px 0 25px rgba(0, 0, 0, 0.15)"
          },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntime.jsxs("h2", { style: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }, children: [
                "Your Cart (",
                items.reduce((s, i) => s + i.quantity, 0),
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: onClose,
                  style: { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" },
                  children: "\u2715"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "12px 20px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }, children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "12px", fontWeight: 600, color: isFreeShippingUnlocked ? "#16a34a" : "#374151", marginBottom: "6px" }, children: isFreeShippingUnlocked ? "\u{1F389} You unlocked FREE Delivery!" : `\u{1F69A} Add \u20B9${amountRemaining.toFixed(0)} more for FREE Delivery!` }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { style: { width: "100%", height: "6px", backgroundColor: "#e5e7eb", borderRadius: "999px", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                "div",
                {
                  style: {
                    width: `${progressPercent}%`,
                    height: "100%",
                    backgroundColor: isFreeShippingUnlocked ? "#16a34a" : "#2563eb",
                    transition: "width 0.3s ease"
                  }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { flex: 1, overflowY: "auto", padding: "16px 20px" }, children: items.length === 0 ? /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { textAlign: "center", padding: "40px 0", color: "#6b7280" }, children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "40px", marginBottom: "12px" }, children: "\u{1F6D2}" }),
              /* @__PURE__ */ jsxRuntime.jsx("p", { style: { fontSize: "15px", fontWeight: 600 }, children: "Your cart is empty" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: onClose,
                  style: { marginTop: "12px", background: "#000", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
                  children: "Start Shopping"
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: items.map((item) => /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: "12px" }, children: [
              item.image && /* @__PURE__ */ jsxRuntime.jsx(
                "img",
                {
                  src: item.image,
                  alt: item.title,
                  style: { width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" }
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "14px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: item.title }),
                item.variantTitle && /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "12px", color: "#6b7280" }, children: item.variantTitle }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { fontSize: "14px", fontWeight: 700, color: "#111827", marginTop: "4px" }, children: [
                  "\u20B9",
                  item.price
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px" }, children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    onClick: () => onUpdateQuantity(item.id, item.quantity - 1),
                    style: { padding: "4px 8px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "12px" },
                    children: "-"
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx("span", { style: { padding: "4px 8px", fontSize: "12px", fontWeight: 600 }, children: item.quantity }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  "button",
                  {
                    onClick: () => onUpdateQuantity(item.id, item.quantity + 1),
                    style: { padding: "4px 8px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "12px" },
                    children: "+"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: () => onRemoveItem(item.id),
                  style: { background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "14px" },
                  children: "\u{1F5D1}\uFE0F"
                }
              )
            ] }, item.id)) }) }),
            items.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { padding: "16px 20px", borderTop: "1px solid #e5e7eb", backgroundColor: "#fafafa" }, children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "12px" }, children: [
                /* @__PURE__ */ jsxRuntime.jsx("span", { style: { fontSize: "14px", color: "#4b5563" }, children: "Subtotal:" }),
                /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { fontSize: "18px", fontWeight: 800, color: "#111827" }, children: [
                  "\u20B9",
                  subtotal.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "button",
                {
                  onClick: onCheckout,
                  style: {
                    width: "100%",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "14px",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: "pointer"
                  },
                  children: "Proceed to Checkout \u2192"
                }
              )
            ] })
          ]
        }
      )
    }
  );
};
var StickyAddToCart = ({
  title,
  price,
  compareAtPrice,
  image,
  onAddToCart,
  onBuyNow,
  inStock = true,
  className = ""
}) => {
  const [quantity, setQuantity] = React2__namespace.useState(1);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: `boost-sticky-add-to-cart ${className}`,
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
        borderTop: "1px solid #e5e7eb",
        padding: "10px 16px",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }, children: [
          image && /* @__PURE__ */ jsxRuntime.jsx(
            "img",
            {
              src: image,
              alt: title,
              style: { width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" }
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "13px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }, children: title }),
            /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }, children: [
              /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { fontSize: "14px", fontWeight: 700, color: "#111827" }, children: [
                "\u20B9",
                price
              ] }),
              compareAtPrice && compareAtPrice > price && /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { fontSize: "12px", color: "#9ca3af", textDecoration: "line-through" }, children: [
                "\u20B9",
                compareAtPrice
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden" }, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => setQuantity(Math.max(1, quantity - 1)),
                style: { padding: "6px 10px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
                children: "-"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx("span", { style: { padding: "6px 8px", fontSize: "13px", fontWeight: 600, minWidth: "20px", textAlign: "center" }, children: quantity }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "button",
              {
                onClick: () => setQuantity(quantity + 1),
                style: { padding: "6px 10px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
                children: "+"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => onAddToCart(quantity),
              disabled: !inStock,
              style: {
                backgroundColor: inStock ? "#000000" : "#9ca3af",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: inStock ? "pointer" : "not-allowed",
                whiteSpace: "nowrap"
              },
              children: inStock ? "Add to Cart" : "Sold Out"
            }
          ),
          onBuyNow && inStock && /* @__PURE__ */ jsxRuntime.jsx(
            "button",
            {
              onClick: () => onBuyNow(quantity),
              style: {
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap"
              },
              children: "Buy Now"
            }
          )
        ] })
      ]
    }
  );
};
var PincodeChecker = ({
  onCheck,
  defaultPincode = "",
  className = ""
}) => {
  const [pincode, setPincode] = React2__namespace.useState(defaultPincode);
  const [loading, setLoading] = React2__namespace.useState(false);
  const [result, setResult] = React2__namespace.useState(null);
  const [error, setError] = React2__namespace.useState(null);
  const handleCheck = async () => {
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError("Please enter a valid 6-digit Indian pincode");
      setResult(null);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (onCheck) {
        const res = await onCheck(clean);
        setResult(res);
      } else {
        const deliveryDate = /* @__PURE__ */ new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const options = { weekday: "short", month: "short", day: "numeric" };
        setResult({
          isServiceable: true,
          estimatedDeliveryDate: deliveryDate.toLocaleDateString("en-IN", options),
          isCodAvailable: true,
          courier: "Express Courier"
        });
      }
    } catch (err) {
      setError(err.message || "Failed to verify pincode");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { margin: "14px 0", fontFamily: "inherit" }, className: `boost-pincode-checker ${className}`, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }, children: "\u{1F69A} Check Delivery & COD Availability:" }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", gap: "8px", maxWidth: "320px" }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        "input",
        {
          type: "text",
          maxLength: 6,
          placeholder: "Enter 6-digit Pincode",
          value: pincode,
          onChange: (e) => setPincode(e.target.value.replace(/\D/g, "")),
          onKeyDown: (e) => e.key === "Enter" && handleCheck(),
          style: {
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "13px",
            outline: "none"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        "button",
        {
          onClick: handleCheck,
          disabled: loading,
          style: {
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer"
          },
          children: loading ? "Checking..." : "Check"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntime.jsx("div", { style: { color: "#dc2626", fontSize: "12px", marginTop: "6px" }, children: error }),
    result && /* @__PURE__ */ jsxRuntime.jsx("div", { style: { marginTop: "8px", fontSize: "12px", color: "#166534", background: "#f0fdf4", padding: "8px 12px", borderRadius: "6px", border: "1px solid #bbf7d0" }, children: result.isServiceable ? /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        "\u2705 ",
        /* @__PURE__ */ jsxRuntime.jsxs("strong", { children: [
          "Delivery by ",
          result.estimatedDeliveryDate
        ] })
      ] }),
      result.isCodAvailable && /* @__PURE__ */ jsxRuntime.jsx("div", { style: { color: "#854d0e", marginTop: "2px" }, children: "\u{1F4B5} Cash on Delivery (COD) is available" })
    ] }) : /* @__PURE__ */ jsxRuntime.jsx("div", { style: { color: "#dc2626" }, children: "\u274C Pincode currently not serviceable for delivery" }) })
  ] });
};
var TrustBadges = ({
  layout = "row",
  showCodBadge = true,
  showReturnsBadge = true,
  showSecureBadge = true,
  showGenuineBadge = true,
  className = ""
}) => {
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: layout === "grid" ? "space-between" : "flex-start",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #f3f4f6",
    margin: "12px 0"
  };
  const badgeItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#374151"
  };
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: containerStyle, className: `boost-trust-badges ${className}`, children: [
    showGenuineBadge && /* @__PURE__ */ jsxRuntime.jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxRuntime.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#16a34a", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "100% Genuine" })
    ] }),
    showReturnsBadge && /* @__PURE__ */ jsxRuntime.jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#2563eb", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M21 3v5h-5" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M8 16H3v5" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "7-Day Easy Returns" })
    ] }),
    showCodBadge && /* @__PURE__ */ jsxRuntime.jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#d97706", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
        /* @__PURE__ */ jsxRuntime.jsx("line", { x1: "2", y1: "10", x2: "22", y2: "10" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "COD Available" })
    ] }),
    showSecureBadge && /* @__PURE__ */ jsxRuntime.jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxRuntime.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#4f46e5", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsxRuntime.jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("span", { children: "256-Bit SSL Secure" })
    ] })
  ] });
};
var STAGES = [
  { id: "placed", label: "Order Placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" }
];
var OrderTimeline = ({
  currentStage,
  dates = {},
  className = ""
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: `boost-order-timeline ${className}`, style: { padding: "16px 0", fontFamily: "inherit" }, children: /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }, children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { style: { position: "absolute", top: "14px", left: "20px", right: "20px", height: "3px", backgroundColor: "#e5e7eb", zIndex: 0 } }),
    STAGES.map((stage, idx) => {
      const isPassed = idx <= currentIndex;
      const isCurrent = idx === currentIndex;
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, minWidth: "60px" }, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            style: {
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              backgroundColor: isPassed ? "#16a34a" : "#ffffff",
              border: `2px solid ${isPassed ? "#16a34a" : "#d1d5db"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              boxShadow: isCurrent ? "0 0 0 4px rgba(22, 163, 74, 0.2)" : "none"
            },
            children: isPassed ? "\u2713" : idx + 1
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { marginTop: "8px", fontSize: "11px", fontWeight: isCurrent ? 700 : 500, color: isCurrent ? "#111827" : "#6b7280", textAlign: "center" }, children: stage.label }),
        dates[stage.id] && /* @__PURE__ */ jsxRuntime.jsx("div", { style: { fontSize: "10px", color: "#9ca3af", marginTop: "2px" }, children: dates[stage.id] })
      ] }, stage.id);
    })
  ] }) });
};
var StarRating = ({
  rating,
  reviewCount,
  size = 16,
  color = "#f59e0b",
  // Amber-500 gold
  showText = true,
  className = ""
}) => {
  const clamped = Math.max(0, Math.min(5, rating));
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: `boost-star-rating ${className}`,
      style: { display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "inherit" },
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { style: { display: "flex", gap: "2px" }, children: [1, 2, 3, 4, 5].map((star) => {
          const isFilled = clamped >= star;
          const isHalf = !isFilled && clamped >= star - 0.5;
          return /* @__PURE__ */ jsxRuntime.jsxs(
            "svg",
            {
              width: size,
              height: size,
              viewBox: "0 0 24 24",
              fill: isFilled ? color : isHalf ? "url(#half-star)" : "none",
              stroke: color,
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("defs", { children: /* @__PURE__ */ jsxRuntime.jsxs("linearGradient", { id: "half-star", children: [
                  /* @__PURE__ */ jsxRuntime.jsx("stop", { offset: "50%", stopColor: color }),
                  /* @__PURE__ */ jsxRuntime.jsx("stop", { offset: "50%", stopColor: "transparent", stopOpacity: "1" })
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
              ]
            },
            star
          );
        }) }),
        showText && /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { fontSize: `${size * 0.85}px`, fontWeight: 600, color: "#374151", marginLeft: "4px" }, children: [
          clamped.toFixed(1),
          reviewCount !== void 0 && /* @__PURE__ */ jsxRuntime.jsxs("span", { style: { color: "#6b7280", fontWeight: 400, marginLeft: "2px" }, children: [
            "(",
            reviewCount,
            ")"
          ] })
        ] })
      ]
    }
  );
};

exports.CartDrawer = CartDrawer;
exports.OrderTimeline = OrderTimeline;
exports.PincodeChecker = PincodeChecker;
exports.StarRating = StarRating;
exports.StickyAddToCart = StickyAddToCart;
exports.TrustBadges = TrustBadges;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map