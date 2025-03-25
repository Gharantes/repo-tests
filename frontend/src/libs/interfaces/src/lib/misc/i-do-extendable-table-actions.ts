export interface IDoExtendableTableActions <T> { 
    label: 'Editar Evento',
    icon: '', 
    action: (el: T) => void,
    isAllowed: (el: T) => boolean
}