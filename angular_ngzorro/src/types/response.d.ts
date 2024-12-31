export interface Response<T> {
  status: number;
  data: Result<T>;
}
