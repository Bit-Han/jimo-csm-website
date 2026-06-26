export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: {
    src: string;
    alt: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: "managing-director",
    name: "John Onyekachi",
    role: "Founder & Managing Director",
    bio: "Leads the overall vision and development strategy across every Jimo project, from site selection to handover.",
    photo: {
      src: "https://images.unsplash.com/photo-1758518729058-b158e71c5a9b?auto=format&fit=crop&w=600&q=80",
      alt: "Portrait of Tunde Jimoh, Founder and Managing Director",
    },
  },
  {
    id: "head-of-sales",
    name: "Amaka Bello",
    role: "Head of Sales & Marketing",
    bio: "Oversees project marketing, buyer and investor relationships, and the sales process from enquiry to documentation.",
    photo: {
      src: "https://images.unsplash.com/photo-1758518729466-827cd8293992?auto=format&fit=crop&w=600&q=80",
      alt: "Portrait of Amaka Bello, Head of Sales and Marketing",
    },
  },
];