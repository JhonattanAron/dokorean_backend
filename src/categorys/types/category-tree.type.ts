export type CategoryTree = {
  _id: any;
  name: string;
  slug: string;
  icon?: string;
  parent: any;
  level: number;
  children: CategoryTree[];
};
