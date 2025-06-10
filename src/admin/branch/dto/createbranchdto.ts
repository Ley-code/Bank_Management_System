export class CreateBranchDto {
    branchName: string; // Required, unique name of the branch
    city: string; // Optional, city where the branch is located
    totalDeposits: number; // Optional, total deposits in the branch
    totalWithdrawals: number; // Optional, total withdrawals from the branch
    totalLoans: number; // Optional, total loans issued by the branch
}
//update branch dto
export class UpdateBranchDto {
    branchName?: string; // Optional, unique name of the branch
    city?: string; // Optional, city where the branch is located
    totalDeposits?: number; // Optional, total deposits in the branch
    totalWithdrawals?: number; // Optional, total withdrawals from the branch
    totalLoans?: number; // Optional, total loans issued by the branch
}