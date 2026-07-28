export interface DashboardStats {
  totalComparisons: number;
  totalComparisonsDelta: string;
  averageFit: number;
  averageFitMeta: string;
  cvCount: number;
  cvCountMeta: string;
  postingsTracked: number;
  postingsTrackedMeta: string;
}

export const dashboardStats: DashboardStats = {
  totalComparisons: 24,
  totalComparisonsDelta: "+6 this week",
  averageFit: 79,
  averageFitMeta: "across all postings",
  cvCount: 5,
  cvCountMeta: "2 updated recently",
  postingsTracked: 11,
  postingsTrackedMeta: "3 active",
};
