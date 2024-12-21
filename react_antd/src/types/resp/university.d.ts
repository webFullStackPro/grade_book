export interface University {
  id: number;
  name: string;
  establishmentDate: Dayjs;
  contactPhone: string;
  email: string;
  province: string;
  provinceName: string;
  city: string;
  cityName: string;
  area: string;
  areaName: string;
  provinceCityArea?: string[];
  location: string;
  universityDescription: string;
  createTime: string;
  modifyTime: string;
}