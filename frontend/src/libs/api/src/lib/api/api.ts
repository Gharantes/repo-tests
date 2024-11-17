export * from './eventoResource.service';
import { EventoResourceService } from './eventoResource.service';
export * from './projetoResource.service';
import { ProjetoResourceService } from './projetoResource.service';
export * from './tenantResource.service';
import { TenantResourceService } from './tenantResource.service';
export * from './usuarioResource.service';
import { UsuarioResourceService } from './usuarioResource.service';
export const APIS = [EventoResourceService, ProjetoResourceService, TenantResourceService, UsuarioResourceService];
