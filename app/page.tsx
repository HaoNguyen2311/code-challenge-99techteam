import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 mt-20 justify-center items-center">
      <Link className="w-fit" href="solution1">
        Solution 1
      </Link>
      <Link className="w-fit" href="solution2">
        Solution 2
      </Link>
    </div>
  );
}
