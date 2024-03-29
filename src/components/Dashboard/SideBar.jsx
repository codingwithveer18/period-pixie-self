import { useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const solutions = [
    {
      name: "Account",
      href: "/account",
      icon: ChartPieIcon,
    },
    {
      name: "Personal Blogs",
      href: "/pblogs",
      icon: CursorArrowRaysIcon,
    },
    {
      name: "Nearest Hospital or Pharmacy",
      href: "/hospital",
      icon: FingerPrintIcon,
    },
    {
      name: "Appointments",
      href: "/appointments",
      icon: SquaresPlusIcon,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: ArrowPathIcon,
    },
  ];

  return (
    <>
      <Popover className="relative bg-white shadow  w-full py-3 sm:px-6 lg:px-8">
        <Popover.Button
          className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 "
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-lg mx-5 sm:mx-10">Features</span>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Popover.Button>

        {isOpen && (
          <div className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75" />
        )}

        <Transition
          show={isOpen}
          enter="transition ease-out duration-50"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-50"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute left-1/2 z-20 flex w-full max-w-max -translate-x-1/2 px-4 mt-4">
            <div className="w-full max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
              <div className="p-4">
                {solutions.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex gap-x-3 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-wrap items-center">
                      <a
                        href={item.href}
                        className="font-semibold text-gray-900 text-lg"
                      >
                        {item.name}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
}

export default Sidebar;
