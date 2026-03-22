export interface Publication {
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

export const publications: Publication[] = [
  {
    title: "Mit Java funktional programmieren",
    type: "Article",
    venue: "iX 2025/09",
    date: "2025-09",
    language: "German",
    links: [
      {
        label: "Link",
        href: "https://www.heise.de/select/ix/2025/9/2420710214428883635",
      },
    ],
  },
  {
    title: "KI-Assistenten und LLMs – was taugt der Code?",
    type: "Article",
    venue: "iX 2024/07",
    date: "2024-07",
    language: "German",
    links: [
      {
        label: "Link",
        href: "https://www.heise.de/select/ix/2024/7/2412906011970426513",
      },
    ],
  },
  {
    title:
      "Anwendungssicherheit durch einen sicheren Softwareentwicklungslebenszyklus (SDLC)",
    type: "Article",
    venue: "USANCEN: TechGuard 00/23",
    date: "2023-11",
    language: "German",
    links: [
      {
        label: "Link",
        href: "https://cybsec.lawthek.eu/publication-detail/66a8b155-7b82-4083-bd25-54ee718ccd89",
      },
      {
        label: "Download",
        href: "/media/publications/2023-11_USANCEN-TechGuard-2023-00.pdf",
      },
    ],
  },
  {
    title: "Alternatives Autorisierungsmodell",
    type: "Article",
    venue: "OCG Journal 01/2023",
    date: "2023-04",
    language: "German",
    links: [
      {
        label: "Link",
        href: "https://www.ocg.at/publikationen",
      },
      {
        label: "Download",
        href: "/media/publications/2023-04_OCG-Journal-01-2023_IT-Nachwuchsforschung-in-Oesterreich.pdf",
      },
    ],
  },
  {
    title: "Utilizing Object Capabilities to Improve Web Application Security",
    type: "Paper",
    venue: "ACIG Journal 2022, Volume 1",
    date: "2022-11",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://www.acigjournal.com/Utilizing-Object-Capabilities-to-Improve-Web-Application-Security,184282,0,2.html",
      },
      {
        label: "Download",
        href: "/media/publications/2022-11_Utilizing-Capabilities-to-Improve-Web-Application-Security.pdf",
      },
    ],
  },
  {
    title:
      "Object Capabilities and Their Benefits for Web Application Security",
    type: "Thesis",
    venue: "Master thesis",
    date: "2021-10",
    language: "English",
    links: [
      {
        label: "Link",
        href: "https://repositum.tuwien.at/handle/20.500.12708/18849",
      },
      {
        label: "Download",
        href: "/media/publications/2021-10_Michael-Koppmann_Object-Capabilities-and-Their-Benefits-for-Web-Application-Security.pdf",
      },
    ],
  },
];
