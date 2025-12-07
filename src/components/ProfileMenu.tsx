import { User, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { storage, type UserProfile } from '../lib/storage';
import { ProfileEditModal } from './ProfileEditModal';

export function ProfileMenu() {
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  return (
    <>
      <div className="p-4 border-t border-white/20">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all group"
        >
          <div className="bg-white/30 p-2 rounded-lg group-hover:bg-white/40 transition">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
            <p className="text-xs text-white/70">View Profile</p>
          </div>
          <Edit2 className="w-4 h-4 text-white/60 group-hover:text-white transition flex-shrink-0" />
        </button>
      </div>

      <ProfileEditModal
        isOpen={isModalOpen}
        profile={profile}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </>
  );
}
