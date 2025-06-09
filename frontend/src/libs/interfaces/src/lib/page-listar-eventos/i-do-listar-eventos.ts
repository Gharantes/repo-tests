export interface IDoListarEventos {
    id: number;
    title: string;
    description: string;
    createdByIdAccount: number;
    createdByNameAccount: string;
    bannerUrl?: string;
    userIsMember: boolean;
}