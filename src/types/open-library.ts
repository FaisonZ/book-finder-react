export interface WorkSearch {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Work[];
}

export interface Work {
  key: string;
  type: "work"
  title: string;
  first_publish_year: number;
  ebook_access: "public" | "borrowable" | "printdisabled" | "no_ebook";
  editions: {
    docs: Edition[];
  };
}

export interface Edition {
  key: string;
  type: "edition";
  title: string;
  subtitle?: string;
  publish_year: number[];
  ebook_access: "public" | "borrowable" | "printdisabled";
  ia: string[];
  has_fulltext: boolean;
}

export interface EditionMetaData {
  server :string;
  dir: string;
  metadata: {
    identifier: string;
    "identifier-access": string;
  };
}
