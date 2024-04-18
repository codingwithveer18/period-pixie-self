import { Typography } from "@material-tailwind/react";

export function Footer() {
  return (
    <footer className="bottom-0 w-full flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 px-4 py-6 text-center md:justify-around">
      <Typography color="blue-gray" className="font-normal">
        &copy; 2024 Period Pixie
      </Typography>
      <ul className="flex flex-wrap items-center justify-center gap-y-2 gap-x-8">
        <li>
          <Typography
            as="a"
            href="/about"
            color="blue-gray"
            className="font-normal transition-colors hover:text-red-500 focus:text-red-500"
          >
            About
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="/appointment"
            color="blue-gray"
            className="font-normal transition-colors hover:text-red-500 focus:text-red-500"
          >
            Book Now
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="/tracker"
            color="blue-gray"
            className="font-normal transition-colors hover:text-red-500 focus:text-red-500"
          >
            Tracker
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="/contact"
            color="blue-gray"
            className="font-normal transition-colors hover:text-red-500 focus:text-red-500"
          >
            Contact
          </Typography>
        </li>
        <li>
          <Typography
            as="a"
            href="/blogs"
            color="blue-gray"
            className="font-normal transition-colors hover:text-red-500 focus:text-red-500"
          >
            Blogs
          </Typography>
        </li>
      </ul>
    </footer>
  );
}
