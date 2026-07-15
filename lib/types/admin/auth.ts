export interface LoginFormState {
	status: "idle" | "error";
	message: string;
}

export interface AcceptInviteFormState {
	status: "idle" | "error";
	message: string;
}

export interface InviteCreatedResult {
	success: boolean;
	message: string;
	inviteLink?: string;
}
