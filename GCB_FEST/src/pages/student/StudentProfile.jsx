import {
  User,
  Mail,
  GraduationCap,
  Hash,
  BookOpen,
  Loader2,  
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../api/authApi";
import toast from "react-hot-toast";

export default function StudentProfile() {
  const [profileList, setProfileList] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for editing semester
  const [isEditing, setIsEditing] = useState(false);
  const [tempSemester, setTempSemester] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setLoading(true);
    getProfile()
      .then((data) => {
        const profileData = data.user || data.data || data;
        const list = Array.isArray(profileData) ? profileData : [profileData];
        setProfileList(list);
        // Initialize temp semester with current value
        if (list.length > 0) setTempSemester(list[0].semester || "");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleUpdateSemester = async () => {
    if (!tempSemester) return toast.error("Please select a semester");

    try {
      setUpdating(true);
      if (tempSemester < profileList[0].semester) {
        toast.error(
          "You can only select a semester equal to or greater than your current semester",
        );
        setUpdating(false);
        return;
      }
      await updateProfile({ semester: tempSemester });
      toast.success("Semester updated successfully!");

      // Update local state so UI refreshes without a full reload
      setProfileList((prev) =>
        prev.map((student) => ({ ...student, semester: tempSemester })),
      );
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update semester");
    } finally {
      setUpdating(false);
    }
  };

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

      <div className="bg-white/5 border border-white/10 rounded-4xl md:rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-tr from-blue-600 to-emerald-500 mb-4 p-1">
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

              {/* Special Editable Item for Semester */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="text-blue-500 shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                      Semester
                    </p>
                    {isEditing ? (
                      <select
                        value={tempSemester}
                        onChange={(e) => setTempSemester(e.target.value)}
                        className="bg-slate-800 border border-blue-500/50 rounded px-2 py-1 text-sm text-white outline-none w-full mt-1"
                        autoFocus
                      >
                        <option value="" disabled>
                          Select Semester
                        </option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num.toString()}>
                            {num}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-slate-200 font-semibold truncate text-sm md:text-base">
                        {student.semester || "N/A"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdateSemester}
                        disabled={updating}
                        className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all"
                      >
                        {updating ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setTempSemester(student.semester);
                        }}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-slate-400 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </div>
              </div>
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
