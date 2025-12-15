import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LOGIN_BUTTON, navLinks } from "@/constants/header";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
   <div className="py-5 bg-white border border-b border-[#ececec]">
    <div className="container">
        <div className="flex items-center">
            <span className="mr-4">Logo</span>
            <div className="flex flex-1 justify-center px-4">
                <ul className="flex flex-wrap gap-8">
                    {navLinks?.map((navLink: any) => (
                        <li key={navLink.id}>
                            <Link className="px-2 py-1" href={navLink.href}>{navLink.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="ml-auto flex items-center">
                <div className="mr-5">
                    <Input placeholder="Search" type="search" />
                </div>
                <Button className="cursor-pointer">{LOGIN_BUTTON}</Button>
            </div>
        </div>
    </div>
   </div>
  );
}