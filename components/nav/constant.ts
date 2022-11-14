import mytraker from "../../assets/navSvg/mytraker.svg";
import find from "../../assets/navSvg/find.svg";
import moments from "../../assets/navSvg/moments.svg";
import account from "../../assets/navSvg/account.svg";

import aMytraker from "../../assets/navSvg/active-mytraker.svg";
import aFind from "../../assets/navSvg/active-find.svg";
import aMoments from "../../assets/navSvg/active-moments.svg";
import aAccount from "../../assets/navSvg/active-account.svg";
const navList = [
  {
    navigate: "/host",
    img: mytraker,
    activeImg: aMytraker,
    message: "My Traker",
  },
  {
    navigate: "/find",
    img: find,
    activeImg: aFind,
    message: "Find",
  },
  {
    navigate: "/moments",
    img: moments,
    activeImg: aMoments,
    message: "Monment",
  },
  {
    activeImg: aAccount,
    img: account,
    message: "Account",
  },
];
export default navList;
