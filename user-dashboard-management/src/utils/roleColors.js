export const getRoleBadgeColor = (role, darkMode) => {
  const lightColors = {
    admin: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    developer: "bg-green-100 text-green-700",
    engineer: "bg-teal-100 text-teal-700",
    designer: "bg-pink-100 text-pink-700",
    analyst: "bg-orange-100 text-orange-700",
    default: "bg-slate-100 text-slate-700",
  };
  const darkColors = {
    admin: "bg-purple-900 text-purple-300",
    manager: "bg-blue-900 text-blue-300",
    developer: "bg-green-900 text-green-300",
    engineer: "bg-teal-900 text-teal-300",
    designer: "bg-pink-900 text-pink-300",
    analyst: "bg-orange-900 text-orange-300",
    default: "bg-slate-700 text-slate-300",
  };
  const colors = darkMode ? darkColors : lightColors;
  return colors[role.toLowerCase()] || colors.default;
};
