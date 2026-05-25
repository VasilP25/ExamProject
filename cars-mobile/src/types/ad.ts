export type MobileAd = {
  id: number;
  name: string;
  model: string;
  year: number;
  picture: string | null;
  ownerName: string;
  likes: number;
};

export type AdsResponse = {
  ads: MobileAd[];
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type DashboardResponse = {
  ads: MobileAd[];
};
