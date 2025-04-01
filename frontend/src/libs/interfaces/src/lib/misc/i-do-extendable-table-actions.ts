export interface IDoExtendableTableActions <T> { 
    label: string,
    icon: '', 
    action: (el: T) => void,
    isAllowed: (el: T) => boolean
}