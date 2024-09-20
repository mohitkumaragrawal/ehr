import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";
import WalletBalance from "./WalletBalance";

export default function MyNavBar() {
  return (
    <Navbar>
      <NavbarBrand>
        <span className="text-lg font-semibold">EHR</span>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/patient">
            Patients
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/doctor">
            Doctors
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/add-doctor">
            Add Doctor
          </Link>
        </NavbarItem>
        <WalletBalance />
      </NavbarContent>
    </Navbar>
  );
}
