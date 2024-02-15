export class ProviderReport{
    id : number = 0;
    providerName : string = '';
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
    isProviderDeleted:number=0;
    refreshProviderLoading:boolean=false;
}