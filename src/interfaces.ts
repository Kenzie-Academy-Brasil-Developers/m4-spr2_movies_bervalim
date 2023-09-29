export interface IMovie {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
}

export type TMovieUPdateData = Partial<
  Pick<IMovie, "name" | "category" | "duration" | "price">
>;
