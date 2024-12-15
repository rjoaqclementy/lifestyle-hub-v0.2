export interface Profile {
  id: string;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  profile_picture_url: string | null;
  city: string | null;
  country: string | null;
  gender: string | null;
  birthday: string | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
}