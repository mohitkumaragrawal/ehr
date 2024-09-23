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
          <Link color="foreground" href="/register">
            Register
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/upload">
            Upload
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/view">
            View
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/pending">
            Pending Requests
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/request">
            Request
          </Link>
        </NavbarItem>
        <WalletBalance />
      </NavbarContent>
    </Navbar>
  );
}
