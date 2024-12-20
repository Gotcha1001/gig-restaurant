import HeaderClient from "./HeaderClient";
import HeaderServer from "./HeaderServer";

const Header = () => {
  return (
    <div>
      {/* Server-side component to handle user data */}
      <HeaderServer />

      {/* Client-side component to handle interactions like burger menu */}
      <HeaderClient />
    </div>
  );
};

export default Header;
