import { useCustomQuery } from "./useQuery";

interface Branch {
  id: number;
  name: string;
}
export function useBranchInfo() {
  const currentBranchId = JSON.parse(localStorage.getItem("x-branch-id") || "");

  const { data: branchesResponse } = useCustomQuery("/auth/branches/", [
    "branches",
  ]);

  const currentBranch = branchesResponse?.data.find(
    (branch: Branch) => branch.id === currentBranchId
  );

  return {
    currentBranch,
    currentBranchId,
    branches: branchesResponse?.data || [],
  };
}
