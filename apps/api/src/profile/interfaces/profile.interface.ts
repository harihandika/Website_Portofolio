export interface ProfileResponse {
  id: string;
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  phone: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  cvUrl: string | null;
  photoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
