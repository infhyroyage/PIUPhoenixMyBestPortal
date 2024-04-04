import NavBarRight from "./NavBarRight";

export default function NavBar() {
  return (
    <nav className="w-full border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Phoenix My Best List
        </span>
        <NavBarRight />
      </div>
    </nav>
  );
}
