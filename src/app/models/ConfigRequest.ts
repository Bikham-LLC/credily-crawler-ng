import { SubAttributeMap } from "./SubAttributeMap";

export class ConfigRequest{
    crawlerAttributeId : number = 0;
    crawlerAttribute : string = '';
    lookUpElementDesc : string = '';
    elementEvent : string = '';
    className : string = '';
    columnName : string = '';
    pattern : string='';
    dataSourcePath:string='';
    actionButton:string='';
    licenseLookupAttrMapId:number = 0;
    commentStepToggle:boolean = false;
    commentUpdatingToggle:boolean = false;
    isStepCommented:number=0;
    isStepUpdted:boolean = false;
    isNewStep:number=0;
    subAttributeMapList: SubAttributeMap[] = new Array();
    isRemoveAlphabet:number=0;
    credentialType: string ='';
    isProviderCred: number = 0;
}