import Name from "@/components/Name";
import NewMeetingBtn from "@/components/NewMeetingBtn";

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <Name />
      <NewMeetingBtn />
    </main>
  );
}
