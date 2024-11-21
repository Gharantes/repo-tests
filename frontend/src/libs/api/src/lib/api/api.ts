export * from './accountResource.service';
import { AccountResourceService } from './accountResource.service';
export * from './eventoResource.service';
import { EventoResourceService } from './eventoResource.service';
export * from './projetoResource.service';
import { ProjetoResourceService } from './projetoResource.service';
export * from './tenantResource.service';
import { TenantResourceService } from './tenantResource.service';
export const APIS = [AccountResourceService, EventoResourceService, ProjetoResourceService, TenantResourceService];
