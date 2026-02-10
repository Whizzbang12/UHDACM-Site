import { Fragment } from "react/jsx-runtime";
import NavbarSC from "../_components/Navbar/NavbarSC";
import Footer from "../_components/Footer/Footer";

export function WrapInNavbarAndFooter({ children }: { children: React.ReactNode }) {
  return (
    <Fragment key="PageWrapperNavbarFooter">
      <NavbarSC key="Navbar" />
      {children}
      <Footer key="Footer" />
    </Fragment>
  );
}