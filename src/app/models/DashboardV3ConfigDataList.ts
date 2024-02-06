export class DashboardV3ConfigDataList{
    
    totalProvidersAdded:number=0;
    
    boardCompletedConfig:number=0;
    boardFailedConfig:number=0;
    boardNoConfigFound:number=0;
    boardTotalConfigs:number=0;
    boardReRunPending:number=0;
    boardReRunFailed:number=0;

    licenseCompletedConfig:number=0;
    licenseFailedConfig:number=0;
    licenseNoConfigFound:number=0;
    licenseTotalConfigs:number=0;
    licenseReRunPending:number=0;
    licenseReRunFailed:number=0;

    commonCompletedConfig:number=0;
    commonFailedConfig:number=0;
    commonNoConfigFound:number=0;
    commonTotalConfigs:number=0;
    commonReRunPending:number=0;
    commonReRunFailed:number=0;


    taxState:string='';
    count:number=0
    lookupName:string='';
    lookupLink:string='';
}