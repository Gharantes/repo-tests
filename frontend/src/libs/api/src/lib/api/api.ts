export * from './eventoResource.service';
import { EventoResourceService } from './eventoResource.service';
export * from './projetoResource.service';
import { ProjetoResourceService } from './projetoResource.service';
export * from './systemResource.service';
import { SystemResourceService } from './systemResource.service';
export * from './usuarioResource.service';
import { UsuarioResourceService } from './usuarioResource.service';
export const APIS = [EventoResourceService, ProjetoResourceService, SystemResourceService, UsuarioResourceService];
