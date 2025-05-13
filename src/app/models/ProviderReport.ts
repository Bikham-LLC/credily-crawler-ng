export class ProviderReport{
    
    id : number = 0;
    providerName : string = '';
    accountName:string='';
    npi : string = '';
    email : string = '';
    phone : string = '';
    taxonomy : string = '';
    version : string = '';
    createdDate : string = '';
    updatedDate : string = '';
    status : string = '';
    allocatedQueue : string = '';
    providerUuid:string='';
    scheduledDate:string='';
    lastScheduledDate:string='';
    isProviderDeleted:number=0;
    inValidCount:number=0;
    validCount:number=0;
    refreshProviderLoading:boolean=false;
    isRead:number=0;
}