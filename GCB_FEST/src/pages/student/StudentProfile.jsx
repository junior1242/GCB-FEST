import {
  User,
  Mail,
  GraduationCap,
  Hash,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile } from "../../api/authApi";

export default function StudentProfile() {
  const [profileList, setProfileList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => {
        const profileData = data.user || data.data || data;
        setProfileList(
          Array.isArray(profileData) ? profileData : [profileData],
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );

  return (
    <div className="text-white max-w-2xl mx-auto px-4 py-6 md:py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Your Profile
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 mb-4 p-1">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <User size={30} className="text-white/50" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold italic">
            Student Account
          </h2>
        </div>

        <div className="space-y-4">
          {profileList.map((student, index) => (
            <div key={index} className="grid grid-cols-1 gap-4">
              <ProfileItem
                icon={<User size={18} />}
                label="Full Name"
                value={student.name}
              />
              <ProfileItem
                icon={<Mail size={18} />}
                label="Email"
                value={student.email}
              />
              <ProfileItem
                icon={<Hash size={18} />}
                label="Roll Number"
                value={student.rollNumber}
              />
              <ProfileItem
                icon={<BookOpen size={18} />}
                label="Department"
                value={student.department}
              />
              <ProfileItem
                icon={<GraduationCap size={18} />}
                label="Semester"
                value={student.semester}
              />
            </div>
          ))}

          {profileList.length === 0 && (
            <p className="text-center text-slate-400">No profile data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
      <div className="text-blue-500 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
          {label}
        </p>
        <p className="text-slate-200 font-semibold truncate text-sm md:text-base">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
