export type CourseSubject = {
  name: string;
  slug: string;
  description: string;
};

export type CourseConfig = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  subjects: CourseSubject[];
};

export const COURSES: CourseConfig[] = [
  {
    name: "NEET",
    slug: "neet",
    description: "Complete NEET preparation with concepts, notes, quizzes and progress tracking",
    icon: "🩺",
    category: "competitive",
    subjects: [
      {
        name: "Physics",
        slug: "physics",
        description: "Mechanics, Electrodynamics, Modern Physics and more",
      },
      {
        name: "Chemistry",
        slug: "chemistry",
        description: "Physical, Organic and Inorganic Chemistry",
      },
      {
        name: "Biology",
        slug: "biology",
        description: "Botany and Zoology complete syllabus",
      },
    ],
  },
  {
    name: "JEE Main",
    slug: "jee-main",
    description: "Complete JEE Main preparation with concepts, notes, quizzes and progress tracking",
    icon: "⚡",
    category: "competitive",
    subjects: [
      {
        name: "Physics",
        slug: "physics",
        description: "Complete Physics preparation for JEE Main",
      },
      {
        name: "Chemistry",
        slug: "chemistry",
        description: "Physical, Organic and Inorganic Chemistry",
      },
      {
        name: "Mathematics",
        slug: "mathematics",
        description: "Algebra, Calculus, Coordinate Geometry and more",
      },
    ],
  },
];

export function getCourseBySlug(slug: string) {
  return COURSES.find((course) => course.slug === slug);
}
