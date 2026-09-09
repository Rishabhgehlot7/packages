'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React2 from 'react';

// src/components/CartDrawer.tsx
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
  return /* @__PURE__ */ jsx(
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
      children: /* @__PURE__ */ jsxs(
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
            /* @__PURE__ */ jsxs("div", { style: { padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxs("h2", { style: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }, children: [
                "Your Cart (",
                items.reduce((s, i) => s + i.quantity, 0),
                ")"
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  style: { background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" },
                  children: "\u2715"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { padding: "12px 20px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", fontWeight: 600, color: isFreeShippingUnlocked ? "#16a34a" : "#374151", marginBottom: "6px" }, children: isFreeShippingUnlocked ? "\u{1F389} You unlocked FREE Delivery!" : `\u{1F69A} Add \u20B9${amountRemaining.toFixed(0)} more for FREE Delivery!` }),
              /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "6px", backgroundColor: "#e5e7eb", borderRadius: "999px", overflow: "hidden" }, children: /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx("div", { style: { flex: 1, overflowY: "auto", padding: "16px 20px" }, children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "40px 0", color: "#6b7280" }, children: [
              /* @__PURE__ */ jsx("div", { style: { fontSize: "40px", marginBottom: "12px" }, children: "\u{1F6D2}" }),
              /* @__PURE__ */ jsx("p", { style: { fontSize: "15px", fontWeight: 600 }, children: "Your cart is empty" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  style: { marginTop: "12px", background: "#000", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
                  children: "Start Shopping"
                }
              )
            ] }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: items.map((item) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: "12px" }, children: [
              item.image && /* @__PURE__ */ jsx(
                "img",
                {
                  src: item.image,
                  alt: item.title,
                  style: { width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" }
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ jsx("div", { style: { fontSize: "14px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: item.title }),
                item.variantTitle && /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", color: "#6b7280" }, children: item.variantTitle }),
                /* @__PURE__ */ jsxs("div", { style: { fontSize: "14px", fontWeight: 700, color: "#111827", marginTop: "4px" }, children: [
                  "\u20B9",
                  item.price
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px" }, children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onUpdateQuantity(item.id, item.quantity - 1),
                    style: { padding: "4px 8px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "12px" },
                    children: "-"
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { padding: "4px 8px", fontSize: "12px", fontWeight: 600 }, children: item.quantity }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onUpdateQuantity(item.id, item.quantity + 1),
                    style: { padding: "4px 8px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "12px" },
                    children: "+"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => onRemoveItem(item.id),
                  style: { background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "14px" },
                  children: "\u{1F5D1}\uFE0F"
                }
              )
            ] }, item.id)) }) }),
            items.length > 0 && /* @__PURE__ */ jsxs("div", { style: { padding: "16px 20px", borderTop: "1px solid #e5e7eb", backgroundColor: "#fafafa" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyItems: "center", justifyContent: "space-between", marginBottom: "12px" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", color: "#4b5563" }, children: "Subtotal:" }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "18px", fontWeight: 800, color: "#111827" }, children: [
                  "\u20B9",
                  subtotal.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsx(
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
  const [quantity, setQuantity] = React2.useState(1);
  return /* @__PURE__ */ jsxs(
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
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }, children: [
          image && /* @__PURE__ */ jsx(
            "img",
            {
              src: image,
              alt: title,
              style: { width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }, children: title }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }, children: [
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "14px", fontWeight: 700, color: "#111827" }, children: [
                "\u20B9",
                price
              ] }),
              compareAtPrice && compareAtPrice > price && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#9ca3af", textDecoration: "line-through" }, children: [
                "\u20B9",
                compareAtPrice
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setQuantity(Math.max(1, quantity - 1)),
                style: { padding: "6px 10px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
                children: "-"
              }
            ),
            /* @__PURE__ */ jsx("span", { style: { padding: "6px 8px", fontSize: "13px", fontWeight: 600, minWidth: "20px", textAlign: "center" }, children: quantity }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setQuantity(quantity + 1),
                style: { padding: "6px 10px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
                children: "+"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
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
          onBuyNow && inStock && /* @__PURE__ */ jsx(
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
  const [pincode, setPincode] = React2.useState(defaultPincode);
  const [loading, setLoading] = React2.useState(false);
  const [result, setResult] = React2.useState(null);
  const [error, setError] = React2.useState(null);
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
  return /* @__PURE__ */ jsxs("div", { style: { margin: "14px 0", fontFamily: "inherit" }, className: `boost-pincode-checker ${className}`, children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }, children: "\u{1F69A} Check Delivery & COD Availability:" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", maxWidth: "320px" }, children: [
      /* @__PURE__ */ jsx(
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
      /* @__PURE__ */ jsx(
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
    error && /* @__PURE__ */ jsx("div", { style: { color: "#dc2626", fontSize: "12px", marginTop: "6px" }, children: error }),
    result && /* @__PURE__ */ jsx("div", { style: { marginTop: "8px", fontSize: "12px", color: "#166534", background: "#f0fdf4", padding: "8px 12px", borderRadius: "6px", border: "1px solid #bbf7d0" }, children: result.isServiceable ? /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { children: [
        "\u2705 ",
        /* @__PURE__ */ jsxs("strong", { children: [
          "Delivery by ",
          result.estimatedDeliveryDate
        ] })
      ] }),
      result.isCodAvailable && /* @__PURE__ */ jsx("div", { style: { color: "#854d0e", marginTop: "2px" }, children: "\u{1F4B5} Cash on Delivery (COD) is available" })
    ] }) : /* @__PURE__ */ jsx("div", { style: { color: "#dc2626" }, children: "\u274C Pincode currently not serviceable for delivery" }) })
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
  return /* @__PURE__ */ jsxs("div", { style: containerStyle, className: `boost-trust-badges ${className}`, children: [
    showGenuineBadge && /* @__PURE__ */ jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#16a34a", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
      /* @__PURE__ */ jsx("span", { children: "100% Genuine" })
    ] }),
    showReturnsBadge && /* @__PURE__ */ jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#2563eb", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }),
        /* @__PURE__ */ jsx("path", { d: "M21 3v5h-5" }),
        /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }),
        /* @__PURE__ */ jsx("path", { d: "M8 16H3v5" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "7-Day Easy Returns" })
    ] }),
    showCodBadge && /* @__PURE__ */ jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#d97706", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
        /* @__PURE__ */ jsx("line", { x1: "2", y1: "10", x2: "22", y2: "10" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "COD Available" })
    ] }),
    showSecureBadge && /* @__PURE__ */ jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#4f46e5", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "256-Bit SSL Secure" })
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
  return /* @__PURE__ */ jsx("div", { className: `boost-order-timeline ${className}`, style: { padding: "16px 0", fontFamily: "inherit" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }, children: [
    /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: "14px", left: "20px", right: "20px", height: "3px", backgroundColor: "#e5e7eb", zIndex: 0 } }),
    STAGES.map((stage, idx) => {
      const isPassed = idx <= currentIndex;
      const isCurrent = idx === currentIndex;
      return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, minWidth: "60px" }, children: [
        /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx("div", { style: { marginTop: "8px", fontSize: "11px", fontWeight: isCurrent ? 700 : 500, color: isCurrent ? "#111827" : "#6b7280", textAlign: "center" }, children: stage.label }),
        dates[stage.id] && /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", color: "#9ca3af", marginTop: "2px" }, children: dates[stage.id] })
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-star-rating ${className}`,
      style: { display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "inherit" },
      children: [
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "2px" }, children: [1, 2, 3, 4, 5].map((star) => {
          const isFilled = clamped >= star;
          const isHalf = !isFilled && clamped >= star - 0.5;
          return /* @__PURE__ */ jsxs(
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
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "half-star", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: color }),
                  /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "transparent", stopOpacity: "1" })
                ] }) }),
                /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
              ]
            },
            star
          );
        }) }),
        showText && /* @__PURE__ */ jsxs("span", { style: { fontSize: `${size * 0.85}px`, fontWeight: 600, color: "#374151", marginLeft: "4px" }, children: [
          clamped.toFixed(1),
          reviewCount !== void 0 && /* @__PURE__ */ jsxs("span", { style: { color: "#6b7280", fontWeight: 400, marginLeft: "2px" }, children: [
            "(",
            reviewCount,
            ")"
          ] })
        ] })
      ]
    }
  );
};
var ProductGallery = ({
  images,
  title = "Product Image",
  layout = "thumbnails-bottom",
  aspectRatio = "portrait",
  enableZoom = true,
  className = ""
}) => {
  const [selectedIndex, setSelectedIndex] = React2.useState(0);
  const [isHovered, setIsHovered] = React2.useState(false);
  const [zoomPos, setZoomPos] = React2.useState({ x: 0, y: 0 });
  if (!images || images.length === 0) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          width: "100%",
          aspectRatio: aspectRatio === "portrait" ? "4/5" : aspectRatio === "square" ? "1/1" : "16/9",
          backgroundColor: "#f3f4f6",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: "13px"
        },
        children: "No Images Available"
      }
    );
  }
  const handleMouseMove = (e) => {
    if (!enableZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setZoomPos({ x, y });
  };
  const ratioStyle = {
    aspectRatio: aspectRatio === "portrait" ? "4/5" : aspectRatio === "square" ? "1/1" : "16/9"
  };
  const isThumbnailsLeft = layout === "thumbnails-left";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-product-gallery ${className}`,
      style: {
        display: "flex",
        flexDirection: isThumbnailsLeft ? "row-reverse" : "column",
        gap: "12px",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              ...ratioStyle,
              position: "relative",
              width: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              backgroundColor: "#f9fafb",
              border: "1px solid #f3f4f6",
              cursor: enableZoom ? "crosshair" : "default"
            },
            onMouseEnter: () => enableZoom && setIsHovered(true),
            onMouseLeave: () => enableZoom && setIsHovered(false),
            onMouseMove: handleMouseMove,
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: images[selectedIndex],
                  alt: `${title} - view ${selectedIndex + 1}`,
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: isHovered ? "none" : "transform 0.3s ease",
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isHovered ? "scale(2.2)" : "scale(1)"
                  }
                }
              ),
              images.length > 1 && /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "999px",
                    pointerEvents: "none",
                    backdropFilter: "blur(4px)"
                  },
                  children: [
                    selectedIndex + 1,
                    " / ",
                    images.length
                  ]
                }
              )
            ]
          }
        ),
        images.length > 1 && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: isThumbnailsLeft ? "column" : "row",
              gap: "8px",
              overflowX: isThumbnailsLeft ? "hidden" : "auto",
              overflowY: isThumbnailsLeft ? "auto" : "hidden",
              paddingBottom: isThumbnailsLeft ? "0" : "4px",
              scrollbarWidth: "none"
            },
            children: images.map((img, idx) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setSelectedIndex(idx),
                style: {
                  width: isThumbnailsLeft ? "64px" : "72px",
                  height: isThumbnailsLeft ? "80px" : "72px",
                  flexShrink: 0,
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: selectedIndex === idx ? "2px solid #000000" : "2px solid transparent",
                  opacity: selectedIndex === idx ? 1 : 0.65,
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  padding: 0,
                  backgroundColor: "#f3f4f6"
                },
                children: /* @__PURE__ */ jsx("img", { src: img, alt: `Thumb ${idx + 1}`, style: { width: "100%", height: "100%", objectFit: "cover" } })
              },
              idx
            ))
          }
        )
      ]
    }
  );
};
var VariantSelector = ({
  groups,
  selectedValues,
  onChange,
  className = ""
}) => {
  return /* @__PURE__ */ jsx("div", { className: `boost-variant-selector ${className}`, style: { display: "flex", flexDirection: "column", gap: "16px", fontFamily: "inherit" }, children: groups.map((group) => {
    const selected = selectedValues[group.name];
    const isColor = group.type === "color";
    return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#111827", letterSpacing: "0.05em" }, children: [
        group.name,
        ": ",
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, color: "#4b5563", textTransform: "none" }, children: selected || "None selected" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" }, children: group.options.map((opt) => {
        const isSelected = selected === opt.value;
        const isOutOfStock = opt.inStock === false;
        if (isColor && opt.colorHex) {
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: isOutOfStock,
              onClick: () => onChange(group.name, opt.value, opt),
              title: `${opt.value}${isOutOfStock ? " (Sold Out)" : ""}`,
              style: {
                width: "34px",
                height: "34px",
                borderRadius: "999px",
                backgroundColor: opt.colorHex,
                border: isSelected ? "3px solid #000000" : "2px solid #e5e7eb",
                outline: isSelected ? "2px solid #ffffff" : "none",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                opacity: isOutOfStock ? 0.35 : 1,
                position: "relative",
                transition: "transform 0.15s ease",
                transform: isSelected ? "scale(1.1)" : "scale(1)",
                padding: 0
              },
              children: isOutOfStock && /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    right: "0",
                    height: "2px",
                    backgroundColor: "#ef4444",
                    transform: "rotate(-45deg)"
                  }
                }
              )
            },
            opt.id
          );
        }
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: isOutOfStock,
            onClick: () => onChange(group.name, opt.value, opt),
            style: {
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: isSelected ? 800 : 600,
              border: isSelected ? "2px solid #000000" : "1px solid #d1d5db",
              backgroundColor: isSelected ? "#000000" : "#ffffff",
              color: isSelected ? "#ffffff" : isOutOfStock ? "#9ca3af" : "#111827",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              position: "relative",
              textDecoration: isOutOfStock ? "line-through" : "none",
              opacity: isOutOfStock ? 0.45 : 1,
              transition: "all 0.15s ease"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: opt.value }),
              opt.priceDelta && opt.priceDelta > 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", marginLeft: "4px", opacity: 0.8 }, children: [
                "(+\u20B9",
                opt.priceDelta,
                ")"
              ] })
            ]
          },
          opt.id
        );
      }) })
    ] }, group.name);
  }) });
};
var ProductCard = ({
  id,
  title,
  price,
  compareAtPrice,
  images,
  brand,
  rating,
  reviewCount,
  inStock = true,
  stockUrgencyText,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
  onClick,
  className = ""
}) => {
  const [isHovered, setIsHovered] = React2.useState(false);
  const mainImage = images[0] || "";
  const secondaryImage = images[1] || mainImage;
  const currentImage = isHovered && secondaryImage ? secondaryImage : mainImage;
  const discountPercent = compareAtPrice && compareAtPrice > price ? Math.round((compareAtPrice - price) / compareAtPrice * 100) : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-product-card ${className}`,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      style: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #f3f4f6",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: isHovered ? "0 10px 25px rgba(0,0,0,0.06)" : "none",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              position: "relative",
              width: "100%",
              aspectRatio: "4/5",
              backgroundColor: "#f9fafb",
              overflow: "hidden",
              cursor: onClick ? "pointer" : "default"
            },
            onClick,
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: currentImage,
                  alt: title,
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                    transform: isHovered ? "scale(1.04)" : "scale(1)"
                  }
                }
              ),
              discountPercent && discountPercent > 0 && /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em"
                  },
                  children: [
                    discountPercent,
                    "% OFF"
                  ]
                }
              ),
              stockUrgencyText && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    backgroundColor: "rgba(220, 38, 38, 0.9)",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backdropFilter: "blur(4px)"
                  },
                  children: stockUrgencyText
                }
              ),
              onToggleWishlist && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => {
                    e.stopPropagation();
                    onToggleWishlist();
                  },
                  style: {
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "999px",
                    backgroundColor: "#ffffff",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    padding: 0
                  },
                  children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: isWishlisted ? "#f43f5e" : "none",
                      stroke: isWishlisted ? "#f43f5e" : "#4b5563",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ jsx("path", { d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" })
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { padding: "14px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }, children: [
          brand && /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", fontWeight: 800, color: "#6b7280", textTransform: "uppercase" }, children: brand }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              onClick,
              style: {
                fontSize: "13px",
                fontWeight: 700,
                color: "#111827",
                margin: 0,
                cursor: onClick ? "pointer" : "default",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              },
              children: title
            }
          ),
          rating !== void 0 && /* @__PURE__ */ jsx(StarRating, { rating, reviewCount, size: 13 }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }, children: [
            /* @__PURE__ */ jsxs("span", { style: { fontSize: "15px", fontWeight: 800, color: "#111827" }, children: [
              "\u20B9",
              price
            ] }),
            compareAtPrice && compareAtPrice > price && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#9ca3af", textDecoration: "line-through" }, children: [
              "\u20B9",
              compareAtPrice
            ] })
          ] }),
          onAddToCart && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: !inStock,
              onClick: (e) => {
                e.stopPropagation();
                onAddToCart();
              },
              style: {
                marginTop: "4px",
                width: "100%",
                backgroundColor: inStock ? "#000000" : "#9ca3af",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                padding: "8px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: inStock ? "pointer" : "not-allowed",
                transition: "background-color 0.15s ease"
              },
              children: inStock ? "+ Add to Bag" : "Out of Stock"
            }
          )
        ] })
      ]
    }
  );
};
var QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className = ""
}) => {
  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };
  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && value < max) {
      onChange(value + 1);
    }
  };
  const sizeStyles = {
    sm: {
      padding: "4px 8px",
      fontSize: "13px",
      btnSize: "24px",
      gap: "8px"
    },
    md: {
      padding: "6px 12px",
      fontSize: "15px",
      btnSize: "30px",
      gap: "12px"
    },
    lg: {
      padding: "10px 16px",
      fontSize: "17px",
      btnSize: "36px",
      gap: "16px"
    }
  }[size];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-quantity-selector ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: sizeStyles.padding,
        gap: sizeStyles.gap,
        userSelect: "none",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto"
      },
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleDecrement,
            disabled: disabled || value <= min,
            "aria-label": "Decrease quantity",
            style: {
              width: sizeStyles.btnSize,
              height: sizeStyles.btnSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: value <= min ? "transparent" : "#ffffff",
              color: value <= min ? "#9ca3af" : "#111827",
              border: value <= min ? "none" : "1px solid #e5e7eb",
              borderRadius: "6px",
              cursor: value <= min ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: sizeStyles.fontSize,
              boxShadow: value <= min ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.15s ease"
            },
            children: /* @__PURE__ */ jsx("svg", { width: "12", height: "2", viewBox: "0 0 12 2", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M1 1H11", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontWeight: 600,
              fontSize: sizeStyles.fontSize,
              color: "#111827",
              minWidth: "24px",
              textAlign: "center",
              fontVariantNumeric: "tabular-nums"
            },
            children: value
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleIncrement,
            disabled: disabled || value >= max,
            "aria-label": "Increase quantity",
            style: {
              width: sizeStyles.btnSize,
              height: sizeStyles.btnSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: value >= max ? "transparent" : "#ffffff",
              color: value >= max ? "#9ca3af" : "#111827",
              border: value >= max ? "none" : "1px solid #e5e7eb",
              borderRadius: "6px",
              cursor: value >= max ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: sizeStyles.fontSize,
              boxShadow: value >= max ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.15s ease"
            },
            children: /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M6 1V11M1 6H11", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
};
var ReviewBreakdownBars = ({
  averageRating,
  totalReviews,
  breakdown,
  onFilterByStar,
  selectedStar = null,
  className = ""
}) => {
  const rows = [5, 4, 3, 2, 1].map((star) => {
    let count = 0;
    if (Array.isArray(breakdown)) {
      const item = breakdown.find((b) => b.star === star);
      count = item ? item.count : 0;
    } else if (breakdown && typeof breakdown === "object") {
      count = breakdown[star] || 0;
    }
    return { star, count };
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-review-breakdown ${className}`,
      style: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "32px",
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #f3f4f6"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "140px",
              padding: "12px 16px",
              textAlign: "center"
            },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "48px",
                    fontWeight: 800,
                    color: "#111827",
                    lineHeight: 1,
                    letterSpacing: "-0.02em"
                  },
                  children: averageRating.toFixed(1)
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { marginTop: "8px" }, children: /* @__PURE__ */ jsx(StarRating, { rating: averageRating, size: 20 }) }),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  style: {
                    fontSize: "13px",
                    color: "#6b7280",
                    marginTop: "8px",
                    fontWeight: 500
                  },
                  children: [
                    "Based on ",
                    totalReviews.toLocaleString(),
                    " reviews"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              flex: 1,
              minWidth: "220px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            },
            children: rows.map(({ star, count }) => {
              const percent = totalReviews > 0 ? Math.round(count / totalReviews * 100) : 0;
              const isSelected = selectedStar === star;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => onFilterByStar && onFilterByStar(star),
                  role: onFilterByStar ? "button" : void 0,
                  tabIndex: onFilterByStar ? 0 : void 0,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: onFilterByStar ? "pointer" : "default",
                    opacity: selectedStar !== null && !isSelected ? 0.45 : 1,
                    transition: "opacity 0.2s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          minWidth: "42px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#374151"
                        },
                        children: [
                          /* @__PURE__ */ jsx("span", { children: star }),
                          /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 20 20", fill: "#f59e0b", children: /* @__PURE__ */ jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          flex: 1,
                          height: "8px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "9999px",
                          overflow: "hidden",
                          position: "relative"
                        },
                        children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              height: "100%",
                              width: `${percent}%`,
                              backgroundColor: star >= 4 ? "#10b981" : star === 3 ? "#f59e0b" : "#ef4444",
                              borderRadius: "9999px",
                              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "span",
                      {
                        style: {
                          minWidth: "38px",
                          textAlign: "right",
                          fontSize: "12px",
                          color: "#6b7280",
                          fontWeight: 500,
                          fontVariantNumeric: "tabular-nums"
                        },
                        children: [
                          percent,
                          "%"
                        ]
                      }
                    )
                  ]
                },
                star
              );
            })
          }
        )
      ]
    }
  );
};
var AnnouncementBar = ({
  messages,
  couponCode,
  couponBadgeText = "USE CODE",
  linkUrl,
  linkText,
  closable = true,
  backgroundColor = "#111827",
  textColor = "#ffffff",
  accentColor = "#f59e0b",
  onClose,
  className = ""
}) => {
  const [isVisible, setIsVisible] = React2.useState(true);
  const [copied, setCopied] = React2.useState(false);
  const [currentIdx, setCurrentIdx] = React2.useState(0);
  const messageList = Array.isArray(messages) ? messages : [messages];
  React2.useEffect(() => {
    if (messageList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messageList.length);
    }, 4e3);
    return () => clearInterval(timer);
  }, [messageList.length]);
  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!couponCode) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const handleClose = (e) => {
    e.preventDefault();
    setIsVisible(false);
    if (onClose) onClose();
  };
  if (!isVisible || messageList.length === 0) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-announcement-bar ${className}`,
      style: {
        backgroundColor,
        color: textColor,
        padding: "8px 16px",
        fontSize: "13px",
        fontWeight: 500,
        position: "relative",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "all 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: messageList[currentIdx] }),
              couponCode && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleCopyCode,
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    border: `1px dashed ${accentColor}`,
                    borderRadius: "6px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: textColor,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    transition: "all 0.15s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("span", { style: { color: accentColor }, children: [
                      couponBadgeText,
                      ":"
                    ] }),
                    /* @__PURE__ */ jsx("span", { style: { textDecoration: "underline" }, children: couponCode }),
                    copied ? /* @__PURE__ */ jsx("span", { style: { color: "#10b981", marginLeft: "2px" }, children: "\u2713 Copied" }) : /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                      /* @__PURE__ */ jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                      /* @__PURE__ */ jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                    ] })
                  ]
                }
              ),
              linkUrl && linkText && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: linkUrl,
                  style: {
                    color: accentColor,
                    textDecoration: "underline",
                    fontWeight: 600,
                    marginLeft: "4px"
                  },
                  children: [
                    linkText,
                    " \u2192"
                  ]
                }
              )
            ]
          }
        ),
        closable && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleClose,
            "aria-label": "Dismiss banner",
            style: {
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: textColor,
              opacity: 0.7,
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
              /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] })
          }
        )
      ]
    }
  );
};
var Navbar = ({
  brandName = "BoostStore",
  logoUrl,
  navLinks = [
    { label: "Shop All", href: "/products" },
    { label: "Best Sellers", href: "/collections/bestsellers", badge: "HOT" },
    { label: "New Arrivals", href: "/collections/new" },
    { label: "Sale", href: "/collections/sale", isHighlight: true }
  ],
  searchPlaceholder = "Search for products, brands...",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  cartCount = 0,
  wishlistCount = 0,
  onCartClick,
  onWishlistClick,
  onAccountClick,
  onLinkClick,
  isLoggedIn = false,
  userName,
  sticky = true,
  className = ""
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React2.useState(false);
  const [localSearch, setLocalSearch] = React2.useState(searchValue || "");
  React2.useEffect(() => {
    if (searchValue !== void 0) {
      setLocalSearch(searchValue);
    }
  }, [searchValue]);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) onSearchChange(val);
  };
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && onSearchSubmit) {
      e.preventDefault();
      onSearchSubmit(localSearch);
    }
  };
  const handleNavigation = (href, e) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(href);
    }
    setMobileMenuOpen(false);
  };
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: `boost-navbar ${className}`,
      style: {
        position: sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 40,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f3f4f6",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        width: "100%"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                    "aria-label": "Toggle navigation menu",
                    className: "boost-mobile-hamburger",
                    style: {
                      display: "none",
                      // Overridden by media query or shown via flex in responsive layouts
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px",
                      color: "#111827"
                    },
                    children: mobileMenuOpen ? /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                      /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                      /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                    ] }) : /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                      /* @__PURE__ */ jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                      /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                      /* @__PURE__ */ jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/",
                    onClick: (e) => handleNavigation("/", e),
                    style: {
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    },
                    children: logoUrl ? /* @__PURE__ */ jsx("img", { src: logoUrl, alt: brandName, style: { height: "32px", width: "auto" } }) : /* @__PURE__ */ jsxs(
                      "span",
                      {
                        style: {
                          fontSize: "22px",
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: "#111827",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              style: {
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "28px",
                                height: "28px",
                                backgroundColor: "#111827",
                                color: "#ffffff",
                                borderRadius: "8px",
                                fontSize: "14px"
                              },
                              children: "\u26A1"
                            }
                          ),
                          brandName
                        ]
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "nav",
                {
                  className: "boost-desktop-nav",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "24px"
                  },
                  children: navLinks.map((link) => /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: link.href,
                      onClick: (e) => handleNavigation(link.href, e),
                      style: {
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: link.isHighlight ? "#ef4444" : "#374151",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "color 0.15s ease"
                      },
                      children: [
                        link.label,
                        link.badge && /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: {
                              fontSize: "10px",
                              fontWeight: 700,
                              backgroundColor: "#fee2e2",
                              color: "#ef4444",
                              padding: "2px 6px",
                              borderRadius: "9999px",
                              textTransform: "uppercase"
                            },
                            children: link.badge
                          }
                        )
                      ]
                    },
                    link.href
                  ))
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    flex: 1,
                    maxWidth: "360px",
                    position: "relative"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#9ca3af",
                          display: "flex",
                          alignItems: "center"
                        },
                        children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                          /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                          /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: localSearch,
                        onChange: handleSearchChange,
                        onKeyDown: handleSearchKeyDown,
                        placeholder: searchPlaceholder,
                        style: {
                          width: "100%",
                          padding: "9px 12px 9px 36px",
                          fontSize: "13px",
                          borderRadius: "9999px",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f9fafb",
                          outline: "none",
                          boxSizing: "border-box",
                          transition: "border-color 0.15s ease, box-shadow 0.15s ease"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onWishlistClick,
                    "aria-label": "Wishlist",
                    style: {
                      position: "relative",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      color: "#374151",
                      display: "flex",
                      alignItems: "center"
                    },
                    children: [
                      /* @__PURE__ */ jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) }),
                      wishlistCount > 0 && /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            backgroundColor: "#ef4444",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: 700,
                            borderRadius: "9999px",
                            minWidth: "16px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px"
                          },
                          children: wishlistCount
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onAccountClick,
                    "aria-label": "Account",
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      color: "#374151",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    },
                    children: [
                      /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
                        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
                      ] }),
                      isLoggedIn && userName && /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 600, color: "#111827" }, children: userName })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onCartClick,
                    "aria-label": "Shopping Cart",
                    style: {
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#111827",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "9999px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                      transition: "transform 0.1s ease"
                    },
                    children: [
                      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
                        /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                        /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
                      ] }),
                      /* @__PURE__ */ jsx("span", { children: "Cart" }),
                      cartCount > 0 && /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            backgroundColor: "#ffffff",
                            color: "#111827",
                            borderRadius: "9999px",
                            padding: "1px 6px",
                            fontSize: "11px",
                            fontWeight: 800
                          },
                          children: cartCount
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        mobileMenuOpen && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              borderTop: "1px solid #f3f4f6",
              backgroundColor: "#ffffff",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            },
            children: navLinks.map((link) => /* @__PURE__ */ jsxs(
              "a",
              {
                href: link.href,
                onClick: (e) => handleNavigation(link.href, e),
                style: {
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: link.isHighlight ? "#ef4444" : "#111827",
                  padding: "8px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                },
                children: [
                  /* @__PURE__ */ jsx("span", { children: link.label }),
                  link.badge && /* @__PURE__ */ jsx(
                    "span",
                    {
                      style: {
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: "#fee2e2",
                        color: "#ef4444",
                        padding: "2px 8px",
                        borderRadius: "9999px"
                      },
                      children: link.badge
                    }
                  )
                ]
              },
              link.href
            ))
          }
        )
      ]
    }
  );
};
var Footer = ({
  brandName = "BoostStore",
  description = "India\u2019s modern direct-to-consumer store delivering premium quality essentials straight to your doorstep.",
  columns = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "Best Sellers", href: "/collections/bestsellers" },
        { label: "New Arrivals", href: "/collections/new" },
        { label: "Special Offers", href: "/collections/sale" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Track Your Order", href: "/track-order" },
        { label: "Shipping & Delivery", href: "/shipping-policy" },
        { label: "Returns & Exchange", href: "/returns" },
        { label: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" }
      ]
    }
  ],
  onNewsletterSubmit,
  showPaymentBadges = true,
  copyrightYear = (/* @__PURE__ */ new Date()).getFullYear(),
  className = ""
}) => {
  const [email, setEmail] = React2.useState("");
  const [subscribed, setSubscribed] = React2.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    if (onNewsletterSubmit) onNewsletterSubmit(email);
    setSubscribed(true);
  };
  return /* @__PURE__ */ jsxs(
    "footer",
    {
      className: `boost-footer ${className}`,
      style: {
        backgroundColor: "#111827",
        color: "#9ca3af",
        padding: "60px 20px 30px",
        borderTop: "1px solid #1f2937",
        fontSize: "14px"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: "1280px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "40px",
              paddingBottom: "40px",
              borderBottom: "1px solid #1f2937"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      fontSize: "24px",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#ffffff",
                            color: "#111827",
                            borderRadius: "8px",
                            fontSize: "15px"
                          },
                          children: "\u26A1"
                        }
                      ),
                      brandName
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { style: { lineHeight: 1.6, margin: 0, fontSize: "13px", color: "#9ca3af" }, children: description }),
                /* @__PURE__ */ jsxs("div", { style: { marginTop: "8px" }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 600, color: "#f3f4f6", display: "block", marginBottom: "8px" }, children: "Subscribe for exclusive drops & offers" }),
                  subscribed ? /* @__PURE__ */ jsx(
                    "div",
                    {
                      style: {
                        color: "#34d399",
                        backgroundColor: "rgba(52, 211, 153, 0.1)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 600
                      },
                      children: "\u2713 You\u2019re on the VIP list! Check your inbox soon."
                    }
                  ) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", gap: "8px" }, children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "email",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        placeholder: "Enter your email",
                        required: true,
                        style: {
                          flex: 1,
                          padding: "10px 14px",
                          borderRadius: "8px",
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          color: "#ffffff",
                          fontSize: "13px",
                          outline: "none"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        style: {
                          padding: "10px 18px",
                          borderRadius: "8px",
                          backgroundColor: "#ffffff",
                          color: "#111827",
                          fontWeight: 700,
                          fontSize: "13px",
                          border: "none",
                          cursor: "pointer",
                          transition: "opacity 0.15s ease"
                        },
                        children: "Join"
                      }
                    )
                  ] })
                ] })
              ] }),
              columns.map((col, idx) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
                /* @__PURE__ */ jsx(
                  "h4",
                  {
                    style: {
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#ffffff",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: 0
                    },
                    children: col.title
                  }
                ),
                /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }, children: col.links.map((link, lIdx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: link.href,
                    style: {
                      color: "#9ca3af",
                      textDecoration: "none",
                      fontSize: "13px",
                      transition: "color 0.15s ease"
                    },
                    onMouseEnter: (e) => e.target.style.color = "#ffffff",
                    onMouseLeave: (e) => e.target.style.color = "#9ca3af",
                    children: link.label
                  }
                ) }, lIdx)) })
              ] }, idx))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: "1280px",
              margin: "24px auto 0",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              fontSize: "12px"
            },
            children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "\xA9 ",
                copyrightYear,
                " ",
                brandName,
                ". All rights reserved. Powered by BoostEngine."
              ] }),
              showPaymentBadges && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }, children: ["UPI", "RuPay", "VISA", "Mastercard", "NetBanking", "COD Available"].map((method) => /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    backgroundColor: "#1f2937",
                    color: "#d1d5db",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.02em"
                  },
                  children: method
                },
                method
              )) })
            ]
          }
        )
      ]
    }
  );
};
var MobileBottomBar = ({
  activeTab = "home",
  cartCount = 0,
  wishlistCount = 0,
  items,
  onTabChange,
  className = ""
}) => {
  const defaultItems = [
    { id: "home", label: "Home", icon: "home", href: "/" },
    { id: "search", label: "Search", icon: "search", href: "/search" },
    { id: "wishlist", label: "Wishlist", icon: "wishlist", badge: wishlistCount > 0 ? wishlistCount : void 0, href: "/wishlist" },
    { id: "cart", label: "Bag", icon: "cart", badge: cartCount > 0 ? cartCount : void 0, href: "/cart" },
    { id: "account", label: "Profile", icon: "account", href: "/account" }
  ];
  const barItems = items || defaultItems;
  const renderIcon = (type, isActive) => {
    const stroke = isActive ? "#111827" : "#6b7280";
    const strokeWidth = isActive ? "2.3" : "1.8";
    switch (type) {
      case "home":
        return /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, children: [
          /* @__PURE__ */ jsx("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
          /* @__PURE__ */ jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
        ] });
      case "search":
      case "categories":
        return /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, children: [
          /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
        ] });
      case "wishlist":
        return /* @__PURE__ */ jsx(
          "svg",
          {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: isActive ? "#ef4444" : "none",
            stroke: isActive ? "#ef4444" : stroke,
            strokeWidth,
            children: /* @__PURE__ */ jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
          }
        );
      case "cart":
        return /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, children: [
          /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
          /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
          /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
        ] });
      case "account":
        return /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, children: [
          /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: `boost-mobile-bottom-bar ${className}`,
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "8px 4px calc(8px + env(safe-area-inset-bottom, 0px))",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)"
      },
      children: barItems.map((item) => {
        const isActive = activeTab === item.id;
        const badgeValue = item.id === "cart" ? cartCount || item.badge : item.id === "wishlist" ? wishlistCount || item.badge : item.badge;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => onTabChange && onTabChange(item.id, item.href),
            "aria-label": item.label,
            style: {
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "4px 12px",
              flex: 1,
              maxWidth: "80px",
              color: isActive ? "#111827" : "#6b7280",
              transition: "color 0.15s ease, transform 0.1s ease"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
                renderIcon(item.icon, isActive),
                Boolean(badgeValue) && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      position: "absolute",
                      top: "-4px",
                      right: "-8px",
                      backgroundColor: item.id === "cart" ? "#111827" : "#ef4444",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      borderRadius: "9999px",
                      minWidth: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                      lineHeight: 1
                    },
                    children: badgeValue
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "-0.01em"
                  },
                  children: item.label
                }
              )
            ]
          },
          item.id
        );
      })
    }
  );
};
var LightningDealsBar = ({
  dealTitle = "\u26A1 LIGHTNING DEAL",
  endsAt,
  percentageClaimed = 78,
  totalQuantity,
  claimedQuantity,
  badgeColor = "#ef4444",
  className = ""
}) => {
  const [timeLeft, setTimeLeft] = React2.useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });
  React2.useEffect(() => {
    const end = new Date(endsAt).getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      if (diff === 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      setTimeLeft({ hours, minutes, seconds, isExpired: false });
    };
    update();
    const timer = setInterval(update, 1e3);
    return () => clearInterval(timer);
  }, [endsAt]);
  const pad = (n) => String(n).padStart(2, "0");
  let percent = percentageClaimed;
  if (totalQuantity && claimedQuantity !== void 0) {
    percent = Math.min(100, Math.round(claimedQuantity / totalQuantity * 100));
  }
  if (timeLeft.isExpired) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-lightning-deals-bar ${className}`,
      style: {
        backgroundColor: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      backgroundColor: badgeColor,
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    },
                    children: dealTitle
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 600, color: "#92400e" }, children: "Ends in:" })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      backgroundColor: "#1f2937",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontVariantNumeric: "tabular-nums"
                    },
                    children: [
                      pad(timeLeft.hours),
                      "h"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, color: "#92400e" }, children: ":" }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      backgroundColor: "#1f2937",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontVariantNumeric: "tabular-nums"
                    },
                    children: [
                      pad(timeLeft.minutes),
                      "m"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, color: "#92400e" }, children: ":" }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontVariantNumeric: "tabular-nums"
                    },
                    children: [
                      pad(timeLeft.seconds),
                      "s"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                height: "6px",
                backgroundColor: "#e5e7eb",
                borderRadius: "9999px",
                overflow: "hidden"
              },
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${percent}%`,
                    backgroundColor: percent > 85 ? "#dc2626" : "#f59e0b",
                    borderRadius: "9999px",
                    transition: "width 0.3s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "11px",
                color: "#78350f",
                fontWeight: 600
              },
              children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  percent,
                  "% Claimed"
                ] }),
                /* @__PURE__ */ jsx("span", { children: "Hurry, limited stock!" })
              ]
            }
          )
        ] })
      ]
    }
  );
};
var FrequentlyBoughtTogether = ({
  mainProduct,
  suggestedItems,
  bundleDiscountPercentage = 10,
  currencySymbol = "\u20B9",
  onAddBundleToCart,
  className = ""
}) => {
  const allItems = [mainProduct, ...suggestedItems];
  const [selectedIds, setSelectedIds] = React2.useState(
    allItems.map((i) => i.id)
  );
  const toggleItem = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const selectedItems = allItems.filter((i) => selectedIds.includes(i.id));
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = selectedItems.length > 1 ? Math.round(subtotal * bundleDiscountPercentage / 100) : 0;
  const finalPrice = subtotal - discountAmount;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-frequently-bought ${className}`,
      style: {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              style: {
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
                margin: 0,
                letterSpacing: "-0.01em"
              },
              children: "Frequently Bought Together"
            }
          ),
          selectedItems.length > 1 && /* @__PURE__ */ jsxs(
            "span",
            {
              style: {
                backgroundColor: "#ecfdf5",
                color: "#059669",
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "9999px",
                border: "1px solid #a7f3d0"
              },
              children: [
                "Save ",
                bundleDiscountPercentage,
                "% on Combo"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "8px"
            },
            children: allItems.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              return /* @__PURE__ */ jsxs(React2.Fragment, { children: [
                index > 0 && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      flexShrink: 0
                    },
                    children: "+"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => toggleItem(item.id),
                    style: {
                      width: "90px",
                      height: "90px",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px",
                      cursor: "pointer",
                      position: "relative",
                      opacity: isSelected ? 1 : 0.4,
                      transition: "all 0.2s ease",
                      flexShrink: 0
                    },
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: item.imageUrl,
                        alt: item.title,
                        style: {
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain"
                        }
                      }
                    )
                  }
                )
              ] }, item.id);
            })
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: allItems.map((item, idx) => {
          const isSelected = selectedIds.includes(item.id);
          return /* @__PURE__ */ jsxs(
            "label",
            {
              style: {
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: "13px",
                cursor: "pointer"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isSelected,
                    onChange: () => toggleItem(item.id),
                    style: {
                      marginTop: "3px",
                      accentColor: "#2563eb",
                      cursor: "pointer"
                    }
                  }
                ),
                /* @__PURE__ */ jsxs("span", { style: { color: isSelected ? "#111827" : "#6b7280", flex: 1 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: idx === 0 ? "This item: " : "" }),
                  item.title,
                  /* @__PURE__ */ jsxs("span", { style: { fontWeight: 700, marginLeft: "6px", color: "#111827" }, children: [
                    currencySymbol,
                    item.price.toLocaleString("en-IN")
                  ] })
                ] })
              ]
            },
            item.id
          );
        }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              paddingTop: "16px",
              borderTop: "1px solid #f3f4f6"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "8px" }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", color: "#6b7280" }, children: "Total price:" }),
                  /* @__PURE__ */ jsxs("span", { style: { fontSize: "20px", fontWeight: 800, color: "#111827" }, children: [
                    currencySymbol,
                    finalPrice.toLocaleString("en-IN")
                  ] }),
                  discountAmount > 0 && /* @__PURE__ */ jsxs(
                    "span",
                    {
                      style: {
                        fontSize: "14px",
                        color: "#9ca3af",
                        textDecoration: "line-through"
                      },
                      children: [
                        currencySymbol,
                        subtotal.toLocaleString("en-IN")
                      ]
                    }
                  )
                ] }),
                discountAmount > 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#059669", fontWeight: 600 }, children: [
                  "You save ",
                  currencySymbol,
                  discountAmount.toLocaleString("en-IN"),
                  " (",
                  bundleDiscountPercentage,
                  "% OFF)"
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onAddBundleToCart && onAddBundleToCart(selectedItems),
                  style: {
                    backgroundColor: "#facc15",
                    color: "#111827",
                    fontWeight: 700,
                    fontSize: "13px",
                    padding: "10px 20px",
                    borderRadius: "9999px",
                    border: "1px solid #eab308",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  },
                  children: [
                    "Add ",
                    selectedItems.length,
                    " items to Cart"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
var DEFAULT_OFFERS = [
  {
    id: "hdfc-instant",
    type: "instant",
    title: "Bank Offer: 10% Instant Discount",
    description: "Up to \u20B91,500 on HDFC Bank Credit & Debit Card EMI transactions on min purchase \u20B95,000.",
    code: "HDFC10"
  },
  {
    id: "sbi-instant",
    type: "instant",
    title: "Bank Offer: Flat \u20B91,250 Off",
    description: "On SBI Credit Card Non-EMI transactions on orders above \u20B910,000.",
    code: "SBISPECIAL"
  },
  {
    id: "no-cost-emi",
    type: "emi",
    title: "No Cost EMI Available",
    description: "Avail No Cost EMI on select cards for orders above \u20B93,000. Interest savings upfront."
  },
  {
    id: "supercoins-offer",
    type: "cashback",
    title: "SuperCoins / Pay Cashback",
    description: "Get extra 5% cashback or 4 SuperCoins per \u20B9100 for Gold & SuperStar members."
  }
];
var BankOffersAccordion = ({
  offers = DEFAULT_OFFERS,
  className = ""
}) => {
  const [expanded, setExpanded] = React2.useState(false);
  const displayedOffers = expanded ? offers : offers.slice(0, 2);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-bank-offers ${className}`,
      style: {
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#2563eb", strokeWidth: "2", children: [
            /* @__PURE__ */ jsx("rect", { x: "1", y: "4", width: "22", height: "16", rx: "2", ry: "2" }),
            /* @__PURE__ */ jsx("line", { x1: "1", y1: "10", x2: "23", y2: "10" })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 700, color: "#1e293b" }, children: "Available Offers & Discounts" }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              style: {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                marginLeft: "auto"
              },
              children: [
                offers.length,
                " Offers"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: displayedOffers.map((offer) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              backgroundColor: "#ffffff",
              border: "1px solid #edf2f7",
              borderRadius: "8px",
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      width: "6px",
                      height: "6px",
                      borderRadius: "9999px",
                      backgroundColor: "#2563eb",
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 700, color: "#0f172a" }, children: offer.title }),
                offer.code && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "10px",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: "1px dashed #cbd5e1",
                      marginLeft: "auto"
                    },
                    children: offer.code
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    fontSize: "11px",
                    color: "#64748b",
                    margin: "0 0 0 12px",
                    lineHeight: 1.4
                  },
                  children: offer.description
                }
              )
            ]
          },
          offer.id
        )) }),
        offers.length > 2 && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setExpanded(!expanded),
            style: {
              background: "none",
              border: "none",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 0",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            },
            children: [
              expanded ? "Show Less Offers" : `View ${offers.length - 2} More Offers`,
              /* @__PURE__ */ jsx(
                "svg",
                {
                  width: "12",
                  height: "12",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2.5",
                  style: {
                    transform: expanded ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s"
                  },
                  children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                }
              )
            ]
          }
        )
      ]
    }
  );
};
var AssuredBadge = ({
  type = "assured",
  className = ""
}) => {
  if (type === "prime") {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `boost-badge-prime ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "#002f34",
          color: "#00a8e1",
          fontSize: "11px",
          fontWeight: 800,
          fontStyle: "italic",
          padding: "2px 8px",
          borderRadius: "4px",
          letterSpacing: "0.05em"
        },
        children: [
          /* @__PURE__ */ jsx("span", { style: { color: "#ffffff" }, children: "BOOST" }),
          /* @__PURE__ */ jsx("span", { style: { color: "#00a8e1" }, children: "prime" }),
          /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#00a8e1", strokeWidth: "3", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
        ]
      }
    );
  }
  if (type === "supercoin") {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `boost-badge-supercoin ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "#fffbeb",
          color: "#b45309",
          border: "1px solid #fde68a",
          fontSize: "11px",
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: "9999px"
        },
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "14px",
                height: "14px",
                borderRadius: "9999px",
                backgroundColor: "#f59e0b",
                color: "#ffffff",
                fontSize: "9px",
                fontWeight: 900
              },
              children: "\u{1FA99}"
            }
          ),
          "SuperCoins Partner"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `boost-badge-assured ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#eef2ff",
        color: "#2874f0",
        border: "1px solid #bfdbfe",
        fontSize: "11px",
        fontWeight: 800,
        fontStyle: "italic",
        padding: "2px 8px",
        borderRadius: "4px"
      },
      children: [
        /* @__PURE__ */ jsx("span", { children: "Boost" }),
        /* @__PURE__ */ jsxs(
          "span",
          {
            style: {
              backgroundColor: "#2874f0",
              color: "#ffffff",
              padding: "1px 4px",
              borderRadius: "2px",
              fontSize: "10px",
              fontStyle: "normal",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "2px"
            },
            children: [
              "Assured",
              /* @__PURE__ */ jsx("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "#ffffff", strokeWidth: "3", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
            ]
          }
        )
      ]
    }
  );
};
var DualMobileActionBar = ({
  price,
  compareAtPrice,
  currencySymbol = "\u20B9",
  isWishlisted = false,
  isInCart = false,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        @media (min-width: 768px) {
          .boost-dual-mobile-action-bar {
            display: none !important;
          }
        }
      ` }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `boost-dual-mobile-action-bar md:hidden ${className}`,
        style: {
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          padding: "8px 12px calc(8px + env(safe-area-inset-bottom, 0px))",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.08)"
        },
        children: [
          onToggleWishlist && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onToggleWishlist,
              "aria-label": "Wishlist",
              style: {
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0
              },
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: isWishlisted ? "#ef4444" : "none",
                  stroke: isWishlisted ? "#ef4444" : "#6b7280",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onAddToCart,
              style: {
                flex: 1,
                height: "44px",
                backgroundColor: "#ff9f00",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 2px 4px rgba(255, 159, 0, 0.3)",
                transition: "transform 0.1s active"
              },
              children: [
                /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                  /* @__PURE__ */ jsx("circle", { cx: "9", cy: "21", r: "1" }),
                  /* @__PURE__ */ jsx("circle", { cx: "20", cy: "21", r: "1" }),
                  /* @__PURE__ */ jsx("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
                ] }),
                isInCart ? "In Cart" : "Add to Cart"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onBuyNow,
              style: {
                flex: 1,
                height: "44px",
                backgroundColor: "#fb641b",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 2px 4px rgba(251, 100, 27, 0.3)",
                transition: "transform 0.1s active"
              },
              children: [
                /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
                "Buy Now"
              ]
            }
          )
        ]
      }
    )
  ] });
};

export { AnnouncementBar, AssuredBadge, BankOffersAccordion, CartDrawer, DualMobileActionBar, Footer, FrequentlyBoughtTogether, LightningDealsBar, MobileBottomBar, Navbar, OrderTimeline, PincodeChecker, ProductCard, ProductGallery, QuantitySelector, ReviewBreakdownBars, StarRating, StickyAddToCart, TrustBadges, VariantSelector };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map