// Header.jsx
import HeaderMain from "../Home/HeaderMain";
import HeaderLow from "../Home/HeaderLow";

export default function Header({ showSearchBar = true}) {
  return (
    <>
      <HeaderMain showSearchBar={showSearchBar}/>
      <HeaderLow showSearchBar={showSearchBar}/>
    </>
  );
}
