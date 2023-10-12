import NewMeetingBtn from "@/components/NewMeetingBtn";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <NewMeetingBtn />
    </main>
  );
}
