import { User, Mail, GraduationCap, Hash, BookOpen } from "lucide-react";

export default function StudentProfile() {
  return (
    <div className="text-white max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Profile</h1>
      
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold italic">Student Account</h2>
        </div>

        <div className="space-y-6">
          <ProfileItem icon={<User />} label="Full Name" value="Loading..." />
          <ProfileItem icon={<Mail />} label="Email" value="Loading..." />
          <ProfileItem icon={<Hash />} label="Roll Number" value="Loading..." />
          <ProfileItem icon={<BookOpen />} label="Department" value="Loading..." />
          <ProfileItem icon={<GraduationCap />} label="Semester" value="Loading..." />
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
      <div className="text-blue-500">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</p>
        <p className="text-slate-200 font-semibold">{value}</p>
      </div>
    </div>
  );
}