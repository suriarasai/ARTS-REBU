// Bottom Navigation bar: For mobile navigation

import { useRouter } from "next/router";
import { FaCalendar, FaChartLine, FaCompass, FaUser } from "react-icons/fa";
import { HREF } from "../constants";

const BottomNav = () => {
  const router = useRouter(); // For navigation

  return (
    <nav className="bottom-nav">
      <div className="mx-auto mt-3 flex h-16 max-w-md items-center justify-center px-6">
        {/* Iterating through the list of NavBar links to render them */}
        {links.map(({ href, label, icon }) => (
          <a
            className={`flex w-full flex-col items-center justify-center space-y-1 ${
              router.pathname === href
                ? "text-green-600 hover:text-green-700"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
            key={label}
            onClick={() => router.push(href)}
          >
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

interface navIconProps {
  label: string;
  href: string;
  image: any;
}

// Reusable function for creating NavBar buttons
const navIcon = ({ label, href, image }: navIconProps) => {
  /* 
		label	: the text on the navbar
		href	: where to redirect to
		image	: the icon to display in the navbar
	*/
  return {
    label: label,
    href: href,
    icon: image,
  };
};

const links = [
  navIcon({
    label: "Route",
    href: HREF.MAP,
    image: <FaCompass className="h-5 w-5" />,
  }),
  navIcon({
    label: "Trips",
    href: HREF.TRIPS,
    image: <FaCalendar className="h-5 w-5" />,
  }),
  navIcon({
    label: "Stats",
    href: HREF.STATS,
    image: <FaChartLine className="h-5 w-5" />,
  }),
  navIcon({
    label: "Profile",
    href: HREF.SETTINGS,
    image: <FaUser className="h-5 w-5" />,
  }),
];
