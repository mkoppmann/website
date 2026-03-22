export interface Talk {
  title: string;
  type: string;
  venue: string;
  date: string;
  language: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export const talks: Talk[] = [
  {
    title: "Illegal States Are My Favorite Security Vulnerabilities",
    type: "Tutorial",
    venue: "BOB Konferenz",
    date: "2026-03-13",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://bobkonf.de/2026/koppmann.html",
      },
      {
        label: "Slides",
        href: "/media/talks/2026-03-13_Michael-Koppmann_Illegal-States-Are-My-Favorite-Security-Vulnerabilities.pdf",
      },
    ],
  },
  {
    title: "Got `Any` Excuses? Wie man sicheren TypeScript-Code erzwingen kann",
    type: "Talk",
    venue: "heise devSec()",
    date: "2025-10-01",
    language: "German",
    links: [
      {
        label: "Link",
        href: "https://www.heise-devsec.de/veranstaltung-83508-0-got-any-excuses-wie-man-sicheren-typescript-code-erzwingen-kann.html",
      },
      {
        label: "Slides",
        href: "/media/talks/2025-10-01_Michael-Koppmann_Got-Any-Excuses.pdf",
      },
    ],
  },
  {
    title: "Got `Any` Excuses? Writing secure TypeScript by design",
    type: "Talk",
    venue: "DevSecCon Netherlands",
    date: "2025-09-04",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://www.meetup.com/devseccon-netherlands/events/308897324/?eventOrigin=group_past_events",
      },
      {
        label: "Slides",
        href: "/media/talks/2025-09-04_Michael-Koppmann_Got-Any-Excuses.pdf",
      },
    ],
  },
  {
    title: "The Era of Green Software",
    type: "Talk",
    venue: "sec4dev Dialogues",
    date: "2024-06-26",
    language: "German",
    links: [
      {
        label: "Slides",
        href: "/media/talks/2024-06-26_Michael-Koppmann_The-Era-of-Green-Software.pdf",
      },
    ],
  },
  {
    title: "Typed Security: Preventing Vulnerabilities By Design",
    type: "Talk",
    venue: "WeAreDevelopers Security Day",
    date: "2024-05-08",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://web.archive.org/web/20240501213105/https://www.wearedevelopers.com/event/security-day-may-2024",
      },
      {
        label: "Slides",
        href: "/media/talks/2024-05-08_Michael-Koppmann_Typed-Security.pdf",
      },
      {
        label: "Video",
        href: "https://www.wearedevelopers.com/en/videos/892/typed-security-preventing-vulnerabilities-by-design",
      },
    ],
  },
  {
    title:
      "1.400 hours for the preparation of an ISO27001 certification within 15 minutes and the connex to an espresso",
    type: "Talk",
    venue: "SaaS Club Meetup",
    date: "2024-04-30",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://www.meetup.com/saas-club-vienna/events/299894980/",
      },
      {
        label: "Slides",
        href: "/media/talks/2024-04-30_SBA_ISMS-and-SSDLC.pdf",
      },
    ],
  },
  {
    title:
      "Secure Software Development – A Short Introduction of the OWASP SAMM",
    type: "Talk",
    venue: "B2B Software Days",
    date: "2023-05-09",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://2023.b2bsoftwaredays.com/page-1851",
      },
      {
        label: "Slides",
        href: "/media/talks/2023-05-09_Michael-Koppmann_Secure-Software-Development.pdf",
      },
    ],
  },
  {
    title: "The Era of Green Software",
    type: "Talk",
    venue: "TEDxTUWien",
    date: "2022-12-11",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://www.tedxtuwien.at/turning-points-speaker/michael-koppmann/",
      },
      {
        label: "Slides",
        href: "/media/talks/2022-12-11_Michael-Koppmann_The-Era-of-Green-Software.pdf",
      },
      {
        label: "Video",
        href: "https://youtube.com/watch?v=xtQOxGtmhy4",
      },
    ],
  },
  {
    title: "Type-Driven Domain Design: Use the Types, Luke!",
    type: "Talk",
    venue: "heise devSec()",
    date: "2022-10-05",
    language: "German",
    links: [
      {
        label: "Link",
        href: "https://www.heise-devsec.de/veranstaltung-15107-0-type-driven-domain-design-use-the-types-luke.html",
      },
      {
        label: "Slides",
        href: "/media/talks/2022-10-05_Michael-Koppmann_Type-Driven-Domain-Design.pdf",
      },
    ],
  },
  {
    title:
      "Object Capabilities and Their Benefits for Web Application Security",
    type: "Talk",
    venue: "IKT-Sicherheitskonferenz",
    date: "2022-09-15",
    language: "German",
    links: [
      {
        label: "Link",
        href: "https://web.archive.org/web/20220913184031/https://seminar.bundesheer.at/pdfs/ProgKonferenz.pdf",
      },
      {
        label: "Slides",
        href: "/media/talks/2022-09-15_Michael-Koppmann_Object-Capabilities-and-Their-Benefits-for-Web-Application-Security.pdf",
      },
    ],
  },
  {
    title: "Typed Security – Preventing Vulnerabilities By Design",
    type: "Talk",
    venue: "sec4dev Conference & Bootcamp",
    date: "2022-09-09",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://sec4dev.io/sessions/typed-security-preventing-vulnerabilities-by-design",
      },
      {
        label: "Slides",
        href: "/media/talks/2022-09-09_Michael-Koppmann_Typed-Security.pdf",
      },
      {
        label: "Video",
        href: "https://www.youtube.com/watch?v=TCc6gbTtK8o",
      },
    ],
  },
  {
    title: "Type-Driven Domain Design – Security in the Fabric of Your Code",
    type: "Talk",
    venue: "Domain-Driven Design Vienna Meetup",
    date: "2022-03-25",
    language: "German",
    links: [
      {
        label: "Link",
        href: "https://www.meetup.com/ddd-vienna/events/284335665/",
      },
      {
        label: "Slides",
        href: "/media/talks/2022-03-25_Michael-Koppmann_Type-Driven-Domain-Design.pdf",
      },
    ],
  },
  {
    title: "Type-Driven Domain Design – Security in the Fabric of Your Code",
    type: "Talk",
    venue: "Security Meetup by SBA Research",
    date: "2022-01-26",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://www.meetup.com/security-meetup-by-sba-research/events/283315968/",
      },
      {
        label: "Slides",
        href: "/media/talks/2022-01-26_Michael-Koppmann_Type-Driven-Domain-Design.pdf",
      },
      {
        label: "Video",
        href: "https://www.youtube.com/watch?v=lz1yiHRimwQ",
      },
    ],
  },
];
